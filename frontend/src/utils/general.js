const compToSign = (a, b) => {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}

const defaultRoute = ({ path }) => ({ path: '', redirect: path })

const capitalize = string => `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`

export { compToSign, defaultRoute, capitalize }
