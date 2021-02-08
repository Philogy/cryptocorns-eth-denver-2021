import Tokens from './Tokens'
import tokensSubRoutes from './Tokens/sub-routes'
import Trade from './Trade'

export default [
  { path: '', redirect: 'tokens' },
  { path: 'tokens', component: Tokens, children: tokensSubRoutes },
  { path: 'trade', component: Trade }
]
