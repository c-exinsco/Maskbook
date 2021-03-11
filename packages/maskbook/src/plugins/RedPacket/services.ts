import * as jwt from 'jsonwebtoken'
import { sha3 } from 'web3-utils'
import type { RedPacketRecord } from './types'
import { RedPacketMessage } from './messages'
import * as database from './database'
import { resolveChainName } from '../../web3/pipes'
import Services from '../../extension/service'
import { getChainId } from '../../extension/background-script/EthereumService'
import * as subgraph from './apis'

export async function claimRedPacket(
    from: string,
    rpid: string,
    password: string,
): Promise<{ claim_transaction_hash: string }> {
    const host = 'https://redpacket.gives'
    const x = 'a3323cd1-fa42-44cd-b053-e474365ab3da'

    const chainId = await Services.Ethereum.getChainId(from)
    const network = resolveChainName(chainId).toLowerCase()
    const auth = await fetch(`${host}/hi?id=${from}&network=${network}`)
    if (!auth.ok) throw new Error('Auth failed')

    const verify = await auth.text()
    const jwt_encoded: {
        password: string
        recipient: string
        redpacket_id: string
        validation: string
        signature: string
    } = {
        password,
        recipient: from,
        redpacket_id: rpid,
        validation: sha3(from)!,
        // TODO: This is not working on MetaMask cause it require the private key.
        signature: await Services.Ethereum.sign(verify, from),
    }
    const pay = await fetch(
        `${host}/please?payload=${jwt.sign(jwt_encoded, x, { algorithm: 'HS256' })}&network=${network}`,
    )
    if (!pay.ok) throw new Error('Pay failed')
    return { claim_transaction_hash: await pay.text() }
}

export async function discoverRedPacket(record: RedPacketRecord) {
    if (record.contract_version === 1) {
        const txid = await subgraph.getRedPacketTxid(record.id)
        if (!txid) return
        record.id = txid
    }
    database.addRedPacket(record)
    RedPacketMessage.events.redPacketUpdated.sendToAll(undefined)
}

export async function getRedPacketHistoryWithPassword(address: string) {
    const chainId = await getChainId()
    const historys = await subgraph.getRedPacketHistory(address)
    const historysWithPassword = []
    for (const history of historys) {
        await database.updateV1ToV2(history)
        const record = await database.getRedPacket(history.txid)
        if (history.chain_id === chainId && record) {
            history.payload.password = history.password = record.password
            history.payload.contract_version = history.contract_version = record.contract_version
            historysWithPassword.push(history)
        }
    }
    return historysWithPassword
}
