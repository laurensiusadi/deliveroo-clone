export const state = () => ({
  user: null
})

export const mutations = {
  setUser(state, user) {
    state.user = user
    this.$cookies.set('user', user)
  },
  logout(state) {
    state.user = null
    this.$cookies.set('user', null)
  }
}

export const getters = {
  username: (state) => {
    return state.user && state.user.username
  }
}
