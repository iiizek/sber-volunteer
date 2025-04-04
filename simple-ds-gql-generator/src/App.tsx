import 'antd/dist/antd.css';
import React, { useEffect, useState } from 'react';
import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { cache } from './cache'

import { MainMenu } from './components/__generate/MainMenu';

export const App: React.FC = () => {
  const [apolloClient, setAppoloClient] = useState<ApolloClient<NormalizedCacheObject>>()

  const initEnv = async () => {
    const res = await fetch("/env.json")
    const json = JSON.parse(await res.text())
    process.env.DS_ENDPOINT = json.DS_ENDPOINT
  }

  const initClient = async () => {
    if (process.env.NODE_ENV === 'production')
      await initEnv()

    if (!apolloClient) {
      return new ApolloClient({
        cache: cache,
        uri: process.env.NODE_ENV === 'production' ? process.env.DS_ENDPOINT : '/graphql',
      })
    }
  }

  useEffect(() => {
    const appoloClientInit = async () => {
      const apolloClient = await initClient()
      setAppoloClient(apolloClient)
    }

    appoloClientInit()
    
  }, [])

  if (apolloClient)
  return (
    <ApolloProvider client={apolloClient}>
      <MainMenu />
    </ApolloProvider>
  )

  return (<>{"Loading..."}</>)
}