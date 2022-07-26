import { createDirectStore } from 'direct-vuex'

const {
  store,
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
} = createDirectStore({
  state: {},
  getters: {},
  mutations: {},
  actions: {},
  modules: {},
})

export default store

export {
  rootActionContext,
  moduleActionContext,
  rootGetterContext,
  moduleGetterContext,
}
export type AppStore = typeof store
declare module 'vuex' {
  interface Store<S> {
    direct: AppStore
  }
}
