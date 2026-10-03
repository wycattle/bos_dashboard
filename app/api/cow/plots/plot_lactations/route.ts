// app/api/cow/plot_lactations/route.ts

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "cow-bucket-613211402323-ap-southeast-7-an";

export async function GET(request: NextRequest) {
  try {
    const s3 = new S3Client({
      region: "ap-southeast-7",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    const { searchParams } = new URL(request.url);
    const wy_id = searchParams.get("wy_id");

    if (!wy_id) {
      return NextResponse.json({ error: "Missing wy_id parameter" }, { status: 400 });
    }

    const key = `plots/Lactation_Curves/cow_${wy_id}_lactation_curves.png`;
    const url = await getSignedUrl(
      s3,
      new GetObjectCommand({ Bucket: BUCKET, Key: key }),
      { expiresIn: 300 }
    );

    return NextResponse.json({ url });
  } catch (err) {
    console.error("API /api/cow/plots/plot_lactations error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}