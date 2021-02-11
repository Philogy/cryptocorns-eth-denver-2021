import Tokens from './Tokens'

import AllTokens from './AllTokens'
import MyTokens from './MyTokens'
import Token from './Token'

const overviewSubRoutes = [
  { path: '/manage/tokens/all', label: 'All' },
  { path: '/manage/tokens/personal', label: 'My Tokens' }
]

export default {
  path: 'tokens',
  component: Tokens,
  children: [
    { path: '', redirect: 'all' },
    { path: 'all', component: AllTokens, meta: { subMenuRoutes: overviewSubRoutes } },
    { path: 'personal', component: MyTokens, meta: { subMenuRoutes: overviewSubRoutes } },
    Token
  ]
}
