import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';
import { checkRateLimit, getClientIP } from '@/lib/rate-limit';

const BUCKET = process.env.AWS_BUCKET_NAME || 'sha-documents';
const REGION = process.env.AWS_REGION       || 'eu-west-1';

// Allowed file types and extensions
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'pdf'];

function getS3Client() {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    return null;
  }
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

// GET: generate a pre-signed PUT URL for direct browser -> S3 upload
export async function GET(req: NextRequest) {
  // Rate limit: 20 upload URL requests per minute per IP
  const ip = getClientIP(req);
  const rl = checkRateLimit(`upload:${ip}`, { max: 20, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'upload';
    const fileType = searchParams.get('fileType') || 'application/octet-stream';

    // Validate file type
    if (!ALLOWED_TYPES.includes(fileType)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Upload JPG, PNG, WEBP or PDF only.' },
        { status: 415 }
      );
    }

    // Validate file extension
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json(
        { error: 'Unsupported file extension.' },
        { status: 415 }
      );
    }

    const s3 = getS3Client();
    if (!s3) {
      return NextResponse.json(
        { error: 'S3 not configured. Use POST endpoint instead.' },
        { status: 503 }
      );
    }

    const key = `uploads/${randomUUID()}.${ext}`;

    const command = new PutObjectCommand({
      Bucket:      BUCKET,
      Key:         key,
      ContentType: fileType,
    });

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 300 }); // 5 min TTL

    return NextResponse.json({ uploadUrl, key }, { status: 200 });
  } catch (error) {
    console.error('[API /upload GET]', error);
    return NextResponse.json({ error: 'Could not generate upload URL.' }, { status: 500 });
  }
}

// POST: fallback multipart upload (used when S3 pre-signed URL unavailable)
export async function POST(req: NextRequest) {
  // Rate limit: 10 uploads per minute per IP
  const ip = getClientIP(req);
  const rl = checkRateLimit(`upload-post:${ip}`, { max: 10, windowSec: 60 });
  if (!rl.allowed) {
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 413 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Upload JPG, PNG, WEBP or PDF.' },
        { status: 415 }
      );
    }

    // Also validate extension from filename
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return NextResponse.json({ error: 'Unsupported file extension.' }, { status: 415 });
    }

    const s3 = getS3Client();

    if (s3) {
      const key  = `uploads/${randomUUID()}.${ext}`;
      const body = Buffer.from(await file.arrayBuffer());

      await s3.send(
        new PutObjectCommand({
          Bucket:      BUCKET,
          Key:         key,
          Body:        body,
          ContentType: file.type,
        })
      );

      const url = `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
      return NextResponse.json({ success: true, url, key }, { status: 201 });
    }

    // Without S3: store as a base64 data URL (dev/demo only)
    console.warn('[upload] S3 not configured — returning base64 data URL (dev mode only)');
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const dataUrl = `data:${file.type};base64,${base64}`;

    return NextResponse.json(
      { success: true, url: dataUrl, key: `local/${randomUUID()}` },
      { status: 201 }
    );
  } catch (error) {
    console.error('[API /upload POST]', error);
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 });
  }
}
