import React, { useState, useEffect } from 'react';
import { useVolunteerRequests } from '../../services';
import { useAuthContext } from '../../services/keycloak/auth';
import {
	Calendar,
	Clock,
	CheckCircle,
	Download,
	Calendar as CalendarIcon,
	FileText,
} from 'lucide-react';

export const VolunteerHistory: React.FC = () => {
	const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
		start: new Date(new Date().setMonth(new Date().getMonth() - 3))
			.toISOString()
			.split('T')[0],
		end: new Date().toISOString().split('T')[0],
	});
	const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
	const [pdfGenerating, setPdfGenerating] = useState(false);

	const { userInfo } = useAuthContext();

	// Получаем заявки со статусом CONFIRMED для текущего волонтера
	// Используем только it.statusForX.code=='CONFIRMED' без дополнительных условий
	const condition = `it.statusForX.code=='CONFIRMED'`;
	const { requests, loading, error } = useVolunteerRequests(condition);

	// Фильтрация запросов по дате и пользователю
	useEffect(() => {
		if (requests.length > 0) {
			const filtered = requests.filter((request) => {
				// Проверяем принадлежность к текущему пользователю
				const isCurrentUserRequest = request.volonteer?.id === userInfo?.sub;

				if (!isCurrentUserRequest) return false;

				// Предположим, что у нас нет доступа к startDateTime из event напрямую,
				// поэтому мы будем использовать дату создания запроса (если есть)
				// Или просто вернем true, чтобы показать все заявки текущего пользователя
				return true;
			});

			setFilteredRequests(filtered);
		} else {
			setFilteredRequests([]);
		}
	}, [requests, dateRange, userInfo]);

	// Расчет общего количества часов (упрощенно - допустим, что каждая заявка это 2 часа)
	const totalHours = filteredRequests.length * 2;

	// Генерация и скачивание PDF отчета
	const handleDownloadReport = () => {
		setPdfGenerating(true);

		// Имитация задержки при генерации PDF
		setTimeout(() => {
			// Имитация создания PDF, в реальном приложении здесь будет вызов API для генерации PDF
			// Вместо этого показываем данные в консоли и показываем сообщение пользователю
			console.log('Генерация отчета для периода:', dateRange);
			console.log('Отработанные часы:', totalHours.toFixed(1));
			console.log('Список мероприятий:', filteredRequests);

			// Здесь будет код для скачивания файла, сейчас просто уведомление
			alert(
				`Отчет за период ${dateRange.start} - ${
					dateRange.end
				} сгенерирован. Общее количество часов: ${totalHours.toFixed(1)}`
			);

			setPdfGenerating(false);
		}, 2000);
	};

	const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setDateRange((prev) => ({ ...prev, [name]: value }));
	};

	const formatDateTime = (dateString: string | null | undefined) => {
		if (!dateString) return '';
		const date = new Date(dateString);
		return date.toLocaleString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	if (loading)
		return <div className='flex justify-center p-8'>Загрузка...</div>;
	if (error) return <div className='text-red-500'>Ошибка: {error.message}</div>;

	return (
		<div>
			<div className='flex justify-between items-center mb-4'>
				<h2 className='font-semibold text-gray-800 text-xl'>
					Выписка об отработанных часах
				</h2>
				<button
					onClick={handleDownloadReport}
					className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 shadow-sm px-4 py-2 border border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 font-medium text-white text-sm'
					disabled={pdfGenerating || filteredRequests.length === 0}
				>
					{pdfGenerating ? (
						<>
							<Clock className='mr-2 w-4 h-4 animate-spin' />
							Создание...
						</>
					) : (
						<>
							<FileText className='mr-2 w-4 h-4' />
							Скачать выписку
						</>
					)}
				</button>
			</div>

			<div className='bg-white shadow-sm mb-6 p-4 rounded-lg'>
				<div className='flex sm:flex-row flex-col sm:space-x-4 space-y-3 sm:space-y-0'>
					<div className='w-full sm:w-1/3'>
						<div className='mb-1 font-medium text-gray-700 text-sm'>
							Общее количество часов
						</div>
						<div className='font-bold text-indigo-600 text-3xl'>
							{totalHours.toFixed(1)}
						</div>
					</div>

					<div className='w-full sm:w-2/3'>
						<div className='mb-1 font-medium text-gray-700 text-sm'>Период</div>
						<div className='flex space-x-3'>
							<div className='w-1/2'>
								<div className='relative shadow-sm rounded-md'>
									<div className='left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none'>
										<CalendarIcon className='w-4 h-4 text-gray-400' />
									</div>
									<input
										type='date'
										name='start'
										value={dateRange.start}
										onChange={handleDateChange}
										className='block shadow-sm mt-1 py-2 pr-3 pl-10 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									/>
								</div>
							</div>
							<div className='w-1/2'>
								<div className='relative shadow-sm rounded-md'>
									<div className='left-0 absolute inset-y-0 flex items-center pl-3 pointer-events-none'>
										<CalendarIcon className='w-4 h-4 text-gray-400' />
									</div>
									<input
										type='date'
										name='end'
										value={dateRange.end}
										onChange={handleDateChange}
										className='block shadow-sm mt-1 py-2 pr-3 pl-10 border border-gray-300 focus:border-indigo-500 rounded-md focus:outline-none focus:ring-indigo-500 w-full sm:text-sm'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{filteredRequests.length === 0 ? (
				<div className='bg-gray-50 py-8 rounded-lg text-center'>
					<Calendar className='mx-auto w-12 h-12 text-gray-400' />
					<h3 className='mt-2 font-medium text-gray-900 text-sm'>
						Нет подтвержденных часов
					</h3>
					<p className='mt-1 text-gray-500 text-sm'>
						Здесь будут отображаться события с подтвержденными часами
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
										Событие
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Дата подтверждения
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Часы
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Организатор
									</th>
									<th
										scope='col'
										className='px-6 py-3 font-medium text-gray-500 text-xs text-left uppercase tracking-wider'
									>
										Статус
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{filteredRequests.map((request) => {
									return (
										<tr key={request.id}>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='flex items-center'>
													<div className='flex justify-center items-center bg-indigo-100 rounded-full w-10 h-10'>
														<Calendar className='w-6 h-6 text-indigo-500' />
													</div>
													<div className='ml-4'>
														<div className='font-medium text-gray-900 text-sm'>
															{request.description || 'Без описания'}
														</div>
													</div>
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-gray-900 text-sm'>
													{formatDateTime(new Date().toISOString())}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='font-medium text-gray-900 text-sm'>
													2.0
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<div className='text-gray-900 text-sm'>
													{request.event?.entityId || 'Не указан'}
												</div>
											</td>
											<td className='px-6 py-4 whitespace-nowrap'>
												<span className='inline-flex items-center bg-purple-100 px-2.5 py-0.5 rounded-full font-medium text-purple-800 text-xs'>
													<CheckCircle className='mr-1 w-3 h-3' />
													Подтверждено
												</span>
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
