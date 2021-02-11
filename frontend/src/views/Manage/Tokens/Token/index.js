import Token from './Token'
import Overview from './Overview'
import History from './History'

const tokenSubMenuRoutes = ({ params }) => ({
  subMenuRoutes: [
    { path: `/manage/tokens/token/${params.tokenAddr}/overview`, label: 'Token' },
    { path: `/manage/tokens/token/${params.tokenAddr}/history`, label: 'History' }
  ]
})

export default {
  path: 'token/:tokenAddr',
  component: Token,
  children: [
    { path: '', redirect: 'overview' },
    { path: 'overview', component: Overview, meta: tokenSubMenuRoutes },
    { path: 'history', component: History, meta: tokenSubMenuRoutes }
  ]
}
