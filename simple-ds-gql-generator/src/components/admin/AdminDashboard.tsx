import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { Users, Building } from 'lucide-react';
import { AdminOrganizations } from './AdminOrganizations';
import { AdminVolunteers } from './AdminVolunteers';
import { AdminEvents } from './AdminEvents';

export const AdminDashboard: React.FC = () => {
	const location = useLocation();

	const isActive = (path: string) => {
		return location.pathname === path
			? 'bg-indigo-50 text-indigo-700 border-indigo-700'
			: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
	};

	return (
		<div>
			<h1 className='mb-6 font-bold text-gray-800 text-2xl'>
				Панель администратора
			</h1>

			<div className='bg-white shadow rounded-lg'>
				<div className='border-gray-200 border-b'>
					<nav className='flex -mb-px'>
						<Link
							to='/admin/organizations'
							className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${isActive(
								'/admin/organizations'
							)} border-transparent`}
						>
							<div className='flex flex-col items-center'>
								<Building className='mb-1 w-5 h-5' />
								<span>Организации</span>
							</div>
						</Link>
						<Link
							to='/admin/volunteers'
							className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${isActive(
								'/admin/volunteers'
							)} border-transparent`}
						>
							<div className='flex flex-col items-center'>
								<Users className='mb-1 w-5 h-5' />
								<span>Волонтеры</span>
							</div>
						</Link>
						<Link
							to='/admin/events'
							className={`w-1/3 py-4 px-1 text-center border-b-2 font-medium text-sm ${isActive(
								'/admin/events'
							)} border-transparent`}
						>
							<div className='flex flex-col items-center'>
								<Users className='mb-1 w-5 h-5' />
								<span>События</span>
							</div>
						</Link>
					</nav>
				</div>

				<div className='p-4'>
					<Routes>
						<Route path='/' element={<AdminOrganizations />} />
						<Route path='/organizations' element={<AdminOrganizations />} />
						<Route path='/volunteers' element={<AdminVolunteers />} />
						<Route path='/events' element={<AdminEvents />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};
