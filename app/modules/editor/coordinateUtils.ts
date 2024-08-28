export function arrayIncludesArray(
	arrayOfArrays: number[][],
	arrToFind: number[],
): boolean {
	return arrayOfArrays.some(
		(arr) =>
			arr.length === arrToFind.length &&
			arr.every((val, index) => val === arrToFind[index]),
	);
}

export function gatherCoordinates(
	startX: number,
	startY: number,
	total: number,
): [number, number][] {
	const directions = [
		[1, 0], // right
		[0, 1], // down
		[-1, 0], // left
		[0, -1], // up
	];

	const result: [number, number][] = [[startX, startY]];
	let x = startX;
	let y = startY;
	let stepSize = 1;
	let directionIndex = 0;

	while (result.length < total) {
		// Repeat for current step size in both directions
		for (let i = 0; i < 2; i++) {
			for (let j = 0; j < stepSize; j++) {
				// Move in the current direction
				x += directions[directionIndex][0] * 100;
				y += directions[directionIndex][1] * 100;

				// Add the new coordinate to the result
				result.push([x, y]);

				// Stop if we've collected enough coordinates
				if (result.length === total) return result;
			}

			// Change direction
			directionIndex = (directionIndex + 1) % 4;
		}

		// Increase step size after two turns
		stepSize++;
	}

	return result;
}
