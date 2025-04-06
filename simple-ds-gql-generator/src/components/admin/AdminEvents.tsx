import React, { useState } from 'react';
import { Trash, Eye, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { RoleBasedComponent } from '../auth/RoleBasedComponent';
import { useEvents, useDeleteEvent, useUpdateEvent } from '../../services';

export const AdminEvents: React.FC = () => {
	const { events, loading, error, refetch } = useEvents();
	const { deleteEvent, loading: deleteLoading } = useDeleteEvent();
	const { updateEvent, loading: updateLoading } = useUpdateEvent();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	// Функция для форматирования даты и времени
	const formatDateTime = (dateTime: string | null) => {
		if (!dateTime) return 'Не указано';
		return new Date(dateTime).toLocaleString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	// Обработчик удаления события
	const handleDeleteEvent = async (id: string) => {
		try {
			setDeletingId(id);
			await deleteEvent(id);
			refetch();
		} catch (err) {
			console.error('Error deleting event:', err);
		} finally {
			setDeletingId(null);
		}
	};

	// Обработчик обновления статуса события
	const handleUpdateEventStatus = async (id: string, status: string) => {
		try {
			setUpdatingId(id);
			await updateEvent(id, { status });
			refetch();
		} catch (err) {
			console.error('Error updating event status:', err);
		} finally {
			setUpdatingId(null);
		}
	};

	// Вспомогательная функция для отображения действий в зависимости от статуса
	const getActionButtons = (event: any) => {
		const isUpdating = updatingId === event.id;
		const status = event.statusForX?.code || 'DRAFT';

		return (
			<div className='flex justify-end items-center space-x-2'>
				{status === 'DRAFT' && (
					<>
						<button
							className='text-green-600 hover:text-green-900'
							title='Согласовать событие'
							onClick={() => handleUpdateEventStatus(event.id, 'ACCEPTED')}
							disabled={isUpdating}
						>
							<CheckCircle className='w-5 h-5' />
						</button>
						<button
							className='text-red-600 hover:text-red-900'
							title='Отменить событие'
							onClick={() => handleUpdateEventStatus(event.id, 'CANCELLED')}
							disabled={isUpdating}
						>
							<XCircle className='w-5 h-5' />
						</button>
					</>
				)}
				<button
					className='text-indigo-600 hover:text-indigo-900'
					title='Просмотр'
				>
					<Eye className='w-5 h-5' />
				</button>
				<button
					className='text-red-600 hover:text-red-900'
					title='Удалить'
					onClick={() => handleDeleteEvent(event.id)}
					disabled={deleteLoading && deletingId === event.id}
				>
					<Trash className='w-5 h-5' />
				</button>
			</div>
		);
	};

	// Функция для получения цвета статуса
	const getStatusBadgeClass = (status: string) => {
		switch (status) {
			case 'DRAFT':
				return 'bg-yellow-100 text-yellow-800';
			case 'ACCEPTED':
				return 'bg-green-100 text-green-800';
			case 'CANCELLED':
				return 'bg-red-100 text-red-800';
			case 'CLOSED':
				return 'bg-blue-100 text-blue-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	if (loading) return <div className='p-4'>Загрузка событий...</div>;
	if (error)
		return <div className='p-4 text-red-500'>Ошибка: {error.message}</div>;

	return (
		<RoleBasedComponent
			requiredRoles={['admin']}
			fallback={
				<div className='bg-red-50 p-4 text-red-500'>
					У вас нет прав администратора для просмотра событий
				</div>
			}
		>
			<div>
				<div className='flex justify-between items-center mb-4'>
					<h2 className='font-bold text-gray-900 text-xl'>
						События ({events.length})
					</h2>
				</div>

				{events.length > 0 ? (
					<div className='shadow rounded-lg overflow-x-auto'>
						<table className='divide-y divide-gray-200 min-w-full'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'>
										Название
									</th>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'>
										Организатор
									</th>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'>
										Дата начала
									</th>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'>
										Дата окончания
									</th>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'>
										Статус
									</th>
									<th className='px-6 py-3 font-medium text-gray-500 text-xs text-right uppercase tracking-wider'>
										Действия
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{events.map((event) => (
									<tr key={event.id} className='hover:bg-gray-50'>
										<td className='px-6 py-4 whitespace-nowrap'>
											<div className='flex items-center'>
												<Calendar className='mr-2 w-5 h-5 text-gray-400' />
												<div className='font-medium text-gray-900 text-sm'>
													{event.description}
												</div>
											</div>
										</td>
										<td className='px-6 py-4 text-gray-500 text-sm whitespace-nowrap'>
											{event.organization || 'Нет данных'}
										</td>
										<td className='px-6 py-4 text-gray-500 text-sm whitespace-nowrap'>
											{formatDateTime(event.startDateTime)}
										</td>
										<td className='px-6 py-4 text-gray-500 text-sm whitespace-nowrap'>
											{formatDateTime(event.endDateTime)}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`inline-flex px-2 rounded-full font-semibold text-xs leading-5 ${getStatusBadgeClass(
													event.statusForX?.code || 'DRAFT'
												)}`}
											>
												{event.statusForX?.code || 'DRAFT'}
											</span>
										</td>
										<td className='px-6 py-4 font-medium text-sm text-right whitespace-nowrap'>
											{getActionButtons(event)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				) : (
					<div className='bg-white shadow p-6 rounded-lg text-center'>
						<Calendar className='mx-auto w-12 h-12 text-gray-400' />
						<h3 className='mt-2 font-medium text-gray-900 text-lg'>
							Нет событий
						</h3>
						<p className='mt-1 text-gray-500 text-sm'>
							События еще не были созданы или не соответствуют критериям
							фильтра.
						</p>
					</div>
				)}
			</div>
		</RoleBasedComponent>
	);
};
