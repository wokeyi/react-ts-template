import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './App'
import registerSW from './service-worker'
import './global.scss'

ReactDOM.render(
  <App/>,
  document.getElementById('root')
)

registerSW()