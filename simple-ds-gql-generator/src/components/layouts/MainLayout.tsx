import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
	Users,
	Calendar,
	Building,
	User,
	Menu as MenuIcon,
	LogOut,
} from 'lucide-react';
import { useAuthContext } from '../../services/keycloak/auth';

export const MainLayout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const location = useLocation();
	const { roles, keycloak, userInfo } = useAuthContext();

	const isActive = (path: string) => {
		return location.pathname.startsWith(path) ? 'bg-indigo-800' : '';
	};

	// Проверка на наличие определенной роли
	const hasRole = (role: string) => roles.includes(role);

	return (
		<div className='bg-gray-100 min-h-screen'>
			{/* Sidebar */}
			<div
				className={`fixed inset-y-0 left-0 z-50 w-64 bg-indigo-900 text-white transform ${
					sidebarOpen ? 'translate-x-0' : '-translate-x-full'
				} md:translate-x-0 transition-transform duration-300 ease-in-out`}
			>
				<div className='p-5 border-indigo-800 border-b'>
					<Link to='/'>
						<h2 className='font-bold text-xl'>СберВолонтер</h2>
					</Link>
					{userInfo && (
						<p className='mt-1 text-indigo-300 text-xs'>
							{userInfo.preferred_username}
						</p>
					)}
				</div>

				<nav className='mt-5 px-2'>
					{hasRole('admin') && (
						<Link
							to='/admin'
							className={`flex items-center px-4 py-3 rounded-lg mb-1 ${isActive(
								'/admin'
							)}`}
						>
							<Users className='mr-3 w-5 h-5' />
							<span>Администратор</span>
						</Link>
					)}

					{hasRole('organization') && (
						<Link
							to='/organizer'
							className={`flex items-center px-4 py-3 rounded-lg mb-1 ${isActive(
								'/organizer'
							)}`}
						>
							<Building className='mr-3 w-5 h-5' />
							<span>Организатор</span>
						</Link>
					)}

					{hasRole('volonteer') && (
						<Link
							to='/volunteer'
							className={`flex items-center px-4 py-3 rounded-lg mb-1 ${isActive(
								'/volunteer'
							)}`}
						>
							<Calendar className='mr-3 w-5 h-5' />
							<span>Волонтер</span>
						</Link>
					)}
				</nav>

				<div className='bottom-0 absolute p-4 border-indigo-800 border-t w-full'>
					<button
						onClick={() => keycloak.logout()}
						className='flex items-center hover:bg-indigo-800 px-4 py-3 rounded-lg w-full text-indigo-200'
					>
						<LogOut className='mr-3 w-5 h-5' />
						<span>Выход</span>
					</button>
				</div>
			</div>

			{/* Main Content */}
			<div className='flex flex-col md:ml-64 min-h-screen'>
				<header className='flex justify-between items-center bg-white shadow-sm px-4 md:px-6 py-4'>
					<button
						onClick={() => setSidebarOpen(!sidebarOpen)}
						className='md:hidden focus:outline-none text-gray-600'
					>
						<MenuIcon className='w-6 h-6' />
					</button>
					<div className='flex items-center ml-auto'>
						<div className='mr-3 text-right'>
							<p className='font-medium text-gray-700 text-sm'>
								{userInfo?.name || userInfo?.preferred_username}
							</p>
						</div>
						<div className='flex justify-center items-center bg-indigo-100 rounded-full w-8 h-8 text-indigo-500'>
							<User className='w-4 h-4' />
						</div>
					</div>
				</header>

				<main className='flex-grow p-4 md:p-6'>
					<Outlet />
				</main>
			</div>
		</div>
	);
};
