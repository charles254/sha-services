import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const BUCKET = process.env.AWS_BUCKET_NAME || 'sha-documents';
const REGION = process.env.AWS_REGION       || 'eu-west-1';
const UPLOAD_DIR = process.env.UPLOAD_DIR   || '/app/public/uploads';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

function getS3Client() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) return null;
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export async function GET(req: NextRequest) {
  const ip = getClientIP(req);
  const rl = checkRateLimit(`upload:${ip}`, { max: 20, windowSec: 60 });
  if (!rl.allowed) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'upload';
    const fileType = searchParams.get('fileType') || 'application/octet-stream';

    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 415 });
    }
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file extension.' }, { status: 415 });
    }

    const s3 = getS3Client();
    if (!s3) {
      // Signal to client to use POST fallback (no error status)
      return NextResponse.json({ uploadUrl: null, key: null, usePost: true }, { status: 200 });
    }

    const key = `uploads/${randomUUID()}.${ext}`;
    const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: fileType });
    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 });
    return NextResponse.json({ uploadUrl, key }, { status: 200 });
  } catch (error) {
    console.error('[API /upload GET]', error);
    return NextResponse.json({ error: 'Could not generate upload URL.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const ip = getClientIP(req);
  const rl = checkRateLimit(`upload-post:${ip}`, { max: 10, windowSec: 60 });
  if (!rl.allowed) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    if (file.size > 5 * 1024 * 1024) return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 413 });
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type.' }, { status: 415 });
    }
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file extension.' }, { status: 415 });
    }

    const s3 = getS3Client();
    if (s3) {
      const key  = `uploads/${randomUUID()}.${ext}`;
      const body = Buffer.from(await file.arrayBuffer());
      await s3.send(new PutObjectCommand({ Bucket: BUCKET, Key: key, Body: body, ContentType: file.type }));
      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      return NextResponse.json({ success: true, url, key }, { status: 201 });
    }

    // Fallback: save to local disk, return public URL
    await mkdir(UPLOAD_DIR, { recursive: true });
    const filename = `${randomUUID()}.${ext}`;
    const filepath = join(UPLOAD_DIR, filename);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filepath, buffer);
    const url = `/uploads/${filename}`;
    return NextResponse.json({ success: true, url, key: `local/${filename}` }, { status: 201 });
  } catch (error) {
    console.error('[API /upload POST]', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
