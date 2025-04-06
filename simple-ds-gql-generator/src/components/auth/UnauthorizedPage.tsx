import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, Home } from 'lucide-react';
import { useAuthContext } from '../../services/keycloak/auth';

export const UnauthorizedPage: React.FC = () => {
	const { roles } = useAuthContext();

	// Определяем доступную страницу для перенаправления
	const getAvailablePage = () => {
		if (roles.includes('admin')) {
			return { path: '/admin', title: 'административной панели' };
		} else if (roles.includes('organization')) {
			return { path: '/organizer', title: 'панели организатора' };
		} else if (roles.includes('volonteer')) {
			return { path: '/volunteer', title: 'панели волонтера' };
		}
		return { path: '/', title: 'главной странице' };
	};

	const availablePage = getAvailablePage();

	return (
		<div className='flex flex-col justify-center items-center bg-gray-100 px-4 min-h-screen'>
			<ShieldAlert className='mb-6 w-20 h-20 text-red-500' />
			<h1 className='mb-4 font-bold text-gray-900 text-4xl'>Доступ запрещен</h1>
			<p className='mb-8 text-gray-600 text-xl text-center'>
				У вас нет необходимых прав для доступа к этой странице.
			</p>
			<div className='flex sm:flex-row flex-col gap-4'>
				<Link
					to={availablePage.path}
					className='inline-flex items-center bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-md text-white transition-colors'
				>
					<Home className='mr-2 w-5 h-5' />
					Перейти к {availablePage.title}
				</Link>
			</div>
		</div>
	);
};
