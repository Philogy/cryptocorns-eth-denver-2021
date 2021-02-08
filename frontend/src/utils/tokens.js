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
  if (symbol === 'ETH') return 'https://info.uniswap.org/static/media/eth.73dabb37.png'
  const address = getTokenAddress(symbol)
  const url = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`
  return url
}

export { tokenAddresses, getTokenIcon, getTokenAddress }
