import { defaultRoute } from '../../utils/general'

import Manage from './main'
import Tokens from './Tokens'
import Trade from './Trade'

export default {
  path: 'manage',
  component: Manage,
  children: [defaultRoute(Tokens), Tokens, { path: 'trade', component: Trade }]
}
