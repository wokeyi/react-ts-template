import { create } from '@wokeyi/store'

// @ts-ignore
const reducer = () => {
  return null
}

const { StoreProvider, useDispatch, useStore } = create(reducer)

export {
  StoreProvider,
  useDispatch,
  useStore,
}