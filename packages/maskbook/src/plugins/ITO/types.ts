import type { ChainId, NativeTokenDetailed, ERC20TokenDetailed } from '../../web3/types'

export interface JSON_PayloadInMask {
    contract_address: string
    pid: string // pool id
    password: string
    message: string
    limit: string
    total: string
    total_remaining: string
    seller: {
        address: string
        name: string
    }
    buyers: {
        address: string
        name: string
    }[]
    chain_id: ChainId
    start_time: number
    end_time: number
    unlock_time?: number
    qualification_address: string
    creation_time: number
    token: NativeTokenDetailed | ERC20TokenDetailed
    exchange_amounts: string[]
    exchange_tokens: (NativeTokenDetailed | ERC20TokenDetailed)[]
    regions: string
    // @deprecated
    is_mask?: boolean
    // @deprecated
    test_nums?: number[]
}

type TokenOutMask = Omit<JSON_PayloadInMask['token'], 'chainId'> & {
    chain_id: ChainId
}

export interface JSON_PayloadOutMask extends Omit<JSON_PayloadInMask, 'token' | 'exchange_tokens'> {
    token: TokenOutMask
    exchange_tokens: TokenOutMask[]
}

export enum ITO_Status {
    waited = 'waited',
    started = 'started',
    expired = 'expired',
}

export interface PoolRecord {
    /** The pool ID */
    id: string
    /** From url */
    from: string
    /** The JSON payload */
    payload: JSON_PayloadInMask
}

export interface PoolRecordInDatabase extends PoolRecord {
    /** An unique record type in DB */
    type: 'ito-pool'
}

export enum DialogTabs {
    create = 0,
    past = 1,
}
