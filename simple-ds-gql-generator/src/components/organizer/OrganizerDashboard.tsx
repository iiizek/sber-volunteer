import React from 'react';
import { Route, Routes, Link, useLocation } from 'react-router-dom';
import { Calendar, Users } from 'lucide-react';
import { OrganizerEvents } from './OrganizerEvents';
import { OrganizerRequests } from './OrganizerRequests';

export const OrganizerDashboard: React.FC = () => {
	const location = useLocation();

	const isActive = (path: string) => {
		return location.pathname === path
			? 'bg-indigo-50 text-indigo-700 border-indigo-700'
			: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900';
	};

	return (
		<div>
			<h1 className='mb-6 font-bold text-gray-800 text-2xl'>
				Личный кабинет организатора
			</h1>

			<div className='bg-white shadow rounded-lg'>
				<div className='border-gray-200 border-b'>
					<nav className='flex -mb-px'>
						<Link
							to='/organizer/events'
							className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${isActive(
								'/organizer/events'
							)} border-transparent`}
						>
							<div className='flex flex-col items-center'>
								<Calendar className='mb-1 w-5 h-5' />
								<span>Мои события</span>
							</div>
						</Link>
						<Link
							to='/organizer/requests'
							className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${isActive(
								'/organizer/requests'
							)} border-transparent`}
						>
							<div className='flex flex-col items-center'>
								<Users className='mb-1 w-5 h-5' />
								<span>Заявки волонтеров</span>
							</div>
						</Link>
					</nav>
				</div>

				<div className='p-4'>
					<Routes>
						<Route path='/' element={<OrganizerEvents />} />
						<Route path='/events' element={<OrganizerEvents />} />
						<Route path='/requests' element={<OrganizerRequests />} />
					</Routes>
				</div>
			</div>
		</div>
	);
};
