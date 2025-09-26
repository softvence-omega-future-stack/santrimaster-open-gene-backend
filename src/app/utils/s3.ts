import S3 from 'aws-sdk/clients/s3';

import fs from 'fs';
import { configs } from '../configs';

const s3 = new S3({
    region: configs.aws.region,
    accessKeyId: configs.aws.accessKey,
    secretAccessKey: configs.aws.secret,
});

const uploadToAWS = async (file: any) => {
    const fileContent = fs.readFileSync(file.path);

    const params = {
        Bucket: configs.aws.bucketName as string,
        Key: `photos/${Date.now()}-${file.originalname}`,
        Body: fileContent,
        // ACL: 'public-read',
        ContentType: file.mimetype
    };
    const data = await s3.upload(params).promise();
    fs.unlinkSync(file?.path);
    return data?.Location
};


export const deleteFile = async (fileName: string) => {
    await s3.deleteObject({
        Bucket: configs.aws.bucketName as string,
        Key: `photos/${fileName}`
    }).promise();
};


export default uploadToAWS;