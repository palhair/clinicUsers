import { IUser } from '../store/usersListState';

export function isAddedUser(id: number, users: IUser[]) {
	return !users.every((user) => user.id != id);
}
