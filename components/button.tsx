'use client'

import { useState, useEffect } from 'react'
import { useEstimateGas, useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { type Address, parseGwei } from 'viem';
import {
    useAppKit,
    useDisconnect,
    useAppKitAccount,
    useWalletInfo,
    useAppKitNetwork
} from '@reown/appkit/react'
import { useClientMounted } from '@/hooks/useClientMounted'
import { networks } from '@/config'

export const Button = () => {
    const mounted = useClientMounted()
    const { open } = useAppKit()
    const { switchNetwork } = useAppKitNetwork()
    const { address, caipAddress, isConnected } = useAppKitAccount()
    const walletInfo = useWalletInfo()
    const { disconnect } = useDisconnect()

    const [receiver, setReceiver] = useState('')
    const [amount, setAmount] = useState('')
    const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
    // const [loading, setLoading] = useState(false)
    // const [selectedNetwork, setSelectedNetwork] = useState(networks[0]?.id || '')

    const handleConnect = async () => {
        await open({ view: 'Connect' })
        console.log('Connected')
    }

    const handleDisconnect = async () => {
        try {
            await disconnect()
        } catch (err) {
            console.error(err)
        }
    }

    const tx = {
        to: receiver as Address,
        value: parseGwei(amount)
    }
    const { data: gas } = useEstimateGas({ ...tx })
    const { sendTransaction, data: sentTxData } = useSendTransaction()

    const { isLoading, isSuccess, isError } = useWaitForTransactionReceipt({ hash: txHash })

    useEffect(() => {
        if (sentTxData) {
            setTxHash(sentTxData as `0x${string}`)
        }
    }, [sentTxData])

    const handleTransaction = () => {
        try {
            sendTransaction({
                ...tx,
                gas
            })
        } catch (err) {
            console.error(err)
        }
    }

    return !mounted ? null : (
        <>
            {!isConnected ? (
                <div>
                    <button onClick={handleConnect}>Connect Wallet</button>
                </div>
            ) : (
                <section>
                    <div>
                        <p>Address: {address}</p>
                        <p>caipAddress: {caipAddress}</p>
                        <p>Connected: {isConnected.toString()}</p>
                        <div>
                            {networks.map((net) => (
                                <span key={net.id} style={{ margin: 2 }}>
                                    <button onClick={() => switchNetwork(net)}>{net.name}</button>
                                </span>
                            ))}
                        </div>
                        <p>Wallet Information: {walletInfo.walletInfo?.name?.toString()}</p>
                    </div>
                    <hr />
                    <div>
                        <label htmlFor="" style={{ margin: 2 }}>
                            Wallet ip:
                            <input type="text" placeholder='Wallet address' value={receiver} onChange={(e) => setReceiver(e.target.value)} />
                        </label>
                        <label htmlFor="">
                            Amount:
                            <input type="number" placeholder='Amount' value={amount} onChange={(e) => setAmount(e.target.value)} />
                        </label>
                        
                        {isConnected && (
                            <button type="submit" onClick={handleTransaction}>Send</button>
                        )}
                        { isLoading && <p>Waiting for confirmation...</p> }
                        { isSuccess && <p>Transaction confirmed</p> }
                        { isError && <p>Transaction faileds</p> }
                    </div>
                    <hr />
                    <button onClick={handleDisconnect}>Disconnect Wallet</button>
                </section>
            )}
        </>
    )
}