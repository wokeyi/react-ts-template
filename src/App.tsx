import * as React from 'react'
import { AppProps } from 'server-renderer'

interface IAppProps extends AppProps {
  error: string
}

const App: React.FC<IAppProps> = ({
  Component, error, ...pageProps
}) => {
  if (Component) {
    return <Component {...pageProps}/>
  }
  return (
    <div>{error}</div>
  )
}

export default App