import type { FixedTokenListProps } from '../../extension/options-page/DashboardComponents/FixedTokenList'
import type { NativeTokenDetailed, ERC20TokenDetailed } from '../../web3/types'
import { createPluginMessage } from '../utils/createPluginMessage'
import { createPluginRPC } from '../utils/createPluginRPC'
import { PLUGIN_IDENTIFIER } from './constants'
import type { WalletRecord } from './database/types'

export type SelectProviderDialogEvent =
    | {
          open: true
      }
    | {
          open: false
          address?: string
      }

export type SelectWalletDialogEvent = {
    open: boolean
}

export type CreateImportWalletDialogEvent = {
    open: boolean
}

export type CreateWalletDialogEvent = {
    name?: string
    open: boolean
}

export type ImportWalletDialogEvent = {
    name?: string
    open: boolean
}

export type WalletStatusDialogEvent = {
    open: boolean
}

export type WalletRenameDialogEvent = {
    open: boolean
    wallet: WalletRecord | null
}

export type WalletConnectQRCodeDialogEvent =
    | {
          open: true
          uri: string
      }
    | {
          open: false
      }

export type SelectTokenDialogEvent =
    | {
          open: true
          uuid: string
          disableEther?: boolean
          disableSearchBar?: boolean
          FixedTokenListProps?: Omit<FixedTokenListProps, 'onSubmit'>
      }
    | {
          open: false
          uuid: string

          /**
           * The selected detailed token.
           */
          token?: NativeTokenDetailed | ERC20TokenDetailed
      }

interface WalletMessage {
    /**
     * Select wallet dialog
     */
    selectWalletDialogUpdated: SelectWalletDialogEvent

    /**
     * Create or import wallet choose dialog
     */
    createImportWalletDialogUpdated: CreateImportWalletDialogEvent

    /**
     * Create wallet dialog
     */
    createWalletDialogUpdated: CreateWalletDialogEvent

    /**
     * import wallet dialog
     */
    importWalletDialogUpdated: ImportWalletDialogEvent

    /**
     * Select provider dialog
     */
    selectProviderDialogUpdated: SelectProviderDialogEvent

    /**
     * Wallet status dialog
     */
    walletStatusDialogUpdated: WalletStatusDialogEvent

    /**
     * Wallet status dialog
     */
    walletRenameDialogUpdated: WalletRenameDialogEvent

    /**
     * Select token dialog
     */
    selectTokenDialogUpdated: SelectTokenDialogEvent

    /**
     * WalletConnect QR Code dialog
     */
    walletConnectQRCodeDialogUpdated: WalletConnectQRCodeDialogEvent

    walletsUpdated: void
    phrasesUpdated: void
    erc20TokensUpdated: void
    erc721TokensUpdated: void
    erc1155TokensUpdated: void
    rpc: unknown
}

if (module.hot) module.hot.accept()
export const WalletMessages = createPluginMessage<WalletMessage>(PLUGIN_IDENTIFIER)
export const WalletRPC = createPluginRPC(PLUGIN_IDENTIFIER, () => import('./services'), WalletMessages.events.rpc)
