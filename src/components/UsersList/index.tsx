import { Button, Input, Space, Table, TableProps } from 'antd';
import { EditOutlined, SearchOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store';
import { lastAddedReset, TGender } from '../../store/usersListState';
import dataTransform from '../../utils/dataTransform';
import { useEffect, useState } from 'react';
import { EditUserForm } from '../EditUserForm';
import { showModalForm } from '../../store/notificationState';
import { DeleteUserModal } from '../DeleteUserModal';
import style from './UsersList.module.css';
import { sortDate } from '../../utils/sortDate';

export type TDisplayUsers = {
	avatar?: string;
	fullName: string;
	email: string;
	gender: TGender;
	birthdate: string;
	key: string;
};

export const UsersList = () => {
	const [selectedUser, setSelectedUser] = useState<string | null>(null);

	const lastAdded = useAppSelector((state) => state.persistedReducer.lastAdded);
	const users = useAppSelector((state) => state.persistedReducer.usersList);

	const [filteredUsers, setFilteredUsers] = useState(users);

	const dispatch = useAppDispatch();

	const onSearch = (value: string) => {
		const searchText = value.toLowerCase();
		setFilteredUsers(users.filter((user) => user.last_name.toLowerCase().includes(searchText)));
	};

	const handleEdit = (key: string) => {
		setSelectedUser(key);
		dispatch(showModalForm());
	};

	const columns: TableProps<TDisplayUsers>['columns'] = [
		{
			title: 'ФИО пользователя',
			key: 'fullName',
			dataIndex: 'fullName',
			sorter: (a, b) => a.fullName.localeCompare(b.fullName),
		},
		{ title: 'Контактные данные', key: 'email', dataIndex: 'email' },
		{
			title: 'Дата рождения',
			key: 'birthdate',
			dataIndex: 'birthdate',
			sorter: (a, b) => sortDate(a.birthdate, b.birthdate),
		},
		{ title: 'Пол', key: 'gender', dataIndex: 'gender', sorter: (a, b) => a.gender.localeCompare(b.gender) },
		{ title: 'Роль', key: 'role', dataIndex: 'role' },
		{
			title: '',
			width: 100,
			key: 'action',
			fixed: 'right',
			render: (record: { key: string }) => (
				<Space>
					<Button onClick={() => handleEdit(record.key)} variant='filled' style={{ padding: 10, border: 'none' }}>
						<EditOutlined />
					</Button>
					<DeleteUserModal userId={Number(record.key)} />
				</Space>
			),
		},
	];

	useEffect(() => {
		setFilteredUsers(users);
	}, [users]);

	useEffect(() => {
		let timerID: number;

		if (lastAdded) {
			timerID = setTimeout(() => {
				dispatch(lastAddedReset());
			}, 1000);
		}

		return () => {
			clearTimeout(timerID);
		};
	}, [lastAdded]);

	return (
		<>
			<div className={style.inputContainer}>
				<Input
					className={style.searchInput}
					placeholder='Поиск...'
					allowClear
					onChange={(e) => onSearch(e.target.value)}
					prefix={<SearchOutlined className={style.searchIcon} />}
				/>
			</div>
			<Table
				components={{
					header: {
						row: (props) => (
							<tr {...props} className={style.customHeader}>
								{props.children}
							</tr>
						),
					},
					body: {
						row: ({ className, children, ...props }) => {
							const isNewRow = props['data-row-key'] == lastAdded;
							return (
								<motion.tr
									key={props['data-row-key']}
									initial={isNewRow ? { opacity: 0, x: 100 } : false}
									animate={{ opacity: 1, x: 0 }}
									transition={{ duration: 0.3 }}
									className={className}
									{...props}
								>
									{children}
								</motion.tr>
							);
						},
					},
				}}
				columns={columns}
				dataSource={dataTransform(filteredUsers)}
				pagination={false}
			/>

			<EditUserForm userId={selectedUser} />
		</>
	);
};
