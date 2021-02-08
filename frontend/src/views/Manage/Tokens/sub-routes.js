import AllTokens from './AllTokens'
import MyTokens from './MyTokens'

export default [
  { path: '', redirect: 'all' },
  { path: 'all', component: AllTokens },
  { path: 'personal', component: MyTokens }
]
