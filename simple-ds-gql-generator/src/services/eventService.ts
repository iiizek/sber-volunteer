import { useMemo } from 'react';
import { ApolloError } from '@apollo/client';
import {
	useSearchEventQuery,
	useCreateEventMutation,
	useUpdateEventMutation,
	useDeleteEventMutation,
	_CreateEventInput,
	_UpdateEventInput,
} from '../__generate/graphql-frontend';

export interface EventFormData {
	description: string;
	startDateTime: string;
	endDateTime: string;
	organization: string;
	status?: string;
}

export interface UseEventsResult {
	events: any[];
	loading: boolean;
	error: ApolloError | undefined;
	refetch: () => void;
}

// Хук для получения списка событий
export const useEvents = (condition?: string) => {
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

	const { data, loading, error, refetch } = useSearchEventQuery({
		variables: {
			cond: condValue,
		},
	});

	// Преобразуем данные из API в формат, удобный для использования
	const events = (data?.searchEvent?.elems || []).map((event) => ({
		id: event.id,
		description: event.description || '',
		startDateTime: event.startDateTime || null,
		endDateTime: event.endDateTime || null,
		organization: event.organization?.id || '',
		statusForX: event.statusForX || { code: 'DRAFT' },
	}));

	return {
		events,
		loading,
		error,
		refetch,
	};
};

// Хук для создания нового события
export const useCreateEvent = () => {
	const [createEventMutation, { loading, error }] = useCreateEventMutation();

	const createEvent = async (eventData: EventFormData) => {
		try {
			if (!eventData.organization) {
				throw new Error('Organization ID is required');
			}

			const input: _CreateEventInput = {
				description: eventData.description,
				startDateTime: eventData.startDateTime,
				endDateTime: eventData.endDateTime,
				organization: eventData.organization,
				statusForX: { code: eventData.status },
			};

			const { data } = await createEventMutation({
				variables: {
					input,
				},
			});
			return data?.packet?.createEvent;
		} catch (err) {
			console.error('Error creating event:', err);
			throw err;
		}
	};

	return {
		createEvent,
		loading,
		error,
	};
};

// Хук для обновления события
export const useUpdateEvent = () => {
	const [updateEventMutation, { loading, error }] = useUpdateEventMutation();

	const updateEvent = async (id: string, eventData: Partial<EventFormData>) => {
		try {
			const input: _UpdateEventInput = { id };

			if (eventData.description !== undefined) {
				input.description = eventData.description;
			}

			if (eventData.startDateTime !== undefined) {
				input.startDateTime = eventData.startDateTime;
			}

			if (eventData.endDateTime !== undefined) {
				input.endDateTime = eventData.endDateTime;
			}

			if (eventData.status !== undefined) {
				input.statusForX = { code: eventData.status };
			}

			const { data } = await updateEventMutation({
				variables: {
					input,
				},
			});

			return data?.packet?.updateEvent;
		} catch (err) {
			console.error('Error updating event:', err);
			throw err;
		}
	};

	return {
		updateEvent,
		loading,
		error,
	};
};

// Хук для удаления события
export const useDeleteEvent = () => {
	const [deleteEventMutation, { loading, error }] = useDeleteEventMutation();

	const deleteEvent = async (id: string) => {
		try {
			const { data } = await deleteEventMutation({
				variables: {
					id,
				},
			});
			return data?.packet?.deleteEvent;
		} catch (err) {
			console.error('Error deleting event:', err);
			throw err;
		}
	};

	return {
		deleteEvent,
		loading,
		error,
	};
};

// Хук для поиска события по ID
export const useEventById = (id: string) => {
	// Используем обычный запрос вместо lazy с правильным условием
	const condition = id ? `it.id=='${id}'` : 'it.id!=null';
	const { events, loading, error, refetch } = useEvents(condition);

	const event = events.length > 0 ? events[0] : null;

	return {
		event,
		loading,
		error,
		refetch,
	};
};
