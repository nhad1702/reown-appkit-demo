import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, optimism, arbitrum, bsc } from '@reown/appkit/networks'
import type { AppKitNetwork } from '@reown/appkit/networks'
import 'dotenv/config'

const projectId = '402e5523bed65650016234c00b6b755f'
// const projectId = process.env.REOWN_PROJECT_ID

if (!projectId) {
    throw new Error('Project ID is not defined')
}

const networks = [mainnet, polygon, optimism, arbitrum, bsc] as [AppKitNetwork, ...AppKitNetwork[]]
// const defaultNetwork = mainnet

const wagmiAdapter = new WagmiAdapter({
    storage: createStorage({
        storage: cookieStorage
    }),
    ssr: true,
    projectId,
    networks
})

const config = wagmiAdapter.wagmiConfig

export {
    projectId,
    networks,
    // defaultNetwork,
    wagmiAdapter,
    config
}