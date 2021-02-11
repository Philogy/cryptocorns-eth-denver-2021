const compToSign = (a, b) => {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}

const copyToClipboard = text => {
  // Create new element
  const el = document.createElement('textarea')
  // Set value (string to be copied)
  el.value = text
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '')
  el.style = { position: 'absolute', left: '-9999px' }
  document.body.appendChild(el)
  // Select text inside element
  el.select()
  // Copy text to clipboard
  document.execCommand('copy')
  // Remove temporary element
  document.body.removeChild(el)
}

const defaultPath = ({ path }) => ({ path: '', redirect: path })

const capitalize = string => `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`

const getRouteMeta = route => {
  const meta = route?.meta ?? null

  if (typeof meta === 'function') return meta(route)
  return meta
}

export { compToSign, defaultPath, capitalize, copyToClipboard, getRouteMeta }
