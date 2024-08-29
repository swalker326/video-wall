import { StorageFactory } from "@/app/storage/StorageFactory";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
	console.log("Got to the POST function");
	const formData = await request.formData();
	const file = formData.get("video") as File;
	const data = convertFileToReadableStream(file);
	const uploadHandler = StorageFactory.createStorageProvider(
		"cloudflare",
		"facewall",
	);
	const videoName = await uploadHandler.uploadFile({
		data: data,
		destination: "videos",
		name: file.name,
	});
	return NextResponse.json({ videoName });
}

/*

async function createCoordinate(formData: FormData) {
		"use server";
		const file = formData.get("video") as File;
		if (!file) {
			return NextResponse.json({ error: "No file uploaded" });
		}

		const uploadHandler = StorageFactory.createStorageProvider(
			"cloudflare",
			"facewall",
		);
		const data = convertFileToReadableStream(file);
		console.log(`uploading ${file.name} sending file`);
		const videoName = await uploadHandler.uploadFile({
			data: data,
			destination: "videos",
			name: file.name,
		});
		return NextResponse.json({ videoName });

		// mutate data
		// revalidate cache
	}

*/

function convertFileToReadableStream(file: File): ReadableStream<Uint8Array> {
	return new ReadableStream({
		async start(controller) {
			const reader = file.stream().getReader();

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;
				controller.enqueue(value);
			}

			controller.close();
		},
	});
}
