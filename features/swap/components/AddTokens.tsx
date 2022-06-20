/* eslint-disable react-hooks/rules-of-hooks */
import {
  Button,
  ErrorIcon,
  IconWrapper,
  Inline,
  Toast,
  Valid,
} from 'junoblocks'
import { toast } from 'react-hot-toast'

import { useTokenInfo } from '../../../hooks/useTokenInfo'
import { TokenInfo } from '../../../queries/usePoolsListQuery'

type AddTokenProps = {
  tokenASymbol: string
  tokenBSymbol: string
  disabled?: boolean
}

export const AddTokens = ({
  tokenASymbol,
  tokenBSymbol,
  disabled,
}: AddTokenProps) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)

  const isEmpty = (token: TokenInfo) => token && token.token_address !== ''

  const useAddToken = async (token_address: string, chain_id: string) => {
    if (window && !window?.keplr) {
      throw new Error('Please install Keplr extension and refresh the page.')
    }
    return window.keplr
      .suggestToken(chain_id, token_address)
      .then(() =>
        toast.custom((t) => (
          <Toast
            icon={<IconWrapper icon={<Valid />} color="valid" />}
            title="Added token to Keplr!"
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      )
      .catch((e: any) =>
        toast.custom((t) => (
          <Toast
            icon={<ErrorIcon color="error" />}
            title="Failure"
            body={e.message}
            onClose={() => toast.dismiss(t.id)}
          />
        ))
      )
  }

  if (disabled) return <></>
  return (
    <Inline gap={3}>
      {isEmpty(tokenA) && (
        <Button
          onClick={() => useAddToken(tokenA.token_address, tokenA.chain_id)}
          size="medium"
          variant="ghost"
        >
          Add {tokenASymbol}
        </Button>
      )}
      {isEmpty(tokenB) && (
        <Button
          onClick={() => useAddToken(tokenB.token_address, tokenB.chain_id)}
          size="medium"
          variant="ghost"
        >
          Add {tokenBSymbol}
        </Button>
      )}
    </Inline>
  )
}
