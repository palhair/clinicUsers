export function sortDate(a: string, b: string) {
	const [dayA, monthA, yearA] = a.split('.').map(Number);
	const [dayB, monthB, yearB] = b.split('.').map(Number);

	const dateA = new Date(yearA, monthA - 1, dayA);
	const dateB = new Date(yearB, monthB - 1, dayB);

	return dateA.getTime() - dateB.getTime();
}
