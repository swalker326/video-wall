import { db } from "../db";
import { Coordinate } from "../modules/editor/CanvasRoot";

export function getCoordinates(surroundingCoordinates: Coordinate[]) {
	return db.query.coordinateTable.findMany({
		where: (table, { inArray }) => {
			return inArray(
				table.coordinates,
				surroundingCoordinates.map((c) => JSON.stringify(c)),
			);
		},
	});
}
