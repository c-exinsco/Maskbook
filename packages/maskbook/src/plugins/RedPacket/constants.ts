import { ChainId } from '../../web3/types'

/** DON'T CHANGE IT. */
export const RedPacketMetaKey = 'com.maskbook.red_packet:1'
export const RedPacketPluginID = 'com.maskbook.red_packet'

export const RED_PACKET_CONSTANTS = {
    HAPPY_RED_PACKET_ADDRESS_V1: {
        [ChainId.Mainnet]: '0x26760783c12181efa3c435aee4ae686c53bdddbb',
        [ChainId.Ropsten]: '0x6d84e4863c0530bc0bb4291ef0ff454a40660ca3',
        [ChainId.Rinkeby]: '0x575f906db24154977c7361c2319e2b25e897e3b6',
        [ChainId.Kovan]: '',
        [ChainId.Gorli]: '',
    },
    HAPPY_RED_PACKET_ADDRESS_V2: {
        [ChainId.Mainnet]: '0x26760783c12181efa3c435aee4ae686c53bdddbb',
        [ChainId.Ropsten]: '0x25Dfa3275E2C44ce51E8ff977B9BdcF24aE46A34',
        [ChainId.Rinkeby]: '0x575f906db24154977c7361c2319e2b25e897e3b6',
        [ChainId.Kovan]: '',
        [ChainId.Gorli]: '',
    },
    SUBGRAPH_URL: {
        [ChainId.Mainnet]: 'https://api.thegraph.com/subgraphs/name/dimensiondev/mask-red-packet',
        [ChainId.Ropsten]: 'https://api.thegraph.com/subgraphs/name/dimensiondev/mask-red-packet-ropsten',
        [ChainId.Rinkeby]: '',
        [ChainId.Kovan]: '',
        [ChainId.Gorli]: '',
    },
}

export const RED_PACKET_CONTRACT_VERSION = 2

export const RED_PACKET_DEFAULT_SHARES = 5
export const RED_PACKET_MIN_SHARES = 1
export const RED_PACKET_MAX_SHARES = 999

export const RED_PACKET_HISTORY_URL = 'https://service.r2d2.to/red-packet-history'
export const RED_PACKET_HISTROY_MAX_BLOCK_SIZE = Math.floor(
    (30 /* days */ * 24 /* hours */ * 60 /* minutes */ * 60) /* seconds */ / 15 /* each block in seconds */,
)
