import { Readable } from "node:stream";
import { Upload } from "@aws-sdk/lib-storage";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { IStorageProvider } from "./IStorageProvider";

export class S3StorageProvider implements IStorageProvider {
	private bucketName: string;
	private s3: S3Client;

	constructor(bucketName: string) {
		this.bucketName = bucketName;

		const region = process.env.AWS_REGION;
		const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
		const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
		const awsEndpoint = process.env.AWS_ENDPOINT;

		if (
			!region ||
			!bucketName ||
			!accessKeyId ||
			!secretAccessKey ||
			!awsEndpoint
		) {
			throw new Error("Missing AWS environment variables");
		}
		this.s3 = new S3Client({
			region: region,
			endpoint: awsEndpoint,
			credentials: {
				accessKeyId: accessKeyId,
				secretAccessKey: secretAccessKey,
			},
		});
	}
	async getSignedUrl(name: string): Promise<string> {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: name,
		});
		const signedUrl = await getSignedUrl(this.s3, command, {
			expiresIn: 3600,
		});
		return signedUrl;
	}

	async uploadFile({
		data,
		destination,
		name,
	}: {
		data: ReadableStream;
		destination: string;
		name: string;
	}): Promise<string> {
		const command = {
			Bucket: this.bucketName,
			Key: name,
			Body: data,
			ContentType: "video/mp4",
		};
		try {
			console.log("uploading file to s3");
			await new Upload({
				client: this.s3,
				leavePartsOnError: false,
				params: command,
			}).done();
			return name;
		} catch (error) {
			console.error("Error uploading file", error);
			throw error;
		}
	}
}
