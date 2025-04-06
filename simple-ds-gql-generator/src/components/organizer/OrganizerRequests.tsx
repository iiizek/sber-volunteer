import React, { useState } from 'react';
import { useSearchVolonteerEventRequestQuery } from '../../__generate/graphql-frontend';
import { Users, CheckCircle, XCircle, Info, Clock } from 'lucide-react';
import { useUpdateVolunteerRequest } from '../../services';

export const OrganizerRequests: React.FC = () => {
	const { data, loading, error, refetch } =
		useSearchVolonteerEventRequestQuery();
	const { updateRequest, loading: updateLoading } = useUpdateVolunteerRequest();
	const [updatingId, setUpdatingId] = useState<string | null>(null);

	// Обработчик обновления статуса заявки
	const handleUpdateStatus = async (id: string, status: string) => {
		try {
			setUpdatingId(id);
			await updateRequest(id, { status });
			refetch();
		} catch (err) {
			console.error('Error updating volunteer request:', err);
		} finally {
			setUpdatingId(null);
		}
	};

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;

	const requests = data?.searchVolonteerEventRequest.elems || [];

	const getStatusBadge = (status: string) => {
		switch (status) {
			case 'OPEN':
				return (
					<span className='inline-flex items-center bg-blue-100 px-2.5 py-0.5 rounded-full font-medium text-blue-800 text-xs'>
						<Info className='mr-1 w-3 h-3' />
						Открыта
					</span>
				);
			case 'ACCEPTED':
				return (
					<span className='inline-flex items-center bg-green-100 px-2.5 py-0.5 rounded-full font-medium text-green-800 text-xs'>
						<CheckCircle className='mr-1 w-3 h-3' />
						Принята
					</span>
				);
			case 'CANCELLED':
				return (
					<span className='inline-flex items-center bg-red-100 px-2.5 py-0.5 rounded-full font-medium text-red-800 text-xs'>
						<XCircle className='mr-1 w-3 h-3' />
						Отменена
					</span>
				);
			case 'CONFIRMED':
				return (
					<span className='inline-flex items-center bg-purple-100 px-2.5 py-0.5 rounded-full font-medium text-purple-800 text-xs'>
						<CheckCircle className='mr-1 w-3 h-3' />
						Подтверждена
					</span>
				);
			default:
				return null;
		}
	};

	// Функция для получения доступных действий в зависимости от статуса заявки
	const getActionButtons = (request: any) => {
		const isUpdating = updatingId === request.id;
		const status = request.statusForX?.code || 'OPEN';
		// Получаем статус события, если информация о событии доступна
		const eventStatus = request.event?.entityId
			? 'UNKNOWN' // В данном случае у нас нет прямого доступа к статусу события
			: 'DRAFT';

		return (
			<div className='flex space-x-2'>
				{status === 'OPEN' && (
					<>
						<button
							className='disabled:opacity-50 text-green-600 hover:text-green-900'
							onClick={() => handleUpdateStatus(request.id, 'ACCEPTED')}
							disabled={isUpdating || updateLoading}
							title='Принять'
						>
							<CheckCircle className='w-5 h-5' />
						</button>
						<button
							className='disabled:opacity-50 text-red-600 hover:text-red-900'
							onClick={() => handleUpdateStatus(request.id, 'CANCELLED')}
							disabled={isUpdating || updateLoading}
							title='Отклонить'
						>
							<XCircle className='w-5 h-5' />
						</button>
					</>
				)}

				{status === 'ACCEPTED' && (
					<button
						className='disabled:opacity-50 text-purple-600 hover:text-purple-900'
						onClick={() => handleUpdateStatus(request.id, 'CONFIRMED')}
						disabled={isUpdating || updateLoading}
						title='Подтвердить факт работы'
					>
						<Clock className='w-5 h-5' />
					</button>
				)}
			</div>
		);
	};

	return (
		<div>
			<h2 className='mb-4 font-semibold text-gray-800 text-xl'>
				Заявки волонтеров
			</h2>

			{requests.length === 0 ? (
				<div className='bg-gray-50 py-8 rounded-lg text-center'>
					<Users className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>Нет заявок</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						Заявки от волонтеров будут отображаться здесь
					</p>
				</div>
			) : (
				<div className='bg-white shadow rounded-lg overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='divide-y divide-gray-200 min-w-full'>
							<thead className='bg-gray-50'>
								<tr>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Волонтер
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Событие
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Статус
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Действия
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{requests.map((request) => {
									return (
										<tr key={request.id}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='flex justify-center items-center bg-indigo-100 rounded-full w-10 h-10'>
														<Users className='w-6 h-6 text-indigo-500' />
													</div>
													<div className='ml-4'>
														<div className='font-medium text-gray-900 text-sm'>
															ID:{' '}
															{request.volonteer?.id || 'Неизвестный волонтер'}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-gray-900 text-sm'>
													ID события: {request.event?.entityId || 'Нет данных'}
												</div>
												<div className='text-gray-500 text-sm'>
													{request.description || 'Нет описания'}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												{getStatusBadge(request.statusForX?.code || 'OPEN')}
											</td>
											<td className='px-6 py-4 font-medium text-sm whitespace-nowrap'>
												{getActionButtons(request)}
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}
		</div>
	);
};
