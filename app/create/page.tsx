export default function CreateRoute() {
	async function createCoordinate(formData: FormData) {
		"use server";
		const rawFormData = {
			video: formData.get("video"),
		};
		console.log("::RAW FORM DATA", rawFormData);

		// mutate data
		// revalidate cache
	}
	return (
		<div className="w-full h-full">
			<form action={createCoordinate} className="w-full h-full">
				<input type="file" name="video" />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
