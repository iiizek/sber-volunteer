import React, { ReactNode } from 'react';
import { useAuthContext } from '../../services/keycloak/auth';

interface RoleBasedComponentProps {
	requiredRoles: string[];
	children: ReactNode;
	fallback?: ReactNode;
}

/**
 * Компонент для условного рендеринга в зависимости от ролей пользователя
 * @param requiredRoles - Массив ролей, необходимых для отображения компонента
 * @param children - Содержимое, которое будет отображено при наличии ролей
 * @param fallback - Опциональный компонент, который будет отображен при отсутствии ролей
 */
export const RoleBasedComponent: React.FC<RoleBasedComponentProps> = ({
	requiredRoles,
	children,
	fallback = null,
}) => {
	const { roles } = useAuthContext();

	// Проверяем наличие хотя бы одной необходимой роли
	const hasRequiredRole = requiredRoles.some((role) => roles.includes(role));

	if (hasRequiredRole) {
		return <>{children}</>;
	}

	return <>{fallback}</>;
};
