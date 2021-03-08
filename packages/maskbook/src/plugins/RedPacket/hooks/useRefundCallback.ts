import { useCallback } from 'react'
import Services from '../../../extension/service'
import { useRedPacketContract } from '../contracts/useRedPacketContract'
import { useTransactionState, TransactionStateType } from '../../../web3/hooks/useTransactionState'
import type { NonPayableTx } from '@dimensiondev/contracts/types/types'
import { TransactionEventType } from '../../../web3/types'
import type { TransactionReceipt } from 'web3-core'

export function useRefundCallback(version: number, from: string, id?: string) {
    const [refundState, setRefundState] = useTransactionState()
    const redPacketContract = useRedPacketContract(version)

    const refundCallback = useCallback(async () => {
        if (!redPacketContract || !id) {
            setRefundState({
                type: TransactionStateType.UNKNOWN,
            })
            return
        }

        // start waiting for provider to confirm tx
        setRefundState({
            type: TransactionStateType.WAIT_FOR_CONFIRMING,
        })

        // estimate gas and compose transaction
        const config = await Services.Ethereum.composeTransaction({
            from,
            to: redPacketContract.options.address,
            data: redPacketContract.methods.refund(id).encodeABI(),
        }).catch((error) => {
            setRefundState({
                type: TransactionStateType.FAILED,
                error,
            })
            throw error
        })

        // step 2: blocking
        return new Promise<void>((resolve, reject) => {
            const promiEvent = redPacketContract.methods.refund(id).send(config as NonPayableTx)

            promiEvent.on(TransactionEventType.TRANSACTION_HASH, (hash: string) => {
                setRefundState({
                    type: TransactionStateType.HASH,
                    hash,
                })
                resolve()
            })

            promiEvent.on(TransactionEventType.CONFIRMATION, (no: number, receipt: TransactionReceipt) => {
                setRefundState({
                    type: TransactionStateType.CONFIRMED,
                    no,
                    receipt,
                })
                resolve()
            })
            promiEvent.on(TransactionEventType.ERROR, (error: Error) => {
                setRefundState({
                    type: TransactionStateType.FAILED,
                    error,
                })
                reject(error)
            })
        })
    }, [id, redPacketContract, from])

    const resetCallback = useCallback(() => {
        setRefundState({
            type: TransactionStateType.UNKNOWN,
        })
    }, [])

    return [refundState, refundCallback, resetCallback] as const
}
