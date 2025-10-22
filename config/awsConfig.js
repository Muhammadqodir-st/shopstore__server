const { S3Client } = require('@aws-sdk/client-s3');
require('dotenv').config();

const REGION = process.env.AWS_REGION
if (!REGION) throw new Error('AWS_REGION not defined in .env');

const s3Client = new S3Client({
    REGION: REGION,
    Credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    },
});

module.exports = {
    s3Client,
    bucketName: process.env.AWS_S3_BUCKET_NAME
};