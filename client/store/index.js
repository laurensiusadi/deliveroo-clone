export const actions = {
  nuxtClientInit({ commit }, context) {
    const user = this.$cookies.get('user')
    console.log('nuxtClientInit', user)
    if (user) {
      commit('auth/setUser', user)
    }
  }
}
