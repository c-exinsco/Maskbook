import { useMemo } from 'react'
import { useChainId } from '../../../../web3/hooks/useChainId'
import type { NativeTokenDetailed, ERC20TokenDetailed } from '../../../../web3/types'
import { toUniswapCurrency } from '../../helpers'

export function useUniswapCurrency(token?: NativeTokenDetailed | ERC20TokenDetailed) {
    const chainId = useChainId()
    return useMemo(() => {
        if (!token) return
        return toUniswapCurrency(chainId, token)
    }, [chainId, JSON.stringify(token)])
}
