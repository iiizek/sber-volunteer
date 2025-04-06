import React, { useState } from 'react';
import { Building, PlusCircle, Edit, Trash } from 'lucide-react';
import {
	useOrganizations,
	useCreateOrganization,
	useUpdateOrganization,
	useDeleteOrganization,
} from '../../services';

type OrganizationFormData = {
	name: string;
};

export const AdminOrganizations: React.FC = () => {
	const [isCreating, setIsCreating] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<OrganizationFormData>({
		name: '',
	});

	// Получаем список организаций
	const { organizations, loading, error, refetch } = useOrganizations();

	// Хуки для CRUD операций
	const {
		createOrganization,
		loading: createLoading,
		error: createError,
	} = useCreateOrganization();
	const {
		updateOrganization,
		loading: updateLoading,
		error: updateError,
	} = useUpdateOrganization();
	const {
		deleteOrganization,
		loading: deleteLoading,
		error: deleteError,
	} = useDeleteOrganization();

	// Обработчик изменения полей формы
	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Создание организации
	const handleCreateOrganization = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await createOrganization(formData);
			setIsCreating(false);
			setFormData({ name: '' });
			refetch();
		} catch (err) {
			console.error('Error creating organization:', err);
		}
	};

	// Обновление организации
	const handleUpdateOrganization = async (e: React.FormEvent) => {
		e.preventDefault();

		if (editingId) {
			try {
				await updateOrganization(editingId, formData);
				setEditingId(null);
				setFormData({ name: '' });
				refetch();
			} catch (err) {
				console.error('Error updating organization:', err);
			}
		}
	};

	// Удаление организации
	const handleDeleteOrganization = async (id: string) => {
		if (window.confirm('Вы действительно хотите удалить эту организацию?')) {
			try {
				await deleteOrganization(id);
				refetch();
			} catch (err) {
				console.error('Error deleting organization:', err);
			}
		}
	};

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='font-semibold text-gray-900 text-2xl'>
					Управление организациями
				</h1>
				<button
					onClick={() => setIsCreating(true)}
					className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
				>
					<PlusCircle className='mr-2 w-5 h-5' />
					Добавить организацию
				</button>
			</div>

			{(isCreating || editingId) && (
				<div className='bg-white shadow mb-6 p-6 sm:rounded-md'>
					<h2 className='mb-4 font-medium text-gray-900 text-lg'>
						{editingId
							? 'Редактировать организацию'
							: 'Добавить новую организацию'}
					</h2>
					<form
						onSubmit={
							editingId ? handleUpdateOrganization : handleCreateOrganization
						}
					>
						<div className='mb-4'>
							<label
								htmlFor='name'
								className='block font-medium text-gray-700 text-sm'
							>
								Название организации
							</label>
							<input
								type='text'
								name='name'
								id='name'
								value={formData.name}
								onChange={handleInputChange}
								className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
								required
							/>
						</div>
						<div className='flex justify-end space-x-3'>
							<button
								type='button'
								onClick={() => {
									setIsCreating(false);
									setEditingId(null);
									setFormData({ name: '' });
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

			{organizations.length === 0 && !isCreating ? (
				<div className='bg-white shadow py-12 sm:rounded-md text-center'>
					<Building className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Нет организаций
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						Начните с добавления новой организации
					</p>
					<div className='mt-6'>
						<button
							type='button'
							onClick={() => setIsCreating(true)}
							className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
						>
							<PlusCircle className='mr-2 w-5 h-5' />
							Добавить организацию
						</button>
					</div>
				</div>
			) : (
				<div className='bg-white shadow sm:rounded-md overflow-hidden'>
					<ul className='divide-y divide-gray-200'>
						{organizations.map((org) => (
							<li key={org.id}>
								<div className='px-4 sm:px-6 py-4'>
									<div className='flex justify-between items-center'>
										<div className='flex items-center'>
											<Building className='mr-3 w-6 h-6 text-gray-400' />
											<p className='font-medium text-indigo-600 text-sm truncate'>
												{org.name}
											</p>
										</div>
										<div className='flex space-x-3'>
											<button
												onClick={() => {
													setFormData({ name: org.name || '' });
													setEditingId(org.id);
													setIsCreating(false);
												}}
												className='text-indigo-600 hover:text-indigo-900'
												disabled={updateLoading}
											>
												<Edit className='w-5 h-5' />
											</button>
											<button
												onClick={() => handleDeleteOrganization(org.id)}
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
