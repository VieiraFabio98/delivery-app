import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { serverError } from "@shared/helpers"
import { FastifyRequest } from "fastify"


const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECREST_ACCESS_KEY!
  },
})

const bucket = process.env.S3_BUCKET_NAME

export async function upload(buffer: Buffer, filename: string): Promise<string | > {
  try {
    await s3.send(new PutObjectCommand({
      Bucket: bucket,
      Key: filename,
      Body: buffer,
      ContentType: 'image/jpeg'
    }))

    return `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${filename}`

  } catch(error) {
    return serverError(error as Error)
  }
}

export async function deleteImage() {

}