import {
	SearchOrganizationQuery,
	SearchOrganizationQueryVariables,
	CreateOrganizationMutation,
	CreateOrganizationMutationVariables,
	UpdateOrganizationMutation,
	UpdateOrganizationMutationVariables,
	DeleteOrganizationMutation,
	DeleteOrganizationMutationVariables,
	_CreateOrganizationInput,
	_UpdateOrganizationInput,
	useSearchOrganizationQuery,
	useCreateOrganizationMutation,
	useUpdateOrganizationMutation,
	useDeleteOrganizationMutation,
} from '../__generate/graphql-frontend';
import { useState } from 'react';
import { ApolloError } from '@apollo/client';

export type OrganizationFormData = {
	name: string;
};

// Хук для получения списка организаций
export const useOrganizations = (condition?: string) => {
	// Формируем валидное условие для GraphQL запроса
	let condValue = 'it.id!=null'; // Корректное условие для выборки всех записей

	if (condition && condition.trim()) {
		// Если условие начинается с it. и это прямое обращение к полю, используем его
		if (condition.startsWith('it.')) {
			condValue = condition;
		}
		// Если есть скобки, то это уже сформированное выражение
		else if (condition.startsWith('(')) {
			condValue = condition;
		}
		// Иначе оборачиваем в скобки - предполагаем что это полноценное выражение
		else {
			condValue = `(${condition})`;
		}
	}

	const { data, loading, error, refetch } = useSearchOrganizationQuery({
		variables: {
			cond: condValue,
		},
	});

	// Предполагаем, что в ответе приходит массив organization с id и name
	const organizations = (data?.searchOrganization?.elems || []).map((org) => ({
		id: org.id,
		name: org.name || '',
	}));

	return {
		organizations,
		loading,
		error,
		refetch,
	};
};

// Хук для создания организации
export const useCreateOrganization = () => {
	const [createOrganization, { loading }] = useCreateOrganizationMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleCreateOrganization = async (formData: OrganizationFormData) => {
		try {
			const input: _CreateOrganizationInput = {
				name: formData.name,
			};

			const result = await createOrganization({
				variables: {
					input,
				},
			});

			return result.data?.packet?.createOrganization;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		createOrganization: handleCreateOrganization,
		loading,
		error,
	};
};

// Хук для обновления организации
export const useUpdateOrganization = () => {
	const [updateOrganization, { loading }] = useUpdateOrganizationMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleUpdateOrganization = async (
		id: string,
		formData: Partial<OrganizationFormData>
	) => {
		try {
			const input: _UpdateOrganizationInput = {
				id,
				name: formData.name,
			};

			const result = await updateOrganization({
				variables: {
					input,
				},
			});

			return result.data?.packet?.updateOrganization;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		updateOrganization: handleUpdateOrganization,
		loading,
		error,
	};
};

// Хук для удаления организации
export const useDeleteOrganization = () => {
	const [deleteOrganization, { loading }] = useDeleteOrganizationMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleDeleteOrganization = async (id: string) => {
		try {
			const result = await deleteOrganization({
				variables: {
					id,
				},
			});

			return result.data?.packet?.deleteOrganization;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		deleteOrganization: handleDeleteOrganization,
		loading,
		error,
	};
};
