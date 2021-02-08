export const compToSign = (a, b) => {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}

export const defaultRoute = ({ path }) => ({ path: '', redirect: path })
