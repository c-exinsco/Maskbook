import type { ERC20TokenRecord } from '../Wallet/database/types'
import type {
    ERC20TokenDetailed,
    EtherTokenDetailed,
    EthereumTokenType,
    EthereumNetwork,
    TokenOutMask,
} from '../../web3/types'

/**
 * @see https://github.com/DimensionDev/Tessercube-iOS/wiki/Red-Packet-Data-Dictionary
 */

export interface RedPacketRecord {
    /** The red packet ID */
    id: string
    /** From twitter/facebook url */
    from: string
    password: string
    contract_version: number
    /** backward compatible V1 */
    payload?: {
        contract_version: number
        password: string
    }
}

export interface RedPacketRecordInDatabase extends RedPacketRecord {
    /** An unique record type in DB */
    type: 'red-packet'
}

export enum RedPacketStatus {
    claimed = 'claimed',
    expired = 'expired',
    empty = 'empty',
    refunded = 'refunded',
}

export enum DialogTabs {
    create = 0,
    past = 1,
}

export interface RedPacketAvailability {
    token_address: string
    balance: string
    total: string
    claimed: string
    expired: boolean
    claimed_amount?: string // V2
    ifclaimed?: boolean // V1
}

interface RedPacketBasic {
    contract_address: string
    rpid: string
    password: string
    shares: number
    is_random: boolean
    total: string
    creation_time: number
    duration: number
}

export interface RedPacketJSONPayload extends RedPacketBasic {
    sender: {
        address: string
        name: string
        message: string
    }
    txid?: string
    contract_version: number
    network?: EthereumNetwork
    token_type: EthereumTokenType.Native | EthereumTokenType.ERC20
    token?: Pick<ERC20TokenRecord, 'address' | 'name' | 'decimals' | 'symbol'>
}

export interface RedPacketSubgraphInMask extends RedPacketBasic {
    message: string
    name: string
    txid: string
    total_remaining: string
    last_updated_time: number
    chain_id: number
    token: EtherTokenDetailed | ERC20TokenDetailed
    creator: {
        name: string
        address: string
    }
    claimers: {
        name: string
        address: string
    }[]
}

export interface RedPacketSubgraphOutMask extends Omit<RedPacketSubgraphInMask, 'token'> {
    token: TokenOutMask
}

export interface RedPacketHistory extends RedPacketSubgraphInMask {
    payload: RedPacketJSONPayload
    contract_version: number
}
