import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../services/keycloak/auth';
import {
	Building as BuildingIcon,
	Calendar as CalendarIcon,
	Users as UsersIcon,
} from 'lucide-react';

export const HomePage: React.FC = () => {
	const { isAuth, roles, userInfo } = useAuthContext();

	// Проверка на наличие определенной роли
	const hasRole = (role: string) => roles?.includes(role);

	// Функция для получения доступных разделов
	const getAvailableSections = () => {
		const sections = [];

		if (hasRole('admin')) {
			sections.push({
				id: 'admin',
				title: 'Администратор',
				description: 'Управление организациями и волонтерами',
				icon: <UsersIcon className='w-10 h-10 text-white' />,
				path: '/admin',
				color: 'bg-blue-600',
			});
		}

		if (hasRole('organization')) {
			sections.push({
				id: 'organizer',
				title: 'Организатор',
				description: 'Управление событиями и заявками',
				icon: <BuildingIcon className='w-10 h-10 text-white' />,
				path: '/organizer',
				color: 'bg-green-600',
			});
		}

		if (hasRole('volonteer')) {
			sections.push({
				id: 'volunteer',
				title: 'Волонтер',
				description: 'Участие в событиях и отслеживание статуса',
				icon: <CalendarIcon className='w-10 h-10 text-white' />,
				path: '/volunteer',
				color: 'bg-purple-600',
			});
		}

		return sections;
	};

	const availableSections = getAvailableSections();

	return (
		<div className='py-12'>
			<div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
				<div className='text-center'>
					<h1 className='font-extrabold text-gray-900 text-3xl sm:text-4xl'>
						Система учета волонтеров
					</h1>
					{isAuth && userInfo && (
						<p className='mx-auto mt-3 sm:mt-4 max-w-2xl text-gray-500 text-xl'>
							Добро пожаловать, {userInfo.name || userInfo.preferred_username}!
						</p>
					)}
				</div>

				{isAuth ? (
					<div className='mt-10'>
						<h2 className='mb-6 font-semibold text-gray-800 text-xl'>
							Доступные разделы
						</h2>

						{availableSections.length > 0 ? (
							<div className='gap-6 grid md:grid-cols-2 lg:grid-cols-3'>
								{availableSections.map((section) => (
									<Link
										key={section.id}
										to={section.path}
										className='bg-white shadow hover:shadow-md rounded-lg overflow-hidden transition-shadow duration-300'
									>
										<div className='p-5'>
											<div
												className={`rounded-md p-3 ${section.color} inline-flex`}
											>
												{section.icon}
											</div>
											<h3 className='mt-4 font-medium text-gray-900 text-lg'>
												{section.title}
											</h3>
											<p className='mt-2 text-gray-500 text-base'>
												{section.description}
											</p>
											<div className='flex items-center mt-4'>
												<span className='font-medium text-indigo-600'>
													Перейти &rarr;
												</span>
											</div>
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className='bg-gray-50 py-10 rounded-lg text-center'>
								<p className='text-gray-600'>
									У вас нет доступа к системе. Обратитесь к администратору для
									получения нужных ролей.
								</p>
							</div>
						)}
					</div>
				) : (
					<div className='bg-gray-50 mt-10 py-10 rounded-lg text-center'>
						<p className='text-gray-600'>
							Для доступа к системе необходимо авторизоваться.
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
