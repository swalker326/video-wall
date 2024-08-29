export default function CreateRoute() {
	const formAction = async (formData: FormData) => {
		"use server";
		const response = await fetch("http://localhost:3000/api/upload", {
			method: "POST",
			body: formData,
		});
		const data = await response.json();
		console.log(data);
	};
	return (
		<div className="w-full h-full">
			<form action={formAction} className="w-full h-full" method="POST">
				<input type="file" name="video" />
				<button type="submit">Submit</button>
			</form>
		</div>
	);
}
