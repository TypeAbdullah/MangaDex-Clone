import Minio from 'minio';
import dotenv from 'dotenv';
dotenv.config();

export const minioClient = new Minio.Client({
  endPoint: process.env.S3_ENDPOINT?.replace(/^https?:\/\//,'') || 'localhost',
  port: process.env.S3_ENDPOINT && process.env.S3_ENDPOINT.includes('https')?443:9000,
  useSSL: process.env.S3_ENDPOINT?.startsWith('https') ? true : false,
  accessKey: process.env.S3_ACCESS_KEY || 'minioadmin',
  secretKey: process.env.S3_SECRET_KEY || 'minioadmin',
});
