import {
	SearchVolonteerEventRequestQuery,
	SearchVolonteerEventRequestQueryVariables,
	CreateVolonteerEventRequestMutation,
	CreateVolonteerEventRequestMutationVariables,
	UpdateVolonteerEventRequestMutation,
	UpdateVolonteerEventRequestMutationVariables,
	DeleteVolonteerEventRequestMutation,
	DeleteVolonteerEventRequestMutationVariables,
	_CreateVolonteerEventRequestInput,
	_UpdateVolonteerEventRequestInput,
	useSearchVolonteerEventRequestQuery,
	useCreateVolonteerEventRequestMutation,
	useUpdateVolonteerEventRequestMutation,
	useDeleteVolonteerEventRequestMutation,
} from '../__generate/graphql-frontend';
import { useState } from 'react';
import { ApolloError } from '@apollo/client';

export interface VolunteerRequestFormData {
	eventId: string;
	volunteerId: string;
	message?: string;
	status: string;
}

// Хук для получения списка волонтерских заявок
export const useVolunteerRequests = (condition?: string) => {
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

	const { data, loading, error, refetch } = useSearchVolonteerEventRequestQuery(
		{
			variables: {
				cond: condValue,
			},
		}
	);

	return {
		requests: data?.searchVolonteerEventRequest.elems || [],
		loading,
		error,
		refetch,
	};
};

// Хук для создания волонтерской заявки
export const useCreateVolunteerRequest = () => {
	const [createRequest, { loading, error }] =
		useCreateVolonteerEventRequestMutation();

	const createVolunteerRequest = async (data: {
		description: string;
		volunteerId: string;
		eventId: string;
	}) => {
		try {
			const result = await createRequest({
				variables: {
					input: {
						description: data.description,
						volonteer: data.volunteerId,
						event: { entityId: data.eventId },
						statusForX: { code: 'OPEN' },
					},
				},
			});

			return result.data?.packet?.createVolonteerEventRequest;
		} catch (err) {
			console.error('Error creating volunteer request:', err);
			throw err;
		}
	};

	return {
		createVolunteerRequest,
		loading,
		error,
	};
};

// Хук для обновления волонтерской заявки
export const useUpdateVolunteerRequest = () => {
	const [updateRequestMutation, { loading, error }] =
		useUpdateVolonteerEventRequestMutation();

	const updateRequest = async (
		id: string,
		requestData: Partial<VolunteerRequestFormData>
	) => {
		try {
			const input: any = { id };

			if (requestData.message !== undefined) {
				input.message = requestData.message;
			}

			if (requestData.status !== undefined) {
				input.statusForX = { code: requestData.status };
			}

			const { data } = await updateRequestMutation({
				variables: {
					input,
				},
			});
			return data?.packet?.updateVolonteerEventRequest;
		} catch (err) {
			console.error('Error updating volunteer request:', err);
			throw err;
		}
	};

	return {
		updateRequest,
		loading,
		error,
	};
};

// Хук для удаления волонтерской заявки
export const useDeleteVolunteerRequest = () => {
	const [deleteRequestMutation, { loading, error }] =
		useDeleteVolonteerEventRequestMutation();

	const deleteRequest = async (id: string) => {
		try {
			const { data } = await deleteRequestMutation({
				variables: {
					id,
				},
			});
			return data?.packet?.deleteVolonteerEventRequest;
		} catch (err) {
			console.error('Error deleting volunteer request:', err);
			throw err;
		}
	};

	return {
		deleteRequest,
		loading,
		error,
	};
};
