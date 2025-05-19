'use client'

import { wagmiAdapter, projectId, networks } from '@/config/index'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createAppKit } from '@reown/appkit/react'
import React, { type ReactNode } from 'react'
import { cookieToInitialState, WagmiProvider, type Config } from 'wagmi'

const queryClient = new QueryClient()

const metadata = {
    name: 'Reown Appkit Demo',
    description: 'Demo',
    url: 'http://localhost:3000',
    icons: ['https://avatars.githubusercontent.com/u/179229932']
}

export const modal = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata,
    themeMode: 'dark',
    features: {
        swaps: true,
        send: true,
        legalCheckbox: true
    }
})

const ContextProvider = ({ children, cookies }: { children: ReactNode; cookies: string | null }) => {
    const initialState = cookieToInitialState(wagmiAdapter.wagmiConfig as Config, cookies)

    return (
        <WagmiProvider config={wagmiAdapter.wagmiConfig as Config} initialState={initialState}>
            <QueryClientProvider client={queryClient}>
                {children}
            </QueryClientProvider>
        </WagmiProvider>
    )
}

export default ContextProvider