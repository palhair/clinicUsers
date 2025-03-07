import { TDisplayUsers } from '../components/UsersList';
import { IUser } from '../store/usersListState';
import convertDate from './convertDate';

const dataTransform = (users: IUser[]): TDisplayUsers[] => {
	return users.map((user) => {
		const { avatar, first_name, last_name, email, gender, birthdate, id, role } = user;

		return {
			avatar,
			fullName: `${last_name} ${first_name.charAt(0)}`,
			email,
			gender,
			birthdate: convertDate(birthdate),
			key: `${id}`,
			role,
		};
	});
};

export default dataTransform;
