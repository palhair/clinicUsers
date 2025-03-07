import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type TNotification = {
	open: boolean;
	title: string;
	okText: string;
	type: 'error' | 'success';
	isModalFormOpen: boolean;
};

export const initialState = {
	open: false,
	title: 'Данные успешно сохранены!',
	okText: 'Закрыть',
	type: 'success',
	isModalFormOpen: false,
};

const notificationState = createSlice({
	name: 'notification',
	initialState,
	reducers: {
		showDefaultNotification: (state) => {
			state.title = 'Данные успешно сохранены!';
			state.okText = 'Закрыть';
			state.type = 'success';
			state.open = true;
			state.isModalFormOpen = false;
		},

		showNotification: (state, action: PayloadAction<Omit<TNotification, 'open' | 'isModalFormOpen'>>) => {
			return (state = { ...action.payload, open: true, isModalFormOpen: false });
		},

		closeNotification: (state) => {
			state.open = false;
		},

		showModalForm: (state) => {
			state.isModalFormOpen = true;
		},

		closeModalForm: (state) => {
			state.isModalFormOpen = false;
		},
	},
});
export const { showDefaultNotification, showNotification, closeNotification, showModalForm, closeModalForm } =
	notificationState.actions;

export default notificationState.reducer;
