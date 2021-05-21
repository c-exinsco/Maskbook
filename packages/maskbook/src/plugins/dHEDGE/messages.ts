import type { NativeTokenDetailed, ERC20TokenDetailed } from '../../web3/types'
import { createPluginMessage } from '../utils/createPluginMessage'
import { createPluginRPC } from '../utils/createPluginRPC'
import { DHEDGE_PLUGIN_ID } from './constants'
import type { Pool } from './types'
import type { WebExtensionMessage } from '@dimensiondev/holoflows-kit'

type InvestDialogUpdated =
    | {
          open: true
          pool: Pool
          token: NativeTokenDetailed | ERC20TokenDetailed
      }
    | {
          open: false
      }

interface DHedgeMessages {
    /**
     * Open invest dialog
     */
    InvestDialogUpdated: InvestDialogUpdated

    rpc: unknown
}

export const PluginDHedgeMessages: WebExtensionMessage<DHedgeMessages> =
    createPluginMessage<DHedgeMessages>(DHEDGE_PLUGIN_ID)
export const PluginDHedgeRPC = createPluginRPC(
    DHEDGE_PLUGIN_ID,
    () => import('./services'),
    PluginDHedgeMessages.events.rpc,
)
