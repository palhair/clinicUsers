import { baseApi } from '../api/api';
import { IUser } from '../store/usersListState';

export interface UsersResponse {
	page: number;
	per_page: number;
	total: number;
	total_pages: number;
	data: UserDto[];
}

export type UserDto = {
	id: number;
	email: string;
	first_name: string;
	last_name: string;
	avatar?: string;
};

export const usersApi = baseApi.injectEndpoints({
	endpoints: (build) => ({
		getUsers: build.infiniteQuery<UsersResponse, number, number>({
			infiniteQueryOptions: {
				initialPageParam: 1,
				getNextPageParam: (_lastPage, _allPages, lastPageParam) => lastPageParam + 1,
			},
			query({ queryArg, pageParam }) {
				console.log(queryArg);

				return `/users?page=${pageParam}&per_page=${queryArg}`;
			},
		}),

		createUser: build.mutation<UserDto, Omit<UserDto, 'id'>>({
			query: (user) => ({
				url: '/users',
				method: 'POST',
				body: user,
			}),
		}),

		updateUser: build.mutation<UserDto, Partial<IUser>>({
			query: ({ id, ...patch }) => ({
				url: `/users/${id}`,
				method: 'PATCH',
				body: patch,
			}),
		}),

		replaceUser: build.mutation<UserDto, IUser>({
			query: ({ id, ...user }) => ({
				url: `/users/${id}`,
				method: 'PUT',
				body: user,
			}),
		}),

		deleteUser: build.mutation<void, number>({
			query: (id) => ({ url: `/users/${id}`, method: 'DELETE' }),
		}),
	}),
	overrideExisting: true,
});

export const {
	useGetUsersInfiniteQuery,
	useCreateUserMutation,
	useUpdateUserMutation,
	useReplaceUserMutation,
	useDeleteUserMutation,
} = usersApi;
