export function getPersonLabel(number: number) {
	const lastDigit = number % 10;
	const lastTwoDigits = number % 100;

	if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
		return `${number} человек`;
	}

	if (lastDigit === 1) {
		return `${number} человек`;
	} else if (lastDigit >= 2 && lastDigit <= 4) {
		return `${number} человека`;
	} else {
		return `${number} человек`;
	}
}
