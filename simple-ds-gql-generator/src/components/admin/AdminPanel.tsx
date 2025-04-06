import React, { useState } from 'react';
import { AdminOrganizations } from './AdminOrganizations';
import { AdminVolunteers } from './AdminVolunteers';

type TabType = 'organizations' | 'volunteers';

export const AdminPanel: React.FC = () => {
	const [activeTab, setActiveTab] = useState<TabType>('organizations');

	return (
		<div className='bg-gray-50 min-h-screen'>
			<div className='mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl'>
				<div className='border-gray-200 border-b'>
					<nav className='flex space-x-8 -mb-px' aria-label='Tabs'>
						<button
							onClick={() => setActiveTab('organizations')}
							className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
									activeTab === 'organizations'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}
              `}
						>
							Организации
						</button>
						<button
							onClick={() => setActiveTab('volunteers')}
							className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${
									activeTab === 'volunteers'
										? 'border-indigo-500 text-indigo-600'
										: 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
								}
              `}
						>
							Волонтеры
						</button>
					</nav>
				</div>

				<div className='py-6'>
					{activeTab === 'organizations' && <AdminOrganizations />}
					{activeTab === 'volunteers' && <AdminVolunteers />}
				</div>
			</div>
		</div>
	);
};
