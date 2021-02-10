import networks from '@/eth/networks'

const listenTo = (emitter, eventName, callback) => {
  emitter.on(eventName, callback)
  return () => {
    emitter.removeListener(eventName, callback)
  }
}

const getNetwork = chainId => {
  if (chainId === null) return null

  const network = networks[chainId] ?? {
    name: `Unknown ${chainId}`,
    main: false,
    usable: false,
    type: 'COMMON'
  }
  network.chainId = chainId
  return network
}

export { listenTo, getNetwork }
