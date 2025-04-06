import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layouts/MainLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { OrganizerDashboard } from './components/organizer/OrganizerDashboard';
import { VolunteerDashboard } from './components/volunteer/VolunteerDashboard';
import { LoginPage } from './components/auth/LoginPage';
import { HomePage } from './components/HomePage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { UnauthorizedPage } from './components/auth/UnauthorizedPage';

export const App: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainLayout />}>
					<Route index element={<HomePage />} />

					{/* Защищенные маршруты администратора */}
					<Route
						path='admin/*'
						element={
							<ProtectedRoute requiredRoles={['admin']}>
								<AdminDashboard />
							</ProtectedRoute>
						}
					/>

					{/* Защищенные маршруты организатора */}
					<Route
						path='organizer/*'
						element={
							<ProtectedRoute requiredRoles={['organization']}>
								<OrganizerDashboard />
							</ProtectedRoute>
						}
					/>

					{/* Защищенные маршруты волонтера */}
					<Route
						path='volunteer/*'
						element={
							<ProtectedRoute requiredRoles={['volonteer']}>
								<VolunteerDashboard />
							</ProtectedRoute>
						}
					/>

					{/* Страница с ошибкой авторизации */}
					<Route path='unauthorized' element={<UnauthorizedPage />} />
				</Route>
				<Route path='/login' element={<LoginPage />} />
			</Routes>
		</BrowserRouter>
	);
};
