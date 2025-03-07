import { Select, Spin } from 'antd';
import { useGetUsersInfiniteQuery } from '../../services/users';
import { JSX, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAppSelector } from '../../store';
import { isAddedUser } from '../../utils/isAddedUser';
import { ModalFormAddUserToApi } from '../ModalFormAddUserToServer';

type Props = {
	value?: string;
	onChange?: (
		value: string,
		option?:
			| {
					label: JSX.Element;
					value: string;
					disabled?: boolean;
			  }
			| {
					label: JSX.Element;
					value: string;
					disabled?: boolean;
			  }[]
			| undefined
	) => void;
	onBlur?: React.FocusEventHandler<HTMLElement>;
};

export const SearchUserInput = ({ value = '', onChange, onBlur }: Props) => {
	const [selectedValue, setSelectedValue] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const [options, setOptions] = useState<{ label: JSX.Element; value: string; disabled?: boolean }[]>([]);
	const displayedUsers = useAppSelector((state) => state.persistedReducer.usersList);

	const { data, isFetching, fetchNextPage } = useGetUsersInfiniteQuery(8);

	const { ref, inView } = useInView({
		threshold: 0.5,
	});

	useEffect(() => {
		setSelectedValue(value);
	}, [value]);

	useEffect(() => {
		//update options for  user selector
		const users = data?.pages.flatMap((item) => item.data);
		if (users) {
			const options = users?.map((user, index) => {
				return {
					label: (
						<>
							<span>{`${user.last_name} ${user.first_name.charAt(0)}`}</span>
							{index == users.length - 1 ? <div ref={ref} style={{ height: '1px' }}></div> : ''}
						</>
					),
					value: JSON.stringify(user),
					disabled: isAddedUser(user.id, displayedUsers),
				};
			});
			setOptions(options);
		}
	}, [data, ref, displayedUsers]);

	useEffect(() => {
		if (data?.pages && data?.pages[0].total_pages <= data.pages.length) {
			return;
		}
		if (inView) {
			fetchNextPage();
		}
	}, [inView, fetchNextPage]);

	const handleChange = (newValue: string) => {
		if (onChange) {
			onChange(newValue);
		}
		setSelectedValue(newValue);
	};

	const isOptionExists = options?.some((opt) => JSON.parse(opt.value).last_name.toLowerCase() === searchValue.toLowerCase());

	const dropdownRender = (menu: React.ReactNode) => (
		<div>
			{menu}
			{isFetching && <Spin style={{ padding: '8px', textAlign: 'center' }} />}
			{!isOptionExists && <ModalFormAddUserToApi />}
		</div>
	);

	return (
		<>
			<Select
				value={selectedValue}
				onBlur={onBlur}
				onChange={handleChange}
				style={{ width: '100%' }}
				listItemHeight={5}
				listHeight={160}
				showSearch
				placeholder='Фамилия'
				filterOption={(input: string, option) => {
					return (option?.value ? `${JSON.parse(option.value).last_name}` : '')
						.toLowerCase()
						.includes(input.toLowerCase());
				}}
				onSearch={setSearchValue}
				dropdownRender={dropdownRender}
				options={options}
			></Select>
		</>
	);
};
