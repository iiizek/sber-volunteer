import React, { useState, useEffect } from 'react';
import {
	useEvents,
	useCreateVolunteerRequest,
	useVolunteers,
} from '../../services';
import { useAuthContext } from '../../services/keycloak/auth';
import { Calendar, Clock, CheckCircle, User, UsersRound } from 'lucide-react';

export const VolunteerEvents: React.FC = () => {
	const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
	const [message, setMessage] = useState('');
	const [submitting, setSubmitting] = useState(false);
	const [successMessage, setSuccessMessage] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [volunteerId, setVolunteerId] = useState<string | null>(null);

	const { userInfo } = useAuthContext();

	// Запрашиваем все существующие профили волонтеров
	const { volunteers, loading: volunteersLoading } = useVolunteers('');

	// Найдем профиль волонтера для текущего пользователя
	useEffect(() => {
		if (volunteers.length > 0 && userInfo) {
			// Попробуем найти волонтера по имени пользователя
			const userId = userInfo.sub || '';
			const userVolunteer = volunteers.find((v) => v.id === userId);

			if (userVolunteer) {
				setVolunteerId(userVolunteer.id);
			} else {
				// Если не нашли, то берем первого волонтера для демонстрации
				// В реальном приложении здесь должна быть логика создания профиля волонтера
				setVolunteerId(volunteers[0].id);
			}
		}
	}, [volunteers, userInfo]);

	// Получаем только события со статусом ACCEPTED
	const { events, loading, error } = useEvents(
		`it.statusForX.code=='ACCEPTED'`
	);
	const { createVolunteerRequest, loading: createLoading } =
		useCreateVolunteerRequest();

	// Обработчик изменения текста сообщения
	const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setMessage(e.target.value);
	};

	// Обработчик отправки заявки
	const handleSubmitRequest = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!selectedEvent || !volunteerId) {
			setErrorMessage(
				'Не удалось отправить заявку. Пожалуйста, проверьте свой профиль и повторите попытку.'
			);
			return;
		}

		try {
			setSubmitting(true);
			setErrorMessage('');

			await createVolunteerRequest({
				description: message,
				volunteerId,
				eventId: selectedEvent,
			});

			setSuccessMessage('Заявка успешно отправлена!');
			setMessage('');
			setSelectedEvent(null);

			// Скрыть сообщение об успехе через 3 секунды
			setTimeout(() => {
				setSuccessMessage('');
			}, 3000);
		} catch (err) {
			console.error('Error submitting request:', err);
			setErrorMessage(
				'Произошла ошибка при отправке заявки. Пожалуйста, попробуйте позже.'
			);
		} finally {
			setSubmitting(false);
		}
	};

	if (loading || volunteersLoading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;

	return (
		<div>
			<h2 className='mb-4 font-semibold text-gray-800 text-xl'>
				Доступные события
			</h2>

			{successMessage && (
				<div className='bg-green-50 mb-4 p-4 rounded-md text-green-800'>
					{successMessage}
				</div>
			)}

			{errorMessage && (
				<div className='bg-red-50 mb-4 p-4 rounded-md text-red-800'>
					{errorMessage}
				</div>
			)}

			{events.length === 0 ? (
				<div className='bg-gray-50 py-8 rounded-lg text-center'>
					<Calendar className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Нет доступных событий
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						На данный момент нет событий, доступных для участия
					</p>
				</div>
			) : (
				<div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'>
					{events.map((event) => (
						<div
							key={event.id}
							className='bg-white shadow hover:shadow-md border border-gray-200 rounded-lg overflow-hidden transition-shadow'
						>
							<div className='p-5'>
								<div className='flex justify-between items-center mb-2'>
									<div className='flex justify-center items-center bg-indigo-100 rounded-full w-10 h-10'>
										<Calendar className='w-6 h-6 text-indigo-500' />
									</div>
									<span className='inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs'>
										<CheckCircle className='mr-1 w-3 h-3' />
										Доступно
									</span>
								</div>

								<h3 className='mb-2 font-medium text-gray-900 text-lg'>
									{event.description || 'Без описания'}
								</h3>

								<div className='space-y-2 mb-3 text-gray-500 text-sm'>
									<div className='flex items-start'>
										<Clock className='mt-0.5 mr-1.5 w-4 h-4 text-gray-400' />
										<div>
											<p>
												Начало:{' '}
												{new Date(event.startDateTime || '').toLocaleString(
													'ru-RU'
												)}
											</p>
											<p>
												Окончание:{' '}
												{new Date(event.endDateTime || '').toLocaleString(
													'ru-RU'
												)}
											</p>
										</div>
									</div>

									<div className='flex items-center'>
										<User className='mr-1.5 w-4 h-4 text-gray-400' />
										<span>
											Организатор: {event.organization || 'Не указан'}
										</span>
									</div>
								</div>

								<button
									className='flex justify-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-full font-medium text-white text-sm'
									onClick={() => setSelectedEvent(event.id)}
									disabled={!volunteerId}
								>
									{volunteerId
										? 'Подать заявку'
										: 'Требуется профиль волонтера'}
								</button>
							</div>
						</div>
					))}
				</div>
			)}

			{/* Модальное окно для подачи заявки */}
			{selectedEvent && (
				<div className='z-50 fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 p-4'>
					<div className='bg-white p-6 rounded-lg w-full max-w-md'>
						<h3 className='mb-4 font-medium text-gray-900 text-lg'>
							Подача заявки на участие
						</h3>

						<form className='space-y-4' onSubmit={handleSubmitRequest}>
							<div>
								<label
									htmlFor='description'
									className='block font-medium text-gray-700 text-sm'
								>
									Комментарий к заявке
								</label>
								<textarea
									id='description'
									name='description'
									rows={3}
									className='block shadow-sm mt-1 px-3 py-2 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									placeholder='Опишите ваш опыт, навыки или почему вы хотите участвовать'
									value={message}
									onChange={handleMessageChange}
								/>
							</div>

							<div className='flex space-x-3 mt-5 sm:mt-6'>
								<button
									type='button'
									onClick={() => setSelectedEvent(null)}
									className='flex-1 bg-white hover:bg-gray-50 shadow-sm px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-gray-700 text-sm'
									disabled={submitting}
								>
									Отмена
								</button>
								<button
									type='submit'
									className='flex-1 bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
									disabled={submitting}
								>
									{submitting ? 'Отправка...' : 'Отправить'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};
