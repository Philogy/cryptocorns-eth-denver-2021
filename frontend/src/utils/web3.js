const listenTo = (emitter, eventName, callback) => {
  emitter.on(eventName, callback)
  return () => {
    emitter.removeListener(eventName, callback)
  }
}

export { listenTo }
