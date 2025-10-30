import express from 'express';
import { minioClient } from '../lib/minioClient';
import dotenv from 'dotenv';
dotenv.config();
export const uploadRouter = express.Router();

uploadRouter.post('/presign', async (req, res) => {
  const { filename, contentType } = req.body;
  if (!filename || !contentType) return res.status(400).json({ error: 'Missing fields' });
  const bucket = process.env.S3_BUCKET || 'manga-bucket';
  const objectName = `uploads/${Date.now()}-${filename}`;
  try {
    // Ensure bucket exists - MinIO SDK uses makeBucket
    try { await minioClient.makeBucket(bucket); } catch(e){}
    const expiry = 60 * 60; // 1 hour
    const presignedUrl = await minioClient.presignedPutObject(bucket, objectName, expiry);
    res.json({ key: objectName, url: presignedUrl });
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});