import React, { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../services/keycloak/auth';

interface ProtectedRouteProps {
	children: ReactNode;
	requiredRoles: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	requiredRoles,
}) => {
	const { keycloak, isAuth, roles } = useAuthContext();
	const location = useLocation();

	// Проверяем авторизацию
	if (!isAuth) {
		// Перенаправляем на главную страницу
		return <Navigate to='/' state={{ from: location }} replace />;
	}

	// Проверяем наличие хотя бы одной необходимой роли
	const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));

	if (!hasRequiredRole) {
		// Перенаправляем на страницу с ошибкой доступа или на другую страницу
		return <Navigate to='/unauthorized' state={{ from: location }} replace />;
	}

	// Если пользователь авторизован и имеет нужную роль - показываем содержимое
	return <>{children}</>;
};
