import { useState } from 'react';
import { useDeleteUserMutation } from '../../services/users';
import { useAppDispatch, useAppSelector } from '../../store';
import { DeleteOutlined } from '@ant-design/icons';
import { Button, Flex, Image, Modal, Typography } from 'antd';
import { deleteDisplayUser, selectUserById } from '../../store/usersListState';
import { showDefaultNotification, showNotification } from '../../store/notificationState';
import deleteIcon from '../../assets/delete.png';

type Props = {
	userId: number;
};

export const DeleteUserModal = ({ userId }: Props) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const user = useAppSelector((state) => selectUserById(state, userId));
	const [deleteUser, { isLoading }] = useDeleteUserMutation();
	const dispatch = useAppDispatch();

	const handleDelete = async () => {
		try {
			await deleteUser(userId).unwrap();
			dispatch(deleteDisplayUser(userId));
			dispatch(showDefaultNotification());
		} catch (error) {
			dispatch(showNotification({ type: 'error', title: 'Вернуться к списку', okText: 'Закрыть' }));
			console.error('Ошибка удаления:', error);
		}
	};

	return (
		<>
			<Button
				onClick={() => setIsModalOpen(true)}
				variant="filled"
				icon={<DeleteOutlined />}
				style={{ padding: 10, border: 'none' }}
			/>

			<Modal
				open={isModalOpen}
				onOk={handleDelete}
				confirmLoading={isLoading}
				onCancel={() => setIsModalOpen(false)}
				footer={
					<Flex justify="space-around">
						<Button loading={isLoading} size="large" variant={'solid'} color={'red'} onClick={handleDelete}>
							Удалить
						</Button>
						<Button size="large" variant={'filled'} color={'red'} onClick={() => setIsModalOpen(false)}>
							Отменить
						</Button>
					</Flex>
				}
			>
				<Flex vertical justify="center" align="center">
					<Image src={deleteIcon} />
					<Typography.Paragraph>Вы хотите удалить пользователя:</Typography.Paragraph>
					<Typography.Paragraph
						style={{ fontSize: '1.125rem', fontWeight: 600 }}
						strong={true}
					>{`${user?.last_name} ${user?.first_name}`}</Typography.Paragraph>
				</Flex>
			</Modal>
		</>
	);
};
