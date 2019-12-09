import * as React from 'react'
import { StoreProvider as Provider } from 'src/store'

const initialState = {}

const StoreProvider: React.FC = props => {
  return (
    <Provider initialState={initialState}>
      {props.children}
    </Provider>
  )
}

export default StoreProvider