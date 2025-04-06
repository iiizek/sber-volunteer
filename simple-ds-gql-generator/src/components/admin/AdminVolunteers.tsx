import React, { useState } from 'react';
import { Users, PlusCircle, Edit, Trash, Search, X } from 'lucide-react';
import {
	useVolunteers,
	useCreateVolunteer,
	useUpdateVolunteer,
	useDeleteVolunteer,
	VolunteerFormData,
} from '../../services';

export const AdminVolunteers: React.FC = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState('');
	const [formData, setFormData] = useState<VolunteerFormData>({
		firstName: '',
		lastName: '',
	});

	// Получаем список волонтеров без специфичных условий
	// Используем хук без параметров, чтобы получить всех волонтеров
	const { volunteers, loading, error, refetch } = useVolunteers();

	// Хуки для CRUD операций
	const {
		createVolunteer,
		loading: createLoading,
		error: createError,
	} = useCreateVolunteer();
	const {
		updateVolunteer,
		loading: updateLoading,
		error: updateError,
	} = useUpdateVolunteer();
	const {
		deleteVolunteer,
		loading: deleteLoading,
		error: deleteError,
	} = useDeleteVolunteer();

	// Обработчик изменения полей формы
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Обработчик изменения списков (skills, interests)
	const handleListChange = (
		e: React.ChangeEvent<HTMLInputElement>,
		field: 'skills' | 'interests'
	) => {
		const value = e.target.value;
		setFormData((prev) => ({
			...prev,
			[field]: value.split(',').map((item) => item.trim()),
		}));
	};

	// Создание волонтера
	const handleCreateVolunteer = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await createVolunteer(formData);
			setIsCreating(false);
			setFormData({
				firstName: '',
				lastName: '',
			});
			refetch();
		} catch (err) {
			console.error('Error creating volunteer:', err);
		}
	};

	// Обновление волонтера
	const handleUpdateVolunteer = async (e: React.FormEvent) => {
		e.preventDefault();

		if (editingId) {
			try {
				await updateVolunteer(editingId, formData);
				setEditingId(null);
				setFormData({
					firstName: '',
					lastName: '',
				});
				refetch();
			} catch (err) {
				console.error('Error updating volunteer:', err);
			}
		}
	};

	// Удаление волонтера
	const handleDeleteVolunteer = async (id: string) => {
		if (window.confirm('Вы действительно хотите удалить этого волонтера?')) {
			try {
				await deleteVolunteer(id);
				refetch();
			} catch (err) {
				console.error('Error deleting volunteer:', err);
			}
		}
	};

	// Фильтрация волонтеров по поисковому запросу
	const filteredVolunteers = volunteers.filter((volunteer) => {
		const fullName = `${volunteer.firstName || ''} ${
			volunteer.lastName || ''
		}`.toLowerCase();
		const searchQuery = searchTerm.toLowerCase();

		return fullName.includes(searchQuery);
	});

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='font-semibold text-gray-900 text-2xl'>
					Управление волонтерами
				</h1>
				<button
					onClick={() => setIsCreating(true)}
					className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
				>
					<PlusCircle className='mr-2 w-5 h-5' />
					Добавить волонтера
				</button>
			</div>

			{/* Форма поиска */}
			<div className='mb-6'>
				<div className='relative shadow-sm rounded-md'>
					<div className='left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none'>
						<Search className='w-5 h-5 text-gray-400' />
					</div>
					<input
						type='text'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						className='block bg-white py-2 pr-10 pl-10 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full sm:text-sm leading-5 placeholder-gray-500 focus:placeholder-gray-400'
						placeholder='Поиск волонтеров...'
					/>
					{searchTerm && (
						<div className='right-0 absolute inset-y-0 flex items-center pr-3'>
							<button
								onClick={() => setSearchTerm('')}
								className='focus:outline-none text-gray-400 hover:text-gray-500'
							>
								<X className='w-5 h-5' />
							</button>
						</div>
					)}
				</div>
			</div>

			{(isCreating || editingId) && (
				<div className='bg-white shadow mb-6 p-6 sm:rounded-md'>
					<h2 className='mb-4 font-medium text-gray-900 text-lg'>
						{editingId
							? 'Редактировать волонтера'
							: 'Добавить нового волонтера'}
					</h2>
					<form
						onSubmit={editingId ? handleUpdateVolunteer : handleCreateVolunteer}
						className='space-y-6'
					>
						<div className='gap-x-4 gap-y-6 grid grid-cols-1 sm:grid-cols-6'>
							<div className='sm:col-span-3'>
								<label
									htmlFor='firstName'
									className='block font-medium text-gray-700 text-sm'
								>
									Имя
								</label>
								<div className='mt-1'>
									<input
										type='text'
										name='firstName'
										id='firstName'
										value={formData.firstName}
										onChange={handleInputChange}
										className='block shadow-sm border-gray-300 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full sm:text-sm'
										required
									/>
								</div>
							</div>

							<div className='sm:col-span-3'>
								<label
									htmlFor='lastName'
									className='block font-medium text-gray-700 text-sm'
								>
									Фамилия
								</label>
								<div className='mt-1'>
									<input
										type='text'
										name='lastName'
										id='lastName'
										value={formData.lastName}
										onChange={handleInputChange}
										className='block shadow-sm border-gray-300 focus:border-indigo-500 rounded-md focus:ring-indigo-500 w-full sm:text-sm'
										required
									/>
								</div>
							</div>
						</div>
						<div className='flex justify-end space-x-3'>
							<button
								type='button'
								onClick={() => {
									setIsCreating(false);
									setEditingId(null);
									setFormData({
										firstName: '',
										lastName: '',
									});
								}}
								className='bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
							>
								Отмена
							</button>
							<button
								type='submit'
								className='bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
								disabled={createLoading || updateLoading}
							>
								{createLoading || updateLoading
									? 'Сохранение...'
									: editingId
									? 'Обновить'
									: 'Создать'}
							</button>
						</div>
					</form>
				</div>
			)}

			{(createError || updateError || deleteError) && (
				<div className='bg-red-50 mb-6 p-4 rounded-md'>
					<div className='text-red-700 text-sm'>
						{createError?.message ||
							updateError?.message ||
							deleteError?.message}
					</div>
				</div>
			)}

			{volunteers.length === 0 && !isCreating ? (
				<div className='bg-white shadow py-12 sm:rounded-md text-center'>
					<Users className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Нет волонтеров
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						Начните с добавления нового волонтера
					</p>
					<div className='mt-6'>
						<button
							type='button'
							onClick={() => setIsCreating(true)}
							className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
						>
							<PlusCircle className='mr-2 w-5 h-5' />
							Добавить волонтера
						</button>
					</div>
				</div>
			) : filteredVolunteers.length === 0 ? (
				<div className='bg-white shadow py-12 sm:rounded-md text-center'>
					<Search className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Ничего не найдено
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						По запросу "{searchTerm}" волонтеры не найдены
					</p>
					<div className='mt-6'>
						<button
							type='button'
							onClick={() => setSearchTerm('')}
							className='inline-flex items-center bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
						>
							Очистить поиск
						</button>
					</div>
				</div>
			) : (
				<div className='bg-white shadow sm:rounded-md overflow-hidden'>
					<ul className='divide-y divide-gray-200'>
						{filteredVolunteers.map((volunteer) => (
							<li key={volunteer.id}>
								<div className='px-4 sm:px-6 py-5'>
									<div className='flex justify-between items-center'>
										<div>
											<h3 className='font-medium text-gray-900 text-lg'>
												{volunteer.firstName} {volunteer.lastName}
											</h3>
										</div>
										<div className='flex space-x-3'>
											<button
												onClick={() => {
													setFormData({
														firstName: volunteer.firstName || '',
														lastName: volunteer.lastName || '',
													});
													setEditingId(volunteer.id);
													setIsCreating(false);
												}}
												className='text-indigo-600 hover:text-indigo-900'
												disabled={updateLoading}
											>
												<Edit className='w-5 h-5' />
											</button>
											<button
												onClick={() => handleDeleteVolunteer(volunteer.id)}
												className='text-red-600 hover:text-red-900'
												disabled={deleteLoading}
											>
												<Trash className='w-5 h-5' />
											</button>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};
