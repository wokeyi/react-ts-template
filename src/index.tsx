import { render } from 'server-renderer'
import App from './App'
import routes from './routes'

render({
  container: '#root',
  App,
  routes,
})