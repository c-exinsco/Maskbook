import * as jwt from 'jsonwebtoken'
import { sha3 } from 'web3-utils'
import type { RedPacketRecord, RedPacketJSONPayload, RedPacketRecordWithHistory } from './types'
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

export async function discoverRedPacket(from: string, payload: RedPacketJSONPayload) {
    if (!payload.rpid) return
    if (!payload.password) return
    const record_ = await database.getRedPacket(payload.rpid)
    const record: RedPacketRecord = {
        id: payload.rpid,
        from: record_?.from || from,
        payload: record_?.payload ?? payload,
    }
    database.addRedPacket(record)
    RedPacketMessage.events.redPacketUpdated.sendToAll(undefined)
}

export async function getAllRedPackets(address: string) {
    const chainId = await getChainId()
    const redPacketsFromChain = await subgraph.getAllRedPackets(address)
    const redPacketsFromDB = await database.getRedPacketsHistory(redPacketsFromChain.map((x) => x.rpid))
    return redPacketsFromChain.reduce((acc, history) => {
        const record = redPacketsFromDB.find((y) => y.payload.rpid === history.rpid)
        if (history.chain_id === chainId && record) {
            acc.push({
                history,
                record,
            })
        }
        return acc
    }, [] as RedPacketRecordWithHistory[])
}
