import { Button, Flex, Image, Modal, Typography } from 'antd';
import error from '../../assets/server_error.png';
import success from '../../assets/success.png';
import { useAppDispatch, useAppSelector } from '../../store';
import { closeNotification } from '../../store/notificationState';

export const NotificationModal = () => {
	const notification = useAppSelector((state) => state.notificationState);
	const dispatch = useAppDispatch();
	const onOk = () => {
		dispatch(closeNotification());
	};
	const isError = notification.type == 'error';

	return (
		<Modal
			open={notification.open}
			onOk={onOk}
			footer={
				<Button onClick={onOk} variant={isError ? 'solid' : 'filled'} color={isError ? 'primary' : 'default'}>
					{notification.okText}
				</Button>
			}
			onCancel={onOk}
		>
			<Flex vertical align='center'>
				{isError ? <Image src={error} /> : <Image src={success} />}
				<Typography.Title level={3}>{notification.title}</Typography.Title>
			</Flex>
		</Modal>
	);
};
