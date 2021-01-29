import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import slugify from 'slugify';

@Injectable()
export class FilesService {
  constructor(
    private readonly configService: ConfigService
  ) { }

  async uploadPublicFile(file, folder:string = '', key:string = '') {
    const sub_folder = folder ? `${folder}/` : ''
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Body: file.buffer,
      Key: key? `${sub_folder}${slugify(key)}`: `${sub_folder}${uuid()}-${slugify(file.originalname)}`,
      ContentType: file.mimetype,
      ACL: 'public-read',
    }).promise();

    return {
      key: uploadResult.Key,
      url: uploadResult.Location
    }
  }

  async deletePublicFile(key: string) {
    const s3 = new S3();
    await s3.deleteObject({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
    }).promise();
    return true
  }


  async uploadPrivateFile(file, folder:string = '', key:string = '') {
    const sub_folder = folder ? `${folder}/` : ''
    const s3 = new S3();
    const uploadResult = await s3.upload({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Body: file.buffer,
      ContentType: file.mimetype,
      Key: key? `${sub_folder}${slugify(key)}`: `${sub_folder}${uuid()}-${slugify(file.originalname)}`,
    }).promise();

    return {
      key: uploadResult.Key,
      url: uploadResult.Location
    }
  }

  async deletePrivateFile(key: string) {
    const s3 = new S3();
    let deleted = await s3.deleteObject({
      Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
      Key: key,
    }).promise();
    return true
  }


  async getSignedPublicFile(key: string, expiry: number = 60 * 30) {
    const s3 = new S3();
    if (key) {
      return s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: key,
        Expires: expiry
      })
    }
  }

  async getSignedPrivateFile(key: string, expiry: number = 60 * 30) {
    const s3 = new S3();
    if (key) {
      return s3.getSignedUrlPromise('getObject', {
        Bucket: this.configService.get('AWS_PRIVATE_BUCKET_NAME'),
        Key: key,
        Expires: expiry
      })
    }
  }
}