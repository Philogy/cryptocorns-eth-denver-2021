import Tokens from './Tokens'

import AllTokens from './AllTokens'
import MyTokens from './MyTokens'

export default {
  path: 'tokens',
  component: Tokens,
  children: [
    { path: '', redirect: 'all' },
    { path: 'all', component: AllTokens },
    { path: 'personal', component: MyTokens }
  ]
}
