import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const BUCKET = process.env.AWS_BUCKET_NAME || 'sha-documents';
const REGION = process.env.AWS_REGION       || 'eu-west-1';

// Only initialise the S3 client when credentials are present
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

// ── GET: generate a pre-signed PUT URL for direct browser → S3 upload ──────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get('filename') || 'upload';
    const fileType = searchParams.get('fileType') || 'application/octet-stream';

    const s3 = getS3Client();

    // No AWS credentials → return error so the client falls back to POST
    if (!s3) {
      return NextResponse.json(
        { error: 'S3 not configured. Use POST endpoint instead.' },
        { status: 503 }
      );
    }

    const ext  = filename.split('.').pop() || 'bin';
    const key  = `uploads/${randomUUID()}.${ext}`;

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

// ── POST: fallback multipart upload (used when S3 pre-signed URL unavailable) ──
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 5MB limit.' }, { status: 413 });
    }

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Upload JPG, PNG, WEBP or PDF.' },
        { status: 415 }
      );
    }

    const s3 = getS3Client();

    // ── With S3 credentials: upload to S3 ────────────────────────────────────
    if (s3) {
      const ext  = file.name.split('.').pop() || 'bin';
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

    // ── Without S3: store as a base64 data URL (dev/demo only) ───────────────
    // WARNING: Do NOT use this in production — it doesn't persist across deploys.
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
