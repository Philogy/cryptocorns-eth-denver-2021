import tokens from '@/eth/tokens'
import { capitalize } from './misc'
import BN from 'bn.js'
import { convertUQIntToFloat } from 'safe-qmath/utils'

const tokenAddresses = {
  DAI: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  BAT: '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
}

const getTokenAddress = symbol => {
  return tokenAddresses[symbol] ?? null
}

const getTokenIcon = symbol => {
  return `https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@9ab8d6934b83a4aa8ae5e8711609a70ca0ab1b2b/svg/color/${symbol.toLowerCase()}.svg`
}

const createLeverDesc = ({ collat, debt, leverage, type }) => {
  const [primary, secondary] = type === 'LONG' ? [collat, debt] : [debt, collat]
  return `${primary}-${secondary} ${leverage}x ${type[0]}${type.slice(1).toLowerCase()}`
}

const getLeverTokens = () => {
  return [...tokens].map(token => {
    const { type, collat, debt } = token
    const [primary, secondary] = type === 'LONG' ? [collat, debt] : [debt, collat]
    const pair = `${primary}-${secondary}`
    return {
      ...token,
      pair,
      primary,
      secondary,
      desc: createLeverDesc(token)
    }
  })
}

const makeDisp = tokenList => {
  return tokenList.map(({ type, leverage, ...other }) => {
    return {
      ...other,
      type: capitalize(type),
      leverage: `${leverage}x`
    }
  })
}
const fromAtomicUnits = (num, tokenDecimals) => {
  if (num === null) return null
  const uqInt = num.shln(64).div(new BN(10).pow(new BN(tokenDecimals)))
  return convertUQIntToFloat(uqInt)
}

export {
  tokenAddresses,
  getTokenIcon,
  getTokenAddress,
  createLeverDesc,
  getLeverTokens,
  makeDisp,
  fromAtomicUnits
}
