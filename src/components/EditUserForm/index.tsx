import { Button, DatePicker, Drawer, Flex, Form, Radio, RadioChangeEvent, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import { SearchUserInput } from '../SearchUsersInput';
import checkAge from '../../utils/checkAge';
import { selectUserById, TGender, TRole, updateDisplayUser } from '../../store/usersListState';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useAppDispatch, useAppSelector } from '../../store';
import { useUpdateUserMutation } from '../../services/users';
import dayjs from 'dayjs';
import { closeModalForm, showDefaultNotification, showNotification } from '../../store/notificationState';

const roleOptions = [
	{ label: 'Админ', value: 'Админ' },
	{ label: 'Доктор', value: 'Доктор' },
	{ label: 'Медсестра', value: 'Медсестра' },
	{ label: 'Медбрат', value: 'Медбрат' },
];

type TDatePickerValue = {
	//min type
	$d: Date;
};

type TFormValues = {
	user: string;
	birthdate: TDatePickerValue;
	gender: TGender;
	role: TRole;
};

type Props = {
	userId: string | null;
};

export const EditUserForm = ({ userId }: Props) => {
	const [currentRoleOptions, setCurrentRoleOptions] = useState(roleOptions);
	const dispatch = useAppDispatch();
	const [form] = Form.useForm<TFormValues>();
	const [updateUser, { isLoading }] = useUpdateUserMutation();

	const user = useAppSelector((state) => selectUserById(state, userId));
	const open = useAppSelector((state) => state.notificationState.isModalFormOpen);

	const onCloseModal = () => {
		dispatch(closeModalForm());
		form.resetFields();
	};

	const onFinish = async (values: TFormValues) => {
		if (user) {
			try {
				const { gender, role, birthdate } = values;
				const newData = {
					gender,
					role,
					birthdate: birthdate.valueOf() as number,
				};
				await updateUser({ ...newData, id: user.id }).unwrap();
				dispatch(updateDisplayUser({ newData, id: user?.id }));
				dispatch(showDefaultNotification());
			} catch (e) {
				dispatch(showNotification({ type: 'error', title: 'Вернуться к списку', okText: 'Закрыть' }));
				console.error(e);
			} finally {
				onCloseModal();
			}
		}
	};

	const onFinishFailed = (errorInfo: ValidateErrorEntity<TFormValues>) => {
		const firstErrorField = errorInfo.errorFields?.[0]?.name?.[0];

		if (firstErrorField) {
			form.focusField(firstErrorField);
		}
	};

	const onSelectGender = (e: RadioChangeEvent) => {
		const currentRole = form.getFieldValue('role');
		const newGender = e.target.value;
		let newRole = currentRole;

		if (newGender === 'Мужской') {
			setCurrentRoleOptions(roleOptions.filter((option) => option.label != 'Медсестра'));
			if (currentRole == 'Медсестра') newRole = 'Медбрат';
		} else if (newGender === 'Женский') {
			setCurrentRoleOptions(roleOptions.filter((option) => option.label != 'Медбрат'));
			if (currentRole == 'Медбрат') newRole = 'Медсестра';
		}

		setTimeout(() => {
			form.setFieldsValue({
				role: newRole,
			});
		}, 0);
	};

	useEffect(() => {
		if (open) {
			form.setFields([
				{ name: 'birthdate', value: dayjs(user?.birthdate) },
				{ name: 'user', value: user?.last_name },
				{ name: 'gender', value: user?.gender },
				{ name: 'role', value: user?.role },
			]);
		}
	}, [open, form, user]);

	const genderOptions = [
		{ label: 'Женский', value: 'Женский' },
		{ label: 'Мужской', value: 'Мужской' },
	];

	return (
		<>
			<Drawer title='Добавить нового пользователя' placement='right' size='large' onClose={onCloseModal} open={open}>
				<Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed} style={{ height: '100%' }}>
					<Flex vertical justify='space-between' style={{ height: '100%' }}>
						<Space direction='vertical'>
							<Form.Item
								validateTrigger='onBlur'
								label='Пользователь'
								name='user'
								getValueFromEvent={(value) => value}
								rules={[{ required: true, message: 'Выберите пользователя' }]}
							>
								<SearchUserInput />
							</Form.Item>

							<Space>
								<Form.Item
									validateTrigger='onBlur'
									label='Дата рождения'
									name='birthdate'
									rules={[
										{ required: true, message: 'Введите пожалуйста дату' },
										() => ({
											validator(_, value) {
												if (!value || checkAge(value.$d)) {
													return Promise.resolve();
												}

												return Promise.reject(new Error('Возраст меньше 18 лет'));
											},
										}),
									]}
								>
									<DatePicker
										defaultPickerValue={dayjs('2000-01-01')}
										format={{
											format: 'DD.MM.YYYY',
											type: 'mask',
										}}
									/>
								</Form.Item>
								<Form.Item
									validateTrigger='onChange'
									name='gender'
									rules={[{ required: true, message: 'Выберите пол' }]}
								>
									<Radio.Group
										onChange={onSelectGender}
										options={genderOptions}
										block
										optionType='button'
										buttonStyle='solid'
									/>
								</Form.Item>

								<Form.Item
									validateTrigger='onBlur'
									name='role'
									style={{ width: '150px' }}
									rules={[{ required: true, message: 'Выберите роль' }]}
								>
									<Select placeholder='Роль' options={currentRoleOptions} />
								</Form.Item>
							</Space>
						</Space>
						<Space>
							<Form.Item>
								<Button type='primary' size='large' htmlType='submit' loading={isLoading}>
									Сохранить
								</Button>
							</Form.Item>
							<Form.Item>
								<Button onClick={onCloseModal} size='large' htmlType='reset'>
									Отменить
								</Button>
							</Form.Item>
						</Space>
					</Flex>
				</Form>
			</Drawer>
		</>
	);
};
