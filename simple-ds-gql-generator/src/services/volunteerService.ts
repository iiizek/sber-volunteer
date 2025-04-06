import { ApolloError } from '@apollo/client';
import {
	useSearchVolonteerQuery,
	useCreateVolonteerMutation,
	useUpdateVolonteerMutation,
	useDeleteVolonteerMutation,
} from '../__generate/graphql-frontend';
import { useEffect } from 'react';

export interface VolunteerFormData {
	firstName: string;
	lastName: string;
	// В модели данных у волонтера есть только nickName и ссылка на Person
}

// Интерфейс для адаптированных данных волонтера
export interface AdaptedVolunteer {
	id: string;
	firstName: string;
	lastName: string;
	nickName?: string;
}

// Хук для получения списка волонтеров
export const useVolunteers = (condition?: string) => {
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

	const { data, loading, error, refetch } = useSearchVolonteerQuery({
		variables: {
			cond: condValue,
		},
	});

	// Адаптируем данные волонтера для соответствия модели:
	// - Volonteer имеет ссылку на Person, eventBookingList (список VolonteerEventRequest)
	const adaptedVolunteers: AdaptedVolunteer[] = (
		data?.searchVolonteer?.elems || []
	).map((volunteer) => {
		return {
			id: volunteer.id,
			firstName: volunteer.nickName?.split(' ')[0] || '',
			lastName: volunteer.nickName?.split(' ')[1] || '',
			// В реальной реализации здесь должны быть данные из связанного объекта Person
			nickName: volunteer.nickName || '',
		};
	});

	return {
		volunteers: adaptedVolunteers,
		loading,
		error,
		refetch,
	};
};

// Хук для создания волонтера
export const useCreateVolunteer = () => {
	const [createVolonteerMutation, { loading, error }] =
		useCreateVolonteerMutation();

	const createVolunteer = async (volunteerData: VolunteerFormData) => {
		try {
			// Временная заглушка для демо
			const { data } = await createVolonteerMutation({
				variables: {
					input: {
						nickName: `${volunteerData.firstName} ${volunteerData.lastName}`,
						person: { entityId: '12345' }, // Временный ID персоны
					},
				},
			});
			return data?.packet?.createVolonteer;
		} catch (err) {
			console.error('Error creating volunteer:', err);
			throw err;
		}
	};

	return {
		createVolunteer,
		loading,
		error,
	};
};

// Хук для обновления волонтера
export const useUpdateVolunteer = () => {
	const [updateVolonteerMutation, { loading, error }] =
		useUpdateVolonteerMutation();

	const updateVolunteer = async (
		id: string,
		volunteerData: Partial<VolunteerFormData>
	) => {
		try {
			const input: any = { id };

			// Обновляем только nickName для Volunteer
			input.nickName = `${volunteerData.firstName || ''} ${
				volunteerData.lastName || ''
			}`.trim();

			const { data } = await updateVolonteerMutation({
				variables: {
					input,
				},
			});
			return data?.packet?.updateVolonteer;
		} catch (err) {
			console.error('Error updating volunteer:', err);
			throw err;
		}
	};

	return {
		updateVolunteer,
		loading,
		error,
	};
};

// Хук для удаления волонтера
export const useDeleteVolunteer = () => {
	const [deleteVolonteerMutation, { loading, error }] =
		useDeleteVolonteerMutation();

	const deleteVolunteer = async (id: string) => {
		try {
			const { data } = await deleteVolonteerMutation({
				variables: {
					id,
				},
			});
			return data?.packet?.deleteVolonteer;
		} catch (err) {
			console.error('Error deleting volunteer:', err);
			throw err;
		}
	};

	return {
		deleteVolunteer,
		loading,
		error,
	};
};
