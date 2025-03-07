import { Button, DatePicker, Drawer, Flex, Form, Radio, RadioChangeEvent, Select, Space } from 'antd';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { SearchUserInput } from '../SearchUsersInput';
import checkAge from '../../utils/checkAge';
import { PlusOutlined } from '@ant-design/icons';
import { addDisplayUser, TGender, TRole } from '../../store/usersListState';
import type { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useAppDispatch } from '../../store';
import { UserDto } from '../../services/users';

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

export const AddUserForm = () => {
	const [open, setOpen] = useState(false);
	const [gender, setGender] = useState('');
	const [currentRoleOptions, setCurrentRoleOptions] = useState(roleOptions);
	const dispatch = useAppDispatch();

	const [form] = Form.useForm<TFormValues>();

	const onClose = () => {
		setOpen(false);
	};

	const onFinish = (values: TFormValues) => {
		const birthdate = values.birthdate.$d.valueOf();
		const { gender, role, user } = values;
		const { id, email, avatar, first_name, last_name } = JSON.parse(user) as UserDto;
		dispatch(addDisplayUser({ birthdate, gender, role, id, email, avatar, first_name, last_name }));
		setOpen(false);
		form.resetFields();
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
		setGender(newGender);
		if (currentRole == 'Медсестра' && newGender == 'Мужской') {
			form.setFieldValue('role', 'Медбрат');
		}
		if (currentRole == 'Медбрат' && newGender == 'Женский') {
			form.setFieldValue('role', 'Медсестра');
		}
	};

	useEffect(() => {
		if (!gender) return;
		if (gender === 'Мужской') {
			setCurrentRoleOptions(roleOptions.filter((option) => option.label != 'Медсестра'));
		} else {
			setCurrentRoleOptions(roleOptions.filter((option) => option.label != 'Медбрат'));
		}
	}, [gender]);

	const genderOptions = [
		{ label: 'Женский', value: 'Женский' },
		{ label: 'Мужской', value: 'Мужской' },
	];

	return (
		<>
			<Button
				onClick={() => setOpen(true)}
				size='large'
				variant='solid'
				color='green'
				icon={
					<PlusOutlined
						style={{
							fontSize: '10px',
							padding: '8px',
							backgroundColor: '#47B26B',
							borderRadius: '16px',
						}}
					/>
				}
			>
				Добавить нового пользователя
			</Button>

			<Drawer title='Добавить нового пользователя' placement='right' size='large' onClose={onClose} open={open}>
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
								<Button type='primary' size='large' htmlType='submit'>
									Добавить
								</Button>
							</Form.Item>
							<Form.Item>
								<Button onClick={onClose} size='large' htmlType='reset'>
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
