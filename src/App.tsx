import * as React from 'react'
import { AppProps } from 'server-renderer'

interface IAppProps {
  error?: string
}

const App: React.FC<AppProps<IAppProps>> = ({
  Component, pageProps,
}) => {
  if (Component) {
    return <Component {...pageProps}/>
  }
  return (
    <div>{pageProps.error}</div>
  )
}

export default App