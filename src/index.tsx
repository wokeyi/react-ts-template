import { render } from 'server-renderer'
import App from './App'
import routes from './routes'

render({
  container: '#root',
  App: App as any,
  routes,
})