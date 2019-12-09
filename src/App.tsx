import * as React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { StoreProvider } from 'src/containers'
import routes from 'src/routes'

const App: React.FC = () => {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Switch>
          {routes.map((route, index) => (
            <Route key={index} {...route} />
          ))}
        </Switch>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App