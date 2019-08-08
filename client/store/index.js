export const actions = {
  nuxtClientInit({ commit }, context) {
    const user = this.$cookies.get('user')
    if (user) {
      commit('auth/setUser', user)
    }
    const cart = this.$cookies.get('cart')
    if (cart) {
      commit('cart/setItems', cart)
    }
  }
}
