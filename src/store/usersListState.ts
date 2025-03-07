import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserDto } from '../services/users';
import { RootState } from '.';

export type TRole = 'Медсестра' | 'Медбрат' | 'Доктор' | 'Админ';
export type TGender = 'Мужской' | 'Женский';

export interface IUser extends UserDto {
	birthdate: number;
	gender: TGender;
	role: TRole;
}

export type TUserState = {
	usersList: IUser[];
	lastAdded: number | null;
};

export const initialState: TUserState = {
	usersList: [],
	lastAdded: null,
};

const usersListState = createSlice({
	name: 'usersList',
	initialState,
	reducers: {
		addDisplayUser: (state, action: PayloadAction<IUser>) => {
			state.usersList = [...state.usersList, action.payload];
			state.lastAdded = action.payload.id;
		},

		deleteDisplayUser: (state, action: PayloadAction<number>) => {
			state.usersList = state.usersList.filter((user) => user.id != action.payload);
		},

		updateDisplayUser: (state, action: PayloadAction<{ id: number; newData: Partial<IUser> }>) => {
			const { id, newData } = action.payload;
			const userIndex = state.usersList.findIndex((user) => user.id === id);

			if (userIndex !== -1) {
				state.usersList[userIndex] = { ...state.usersList[userIndex], ...newData };
			}
		},

		lastAddedReset: (state) => {
			state.lastAdded = null;
		},
	},
});

const selectUsers = (state: RootState) => state.persistedReducer.usersList;

export const selectUserById = createSelector([selectUsers, (_state, userId) => userId], (users, userId) =>
	users.find((user) => user.id == userId)
);

export const { addDisplayUser, deleteDisplayUser, updateDisplayUser, lastAddedReset } = usersListState.actions;
export default usersListState.reducer;
