import { S3 } from 'aws-sdk';

const s3 = new S3();

export const uploadFile = async (key: string, body: Buffer): Promise<void> => {
  await s3.upload({ Bucket: 'your_bucket_name', Key: key, Body: body }).promise();
};

export const downloadFile = async (key: string): Promise<Buffer> => {
  const result = await s3.getObject({ Bucket: 'your_bucket_name', Key: key }).promise();
  return result.Body as Buffer;
};