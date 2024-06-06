import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private minioUrl = 'http://localhost:9000';
  private bucketName = 'my-bucket'; // Replace 'my-bucket' with your bucket name
  private accessKeyId = 'username'; // Replace with your Minio access key
  private secretAccessKey = 'password'; // Replace with your Minio secret key
  private region = 'us-east-1';

  private s3Client: S3Client;

  constructor(private http: HttpClient) {
    this.s3Client = new S3Client({
      endpoint: this.minioUrl,
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey
      },
      forcePathStyle: true // needed with Minio
    });
  }

  uploadFiles(files: File[]): Observable<any[]> {
    const uploadRequests = files.map(file => {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: file.name,
        Body: file,
        ContentType: file.type
      });

      return new Observable((observer) => {
        getSignedUrl(this.s3Client, command, { expiresIn: 3600 }).then(
          (signedUrl) => {
            this.http.put(signedUrl, file).subscribe(
              (response) => {
                observer.next(response);
                observer.complete();
              },
              (error) => {
                observer.error(error);
              }
            );
          },
          (error) => {
            observer.error(error);
          }
        );
      });
    });

    return forkJoin(uploadRequests);
  }
}
