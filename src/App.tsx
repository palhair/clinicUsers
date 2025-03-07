import { Flex, Layout, Space, Typography } from 'antd';
import { AddUserForm } from './components/AddUserForm';
import { UsersList } from './components/UsersList';
import { NotificationModal } from './components/NotificationModal';
import { useAppSelector } from './store';
import { getPersonLabel } from './utils/getPersonLabel';

function App() {
	const users = useAppSelector((state) => state.persistedReducer.usersList);

	const label = getPersonLabel(users.length);

	return (
		<Layout style={{ padding: '20px 30px', margin: 0, minHeight: '100vh' }}>
			<Flex align='center' justify='space-between' style={{ marginBottom: '20px' }}>
				<Space align='baseline'>
					<Typography.Title level={1} style={{ fontSize: '26px', lineHeight: '31.2px', margin: '0' }}>
						Пользователи клиники
					</Typography.Title>
					<Typography>{`${label}`}</Typography>
				</Space>
				<AddUserForm />
			</Flex>

			<UsersList />
			<NotificationModal />
		</Layout>
	);
}

export default App;
