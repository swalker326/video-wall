export interface IStorageProvider {
		getSignedUrl(name: string): Promise<string>;
		uploadFile({
			data,
			destination,
			name,
		}: {
			data: ReadableStream;
			destination: string;
			name: string;
		}): Promise<string>;
	}
