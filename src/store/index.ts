import { configureStore } from '@reduxjs/toolkit';
import usersListState from './usersListState';
import notificationState from './notificationState';
import { useDispatch, useSelector } from 'react-redux';
import storage from 'redux-persist/lib/storage';
import { baseApi } from '../api/api';
import { persistReducer, persistStore } from 'redux-persist';

const persistConfig = {
	key: 'users',
	storage,
};
const persistedReducer = persistReducer(persistConfig, usersListState);

const store = configureStore({
	reducer: {
		notificationState,
		persistedReducer,
		[baseApi.reducerPath]: baseApi.reducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
			},
		}).concat(baseApi.middleware),
});

export const persistor = persistStore(store);
export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
