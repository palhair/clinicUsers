const checkAge = (date: string | number) => {
	const birthdate = new Date(date);

	const today = new Date();

	const age = today.getFullYear() - birthdate.getFullYear();
	const month = today.getMonth();
	const day = today.getDate();

	if (month < birthdate.getMonth() || (month === birthdate.getMonth() && day < birthdate.getDate())) {
		return age - 1 >= 18;
	}
	return age >= 18;
};

export default checkAge;
