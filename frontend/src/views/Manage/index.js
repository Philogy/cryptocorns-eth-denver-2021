import Manage from './Manage'

import { defaultPath } from '@/utils/misc'
import Tokens from './Tokens'

export default {
  path: '/manage',
  component: Manage,
  children: [defaultPath(Tokens), Tokens, { path: '', redirect: 'tokens' }]
}
