import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
	User,
	Calendar,
	Award,
	BookOpen,
	Edit,
	ChevronRight,
} from 'lucide-react';
import {
	useVolunteers,
	useUpdateVolunteer,
	VolunteerFormData,
} from '../../services';

export const VolunteerProfile: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState<VolunteerFormData>({
		firstName: '',
		lastName: '',
	});

	// Получаем информацию о волонтере с корректным форматированием условия
	const condition = id ? `it.id=='${id}'` : 'it.id!=null';
	const { volunteers, loading, error, refetch } = useVolunteers(condition);
	const volunteer = volunteers[0];

	// Хук для обновления информации о волонтере
	const {
		updateVolunteer,
		loading: updateLoading,
		error: updateError,
	} = useUpdateVolunteer();

	// Устанавливаем начальные значения формы при загрузке данных
	React.useEffect(() => {
		if (volunteer) {
			setFormData({
				firstName: volunteer.firstName || '',
				lastName: volunteer.lastName || '',
			});
		}
	}, [volunteer]);

	// Обработчик изменения полей формы
	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Обработчик сохранения изменений
	const handleSaveChanges = async (e: React.FormEvent) => {
		e.preventDefault();
		if (id) {
			try {
				await updateVolunteer(id, formData);
				setIsEditing(false);
				refetch();
			} catch (err) {
				console.error('Error updating volunteer profile:', err);
			}
		}
	};

	// Компонент для отображения наград волонтера
	const AchievementCard = ({
		title,
		description,
	}: {
		title: string;
		description: string;
	}) => (
		<div className='bg-white shadow p-4 rounded-lg'>
			<div className='flex items-center mb-2'>
				<Award className='mr-2 w-5 h-5 text-indigo-500' />
				<h3 className='font-medium text-gray-900'>{title}</h3>
			</div>
			<p className='text-gray-500 text-sm'>{description}</p>
		</div>
	);

	// Компонент для отображения карточки события
	const EventCard = ({ event }: { event: any }) => (
		<div className='bg-white shadow p-4 rounded-lg'>
			<div className='flex justify-between items-center mb-2'>
				<div className='flex items-center'>
					<Calendar className='mr-2 w-5 h-5 text-indigo-500' />
					<h3 className='font-medium text-gray-900'>{event.title}</h3>
				</div>
				<span className='bg-green-100 px-2.5 py-0.5 rounded font-medium text-green-800 text-xs'>
					{event.status}
				</span>
			</div>
			<p className='mb-2 text-gray-500 text-sm'>{event.description}</p>
			<div className='text-gray-500 text-xs'>
				{new Date(event.date).toLocaleDateString()}
			</div>
		</div>
	);

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;
	if (!volunteer) return <div>Волонтер не найден</div>;

	// Временные данные для демонстрации
	const achievements = [
		{
			id: 1,
			title: 'Выдающийся волонтер',
			description: 'За активное участие в более чем 10 мероприятиях',
		},
		{
			id: 2,
			title: 'Помощник года',
			description: 'Награда за особый вклад в развитие сообщества',
		},
	];

	const pastEvents = [
		{
			id: 1,
			title: 'Помощь пожилым людям',
			description: 'Доставка продуктов и лекарств',
			date: '2023-05-15',
			status: 'Завершено',
		},
		{
			id: 2,
			title: 'Уборка парка',
			description: 'Уборка территории городского парка',
			date: '2023-06-22',
			status: 'Завершено',
		},
	];

	const upcomingEvents = [
		{
			id: 3,
			title: 'Образовательный семинар',
			description: 'Помощь в организации образовательного семинара',
			date: '2023-08-10',
			status: 'Ожидается',
		},
	];

	return (
		<div className='mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl'>
			<div className='bg-white shadow mb-6 sm:rounded-lg overflow-hidden'>
				<div className='flex justify-between items-center px-4 sm:px-6 py-5'>
					<div>
						<h2 className='font-semibold text-gray-900 text-xl'>
							Профиль волонтера
						</h2>
						<p className='mt-1 max-w-2xl text-gray-500 text-sm'>
							Информация и статистика
						</p>
					</div>
					{!isEditing && (
						<button
							onClick={() => setIsEditing(true)}
							className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-3 py-1.5 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-xs'
						>
							<Edit className='mr-1 w-4 h-4' />
							Редактировать
						</button>
					)}
				</div>

				{isEditing ? (
					<div className='sm:p-6 px-4 py-5 border-gray-200 border-t'>
						<form onSubmit={handleSaveChanges} className='space-y-6'>
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

							<div className='flex justify-end'>
								<button
									type='button'
									onClick={() => setIsEditing(false)}
									className='bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
								>
									Отмена
								</button>
								<button
									type='submit'
									className='inline-flex justify-center bg-indigo-600 hover:bg-indigo-700 shadow-sm ml-3 px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
									disabled={updateLoading}
								>
									{updateLoading ? 'Сохранение...' : 'Сохранить'}
								</button>
							</div>
						</form>

						{updateError && (
							<div className='bg-red-50 mt-4 p-4 rounded-md'>
								<div className='text-red-700 text-sm'>
									{updateError.message}
								</div>
							</div>
						)}
					</div>
				) : (
					<div className='border-gray-200 border-t'>
						<dl>
							<div className='sm:gap-4 sm:grid sm:grid-cols-3 bg-gray-50 px-4 sm:px-6 py-5'>
								<dt className='font-medium text-gray-500 text-sm'>
									Имя и фамилия
								</dt>
								<dd className='sm:col-span-2 mt-1 sm:mt-0 text-gray-900 text-sm'>
									<div className='flex items-center'>
										<User className='mr-2 w-5 h-5 text-gray-400' />
										{volunteer.firstName} {volunteer.lastName}
									</div>
								</dd>
							</div>
							<div className='sm:gap-4 sm:grid sm:grid-cols-3 bg-white px-4 sm:px-6 py-5'>
								<dt className='font-medium text-gray-500 text-sm'>Ник</dt>
								<dd className='sm:col-span-2 mt-1 sm:mt-0 text-gray-900 text-sm'>
									{volunteer.nickName || 'Не указан'}
								</dd>
							</div>
						</dl>
					</div>
				)}
			</div>

			{/* Достижения */}
			<div className='mb-6'>
				<h3 className='mb-4 font-medium text-gray-900 text-lg'>Достижения</h3>
				<div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
					{achievements.map((achievement) => (
						<AchievementCard
							key={achievement.id}
							title={achievement.title}
							description={achievement.description}
						/>
					))}
				</div>
			</div>

			{/* Предстоящие события */}
			<div className='mb-6'>
				<h3 className='mb-4 font-medium text-gray-900 text-lg'>
					Предстоящие события
				</h3>
				{upcomingEvents.length > 0 ? (
					<div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
						{upcomingEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))}
					</div>
				) : (
					<div className='bg-gray-50 py-8 rounded-lg text-center'>
						<Calendar className='mx-auto w-12 h-12 text-gray-400' />
						<h3 className='mt-2 font-medium text-gray-900 text-sm'>
							Нет предстоящих событий
						</h3>
						<p className='mt-1 text-gray-500 text-sm'>
							На данный момент нет предстоящих событий для участия
						</p>
					</div>
				)}
			</div>

			{/* История участия */}
			<div>
				<h3 className='mb-4 font-medium text-gray-900 text-lg'>
					История участия
				</h3>
				{pastEvents.length > 0 ? (
					<div className='gap-4 grid grid-cols-1 sm:grid-cols-2'>
						{pastEvents.map((event) => (
							<EventCard key={event.id} event={event} />
						))}
					</div>
				) : (
					<div className='bg-gray-50 py-8 rounded-lg text-center'>
						<BookOpen className='mx-auto w-12 h-12 text-gray-400' />
						<h3 className='mt-2 font-medium text-gray-900 text-sm'>
							Нет истории участия
						</h3>
						<p className='mt-1 text-gray-500 text-sm'>
							Этот волонтер пока не участвовал в событиях
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
