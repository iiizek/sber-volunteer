import React, { createContext, ReactNode, useEffect, useState } from 'react';

import Keycloak, { KeycloakInstance } from 'keycloak-js';
import { useContext } from 'react';
import { Spin } from 'antd';
import {
	ApolloClient,
	InMemoryCache,
	NormalizedCacheObject,
} from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import * as process from 'process';
import { cache } from './cache';

type UserInfo = {
	sub: string;
	preferred_username: string;
	email: string;
	name?: string;
	resourceAccess?: {
		[key: string]: {
			roles: string[];
		};
	};
};

type AuthContextStruct = {
	keycloak: KeycloakInstance;
	userInfo: UserInfo;
	roles: string[];
	isAuth: boolean;
};

let initKeycloak = false;
const keycloak = new Keycloak('/keycloak.json');

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [roles, setRoles] = useState<string[]>([]); //admin, volonteer, organization
	const [isAuth, setIsAuth] = useState<boolean>(false);
	// userInfo:
	// email
	// email_verified
	// family_name
	// given_name
	// name
	// preferred_username
	// sub

	const [userInfo, setUserInfo] = useState<UserInfo>();
	const [apolloClient, setApolloClient] =
		useState<ApolloClient<NormalizedCacheObject>>();

	useEffect(() => {
		if (initKeycloak) return;

		initKeycloak = true;

		keycloak
			.init({
				onLoad: 'login-required',
				checkLoginIframe: false,
			})
			.then(setIsAuth)
			.then(() => keycloak.loadUserInfo())
			.then((info) => {
				const hasUserRole = keycloak.realmAccess?.roles?.includes('user');

				if (!hasUserRole) {
					keycloak.logout();
					return;
				}

				const client = new ApolloClient({
					cache: cache,
					uri:
						process.env.NODE_ENV === 'production'
							? process.env.DS_ENDPOINT
							: '/graphql',
					headers: {
						Authorization: 'Bearer ' + keycloak.token,
					},
				});

				setApolloClient(client);
				setRoles(keycloak.realmAccess?.roles || []);
				setUserInfo(info as UserInfo);
			});
	}, []);

	if (isAuth && apolloClient && userInfo) {
		return (
			<AuthContext.Provider value={{ keycloak, userInfo, roles, isAuth }}>
				<ApolloProvider client={apolloClient}>{children}</ApolloProvider>
			</AuthContext.Provider>
		);
	}

	return (
		<Spin
			style={{
				margin: 0,
				position: 'absolute',
				top: '50%',
				left: '50%',
			}}
			size='large'
		/>
	);
};

export const AuthContext = createContext<AuthContextStruct | null>(null);
export const useAuthContext = () =>
	useContext(AuthContext) as AuthContextStruct;
