import {
	SearchPersonQuery,
	SearchPersonQueryVariables,
	CreatePersonMutation,
	CreatePersonMutationVariables,
	UpdatePersonMutation,
	UpdatePersonMutationVariables,
	DeletePersonMutation,
	DeletePersonMutationVariables,
	_CreatePersonInput,
	_UpdatePersonInput,
	useSearchPersonQuery,
	useCreatePersonMutation,
	useUpdatePersonMutation,
	useDeletePersonMutation,
} from '../__generate/graphql-frontend';
import { useState } from 'react';
import { ApolloError } from '@apollo/client';

export type PersonFormData = {
	firstName: string;
	lastName: string;
	birthDate?: string; // ISO string
};

// Хук для получения списка людей
export const usePeople = (condition?: string) => {
	const { data, loading, error, refetch } = useSearchPersonQuery({
		variables: condition ? { cond: condition } : {},
	});

	return {
		people: data?.searchPerson.elems || [],
		loading,
		error,
		refetch,
	};
};

// Хук для создания профиля человека
export const useCreatePerson = () => {
	const [createPerson, { loading }] = useCreatePersonMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleCreatePerson = async (formData: PersonFormData) => {
		try {
			const input: _CreatePersonInput = {
				firstName: formData.firstName,
				lastName: formData.lastName,
				birthDate: formData.birthDate
					? new Date(formData.birthDate).toISOString()
					: undefined,
			};

			const result = await createPerson({
				variables: {
					input,
				},
			});

			return result.data?.packet?.createPerson;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		createPerson: handleCreatePerson,
		loading,
		error,
	};
};

// Хук для обновления профиля человека
export const useUpdatePerson = () => {
	const [updatePerson, { loading }] = useUpdatePersonMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleUpdatePerson = async (
		id: string,
		formData: Partial<PersonFormData>
	) => {
		try {
			const input: _UpdatePersonInput = {
				id,
				firstName: formData.firstName,
				lastName: formData.lastName,
				birthDate: formData.birthDate
					? new Date(formData.birthDate).toISOString()
					: undefined,
			};

			const result = await updatePerson({
				variables: {
					input,
				},
			});

			return result.data?.packet?.updatePerson;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		updatePerson: handleUpdatePerson,
		loading,
		error,
	};
};

// Хук для удаления профиля человека
export const useDeletePerson = () => {
	const [deletePerson, { loading }] = useDeletePersonMutation();
	const [error, setError] = useState<ApolloError | null>(null);

	const handleDeletePerson = async (id: string) => {
		try {
			const result = await deletePerson({
				variables: {
					id,
				},
			});

			return result.data?.packet?.deletePerson;
		} catch (err) {
			setError(err as ApolloError);
			return null;
		}
	};

	return {
		deletePerson: handleDeletePerson,
		loading,
		error,
	};
};
