import React, { useState, useEffect } from 'react';
import {
	Calendar,
	PlusCircle,
	Edit,
	Trash,
	CheckCircle,
	XCircle,
	Clock,
} from 'lucide-react';
import {
	useEvents,
	useCreateEvent,
	useUpdateEvent,
	useDeleteEvent,
	EventFormData,
	useOrganizations,
	useCreateOrganization,
} from '../../services';
import { useAuthContext } from '../../services/keycloak/auth';

export const OrganizerEvents: React.FC = () => {
	const [isCreatingEvent, setIsCreatingEvent] = useState(false);
	const [editingEventId, setEditingEventId] = useState<string | null>(null);
	const [formData, setFormData] = useState<EventFormData>({
		description: '',
		startDateTime: new Date().toISOString().slice(0, 16),
		endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
		organization: '',
		status: 'DRAFT',
	});

	// Используем username пользователя как имя организации
	const { userInfo } = useAuthContext();
	const [organizationId, setOrganizationId] = useState<string>(() => {
		// Пробуем получить ID организации из localStorage при инициализации
		const savedOrgId = localStorage.getItem('organizerOrgId');
		return savedOrgId || '';
	});
	const [organizationCreationInProgress, setOrganizationCreationInProgress] =
		useState(false);

	// Функция для установки ID организации с сохранением в localStorage
	const setAndSaveOrganizationId = (orgId: string) => {
		setOrganizationId(orgId);
		localStorage.setItem('organizerOrgId', orgId);
		console.log('Сохранен ID организации:', orgId);
	};

	// Получаем список организаций и функцию создания организации
	const {
		organizations,
		loading: orgsLoading,
		refetch: refetchOrgs,
	} = useOrganizations();
	const { createOrganization } = useCreateOrganization();

	// При загрузке компонента проверяем, существует ли организация для текущего пользователя
	useEffect(() => {
		const checkAndCreateOrganization = async () => {
			// Предотвращаем множественные создания организации
			if (organizationCreationInProgress) return;

			// Проверяем наличие сохраненного ID организации
			if (organizationId) {
				console.log('Используем сохраненный ID организации:', organizationId);
				return;
			}

			// Ищем организацию для текущего пользователя по ID или по имени
			const userOrg = organizations.find(
				(org) =>
					(userInfo?.sub && org.id === userInfo.sub) ||
					org.name === userInfo?.preferred_username ||
					org.name === userInfo?.name
			);

			if (userOrg) {
				// Организация уже существует, используем ее ID
				console.log('Найдена существующая организация:', userOrg);
				setAndSaveOrganizationId(userOrg.id);
			} else if (!organizationId && userInfo) {
				// Организация не существует, создаем новую
				try {
					setOrganizationCreationInProgress(true);

					// Используем ID пользователя как ID организации, если доступно
					const orgName =
						userInfo?.name ||
						userInfo?.preferred_username ||
						'Организация пользователя';
					console.log('Создаем новую организацию для:', orgName);

					const result = await createOrganization({ name: orgName });
					if (result && result.id) {
						console.log('Организация создана успешно с ID:', result.id);
						setAndSaveOrganizationId(result.id);
					}
					await refetchOrgs(); // Обновляем список организаций
				} catch (err) {
					console.error('Error creating organization:', err);
				} finally {
					setOrganizationCreationInProgress(false);
				}
			}
		};

		if (organizations.length > 0 && userInfo) {
			checkAndCreateOrganization();
		}
	}, [
		organizations,
		userInfo,
		createOrganization,
		refetchOrgs,
		organizationId,
		organizationCreationInProgress,
	]);

	// Получаем список событий с правильно сформированным условием
	const condition = organizationId
		? `it.organization.id=='${organizationId}'`
		: 'it.id!=null'; // Если нет ID организации, запрашиваем все события (потом отфильтруем)

	const { events: allEvents, loading, error, refetch } = useEvents(condition);

	// Фильтруем события, принадлежащие организации пользователя
	const events = organizationId
		? allEvents
		: allEvents.filter((event) => event.organization === organizationId);

	// Хуки для CRUD операций
	const {
		createEvent,
		loading: createLoading,
		error: createError,
	} = useCreateEvent();
	const {
		updateEvent,
		loading: updateLoading,
		error: updateError,
	} = useUpdateEvent();
	const {
		deleteEvent,
		loading: deleteLoading,
		error: deleteError,
	} = useDeleteEvent();

	// Обработчик изменения полей формы
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Создание события
	const handleCreateEvent = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!organizationId.trim()) {
			alert(
				'Для создания события необходимо иметь организацию. Пожалуйста, подождите пока организация создастся или перезагрузите страницу.'
			);
			return;
		}

		try {
			const newEventData = {
				...formData,
				organization: organizationId,
			};

			await createEvent(newEventData);
			setIsCreatingEvent(false);
			setFormData({
				description: '',
				startDateTime: new Date().toISOString().slice(0, 16),
				endDateTime: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
				organization: organizationId,
				status: 'DRAFT',
			});

			refetch();
		} catch (err) {
			console.error('Error creating event:', err);
		}
	};

	// Обновление события
	const handleUpdateEvent = async (id: string, newStatus?: string) => {
		try {
			const updateData = newStatus ? { status: newStatus } : formData;
			await updateEvent(id, updateData);
			setEditingEventId(null);
			refetch();
		} catch (err) {
			console.error('Error updating event:', err);
		}
	};

	// Удаление события
	const handleDeleteEvent = async (id: string) => {
		if (window.confirm('Вы действительно хотите удалить это событие?')) {
			try {
				await deleteEvent(id);
				refetch();
			} catch (err) {
				console.error('Error deleting event:', err);
			}
		}
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'DRAFT':
				return (
					<span className='inline-flex items-center bg-yellow-100 px-2.5 py-0.5 rounded-full font-medium text-yellow-800 text-xs'>
						<Clock className='mr-1 w-3 h-3' />
						Черновик
					</span>
				);
			case 'ACCEPTED':
				return (
					<span className='inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs'>
						<CheckCircle className='mr-1 w-3 h-3' />
						Согласовано
					</span>
				);
			case 'CANCELLED':
				return (
					<span className='inline-flex items-center bg-red-100 px-2.5 py-0.5 rounded-full font-medium text-red-800 text-xs'>
						<XCircle className='mr-1 w-3 h-3' />
						Отменено
					</span>
				);
			case 'CLOSED':
				return (
					<span className='inline-flex items-center bg-blue-100 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs'>
						<CheckCircle className='mr-1 w-3 h-3' />
						Закрыто
					</span>
				);
			default:
				return null;
		}
	};

	useEffect(() => {
		// Выводим отладочную информацию при изменении списка событий
		console.log('События организатора:', events);
		console.log('ID организации:', organizationId);
	}, [events, organizationId]);

	// Добавляем кнопку для ручного сброса ID организации (для отладки)
	const resetOrganizationId = () => {
		localStorage.removeItem('organizerOrgId');
		setOrganizationId('');
		console.log('ID организации сброшен');
	};

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {String(error)}</div>;

	return (
		<div>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='font-semibold text-gray-800 text-xl'>
					Мои события {organizationId ? `(Организация: ${organizationId})` : ''}
				</h2>
				<div className='flex space-x-2'>
					<button
						onClick={resetOrganizationId}
						className='inline-flex items-center bg-gray-200 hover:bg-gray-300 shadow-sm px-3 py-1 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium text-gray-700 text-xs'
						title='Сбросить связь с организацией (для отладки)'
					>
						Сбросить ID орг.
					</button>
					<button
						onClick={() => setIsCreatingEvent(true)}
						className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
						disabled={createLoading || !organizationId}
					>
						<PlusCircle className='mr-2 w-4 h-4' />
						Создать событие
					</button>
				</div>
			</div>

			{!organizationId && (
				<div className='bg-yellow-50 mb-4 p-4 rounded-md'>
					<div className='flex'>
						<div className='text-yellow-700 text-sm'>
							<p className='font-medium'>Организация не найдена</p>
							<p>Дождитесь создания организации или перезагрузите страницу</p>
						</div>
					</div>
				</div>
			)}

			{error && (
				<div className='bg-red-50 mb-4 p-4 rounded-md'>
					<div className='text-red-700 text-sm'>
						Произошла ошибка при загрузке событий: {String(error)}
					</div>
				</div>
			)}

			{isCreatingEvent ? (
				<div className='bg-white shadow mb-6 p-4 rounded-lg overflow-hidden'>
					<h3 className='mb-4 font-medium text-gray-900 text-lg'>
						Новое событие
					</h3>
					<form className='space-y-4' onSubmit={handleCreateEvent}>
						<div>
							<label
								htmlFor='description'
								className='block font-medium text-gray-700 text-sm'
							>
								Описание
							</label>
							<textarea
								id='description'
								name='description'
								rows={3}
								className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
								placeholder='Опишите событие'
								value={formData.description}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className='gap-4 grid grid-cols-2'>
							<div>
								<label
									htmlFor='startDateTime'
									className='block font-medium text-gray-700 text-sm'
								>
									Дата и время начала
								</label>
								<input
									type='datetime-local'
									id='startDateTime'
									name='startDateTime'
									className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									value={formData.startDateTime}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div>
								<label
									htmlFor='endDateTime'
									className='block font-medium text-gray-700 text-sm'
								>
									Дата и время окончания
								</label>
								<input
									type='datetime-local'
									id='endDateTime'
									name='endDateTime'
									className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									value={formData.endDateTime}
									onChange={handleInputChange}
									required
								/>
							</div>
						</div>

						<div className='flex justify-end space-x-3'>
							<button
								type='button'
								onClick={() => setIsCreatingEvent(false)}
								className='bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
							>
								Отмена
							</button>
							<button
								type='submit'
								className='bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
								disabled={createLoading}
							>
								{createLoading ? 'Создание...' : 'Создать'}
							</button>
						</div>
					</form>
				</div>
			) : null}

			{createError && (
				<div className='bg-red-50 mb-4 p-4 rounded-md'>
					<div className='text-red-700 text-sm'>{createError.message}</div>
				</div>
			)}

			{events.length === 0 && !isCreatingEvent ? (
				<div className='bg-gray-50 py-8 rounded-lg text-center'>
					<Calendar className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Нет событий
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						Начните с создания нового события
					</p>
				</div>
			) : (
				<div className='bg-white shadow sm:rounded-md overflow-hidden'>
					<ul className='divide-y divide-gray-200'>
						{events.map((event) => (
							<li key={event.id}>
								<div className='px-4 sm:px-6 py-4'>
									<div className='flex justify-between items-center'>
										<div className='flex items-center'>
											<div className='flex justify-center items-center bg-indigo-100 rounded-full w-10 h-10'>
												<Calendar className='w-6 h-6 text-indigo-500' />
											</div>
											<p className='ml-4 font-medium text-indigo-600 text-sm truncate'>
												{event.description || 'Без описания'}
											</p>
										</div>
										<div className='flex flex-shrink-0 ml-2'>
											{getStatusBadge(event.statusForX?.code || 'DRAFT')}
										</div>
									</div>
									<div className='sm:flex sm:justify-between mt-2'>
										<div className='sm:flex'>
											<p className='flex items-center text-gray-500 text-sm'>
												<Clock className='flex-shrink-0 mr-1.5 w-4 h-4 text-gray-400' />
												{new Date(event.startDateTime || '').toLocaleString(
													'ru-RU'
												)}{' '}
												-{' '}
												{new Date(event.endDateTime || '').toLocaleString(
													'ru-RU'
												)}
											</p>
										</div>
										<div className='flex items-center mt-2 sm:mt-0 text-gray-500 text-sm'>
											<div className='flex space-x-2'>
												<button
													className='text-indigo-600 hover:text-indigo-900'
													onClick={() => {
														setFormData({
															description: event.description || '',
															startDateTime: event.startDateTime
																? new Date(event.startDateTime)
																		.toISOString()
																		.slice(0, 16)
																: '',
															endDateTime: event.endDateTime
																? new Date(event.endDateTime)
																		.toISOString()
																		.slice(0, 16)
																: '',
															organization: organizationId,
															status: event.statusForX?.code || 'DRAFT',
														});
														setEditingEventId(event.id);
													}}
													disabled={updateLoading}
												>
													<Edit className='w-5 h-5' />
												</button>
												<button
													className='text-red-600 hover:text-red-900'
													onClick={() => handleDeleteEvent(event.id)}
													disabled={deleteLoading}
												>
													<Trash className='w-5 h-5' />
												</button>

												{event.statusForX?.code === 'ACCEPTED' && (
													<button
														className='text-blue-600 hover:text-blue-900'
														onClick={() =>
															handleUpdateEvent(event.id, 'CLOSED')
														}
														disabled={updateLoading}
														title='Закрыть событие'
													>
														<CheckCircle className='w-5 h-5' />
													</button>
												)}

												{event.statusForX?.code === 'DRAFT' && (
													<button
														className='text-red-600 hover:text-red-900'
														onClick={() =>
															handleUpdateEvent(event.id, 'CANCELLED')
														}
														disabled={updateLoading}
														title='Отменить событие'
													>
														<XCircle className='w-5 h-5' />
													</button>
												)}
											</div>
										</div>
									</div>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Модальное окно для редактирования события */}
			{editingEventId && (
				<div className='z-50 fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 p-4'>
					<div className='bg-white p-6 rounded-lg w-full max-w-md'>
						<h3 className='mb-4 font-medium text-gray-900 text-lg'>
							Редактирование события
						</h3>

						<form className='space-y-4'>
							<div>
								<label
									htmlFor='edit-description'
									className='block font-medium text-gray-700 text-sm'
								>
									Описание
								</label>
								<textarea
									id='edit-description'
									name='description'
									rows={3}
									className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									value={formData.description}
									onChange={handleInputChange}
								/>
							</div>

							<div className='gap-4 grid grid-cols-2'>
								<div>
									<label
										htmlFor='edit-startDateTime'
										className='block font-medium text-gray-700 text-sm'
									>
										Дата и время начала
									</label>
									<input
										type='datetime-local'
										id='edit-startDateTime'
										name='startDateTime'
										className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
										value={formData.startDateTime}
										onChange={handleInputChange}
									/>
								</div>
								<div>
									<label
										htmlFor='edit-endDateTime'
										className='block font-medium text-gray-700 text-sm'
									>
										Дата и время окончания
									</label>
									<input
										type='datetime-local'
										id='edit-endDateTime'
										name='endDateTime'
										className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
										value={formData.endDateTime}
										onChange={handleInputChange}
									/>
								</div>
							</div>

							<div className='flex space-x-3 mt-5 sm:mt-6'>
								<button
									type='button'
									onClick={() => setEditingEventId(null)}
									className='flex-1 bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
								>
									Отмена
								</button>
								<button
									type='button'
									className='flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
									onClick={() => handleUpdateEvent(editingEventId)}
									disabled={updateLoading}
								>
									{updateLoading ? 'Сохранение...' : 'Сохранить'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
