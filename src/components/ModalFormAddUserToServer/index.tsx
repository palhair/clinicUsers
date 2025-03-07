import { Button, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useCreateUserMutation, UserDto } from '../../services/users';
import { useAppDispatch } from '../../store';
import { showDefaultNotification, showNotification } from '../../store/notificationState';

export const ModalFormAddUserToApi = () => {
	const [visible, setVisible] = useState(false);

	const [form] = Form.useForm<Omit<UserDto, 'id' | 'avatar'>>();
	const [createUser, { isLoading }] = useCreateUserMutation();

	const dispatch = useAppDispatch();

	const showModal = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
		form.resetFields();
	};

	const handleSubmit = async () => {
		form.submit();
	};

	const onFinishFailed = (errorInfo: ValidateErrorEntity<Omit<UserDto, 'id' | 'avatar'>>) => {
		const firstErrorField = errorInfo.errorFields?.[0]?.name?.[0];

		if (firstErrorField) {
			form.focusField(firstErrorField);
		}
	};

	const onFinish = async (value: Omit<UserDto, 'id' | 'avatar'>) => {
		try {
			await createUser(value).unwrap();
			dispatch(showDefaultNotification());
		} catch (e) {
			dispatch(
				showNotification({
					title: 'Произошла ошибка на сервере',
					type: 'error',
					okText: 'Вернуться к списку',
				})
			);
			console.error(e);
		} finally {
			setVisible(false);
			form.resetFields();
		}
	};

	return (
		<>
			<Button type="primary" size="large" onClick={showModal}>
				Добавить пользователя
			</Button>

			<Modal
				title="Добавить пользователя"
				open={visible}
				onOk={handleSubmit}
				onCancel={handleCancel}
				okText="Добавить"
				cancelText="Отмена"
				confirmLoading={isLoading}
			>
				<Form form={form} layout="vertical" onFinishFailed={onFinishFailed} onFinish={onFinish}>
					<Form.Item
						label="Имя"
						name="first_name"
						rules={[
							{ required: true, message: 'Пожалуйста, введите ваше имя!' },
							{ min: 2, message: 'Имя должно содержать минимум 2 символа!' },
						]}
					>
						<Input placeholder="Введите ваше имя" />
					</Form.Item>

					<Form.Item
						label="Фамилия"
						name="last_name"
						rules={[
							{ required: true, message: 'Пожалуйста, введите вашу фамилию!' },
							{ min: 2, message: 'Фамилия должна содержать минимум 2 символа!' },
						]}
					>
						<Input placeholder="Введите вашу фамилию" />
					</Form.Item>

					<Form.Item
						label="Email"
						name="email"
						rules={[
							{ required: true, message: 'Пожалуйста, введите ваш email!' },
							{ type: 'email', message: 'Введите корректный email!' },
						]}
					>
						<Input placeholder="Введите ваш email" />
					</Form.Item>
				</Form>
			</Modal>
		</>
	);
};
