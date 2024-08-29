import { Readable } from "node:stream";
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

		if (!region || !bucketName || !accessKeyId || !secretAccessKey) {
			throw new Error("Missing AWS environment variables");
		}
		this.s3 = new S3Client({
			region: region,
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
		const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
		return signedUrl;
	}

	async uploadFile({
		data,
		destination,
		name,
	}: {
		data: AsyncIterable<Uint8Array>;
		destination: string;
		name: string;
	}): Promise<string> {
		const readableStream = Readable.from(data);
		const command = new PutObjectCommand({
			Bucket: this.bucketName,
			Key: `${destination}/${name}`,
			Body: readableStream,
		});
		const result = await this.s3.send(command);
		console.log("Upload complete", result.$metadata);
		return name;
	}
}
