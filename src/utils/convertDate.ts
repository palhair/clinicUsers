const convertDate = (date: string | number) => {
	const dateObj = new Date(date);

	const monthDay = `${dateObj.getDate()}`.padStart(2, '0');
	const month = `${dateObj.getMonth() + 1}`.padStart(2, '0');
	return `${monthDay}.${month}.${dateObj.getFullYear()}`;
};

export default convertDate;
