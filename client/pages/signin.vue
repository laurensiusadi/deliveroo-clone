<template>
  <section class="container">
    <div class="col-md-6 offset-md-3 mt-3">
      <form autocomplete="off" @submit.stop.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email</label>
          <b-form-input
            id="email"
            v-model="email"
            type="email"
            :autofocus="true"
            placeholder="Enter your email"
            required
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <b-form-input
            id="password"
            v-model="password"
            label="password"
            type="password"
            class="form-control"
            :autofocus="true"
            placeholder="Enter your password"
            required
          />
        </div>
        <button :disabled="loading" type="submit" class="btn btn-primary btn-block mt-3">Login</button>
        <p class="text-center mt-3">
          No account yet?
          <router-link :to="{ name: 'signup'}" tag="a">
            Register here
          </router-link>
        </p>
      </form>
    </div>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import Strapi from 'strapi-sdk-javascript/build/main'

const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

export default {
  data() {
    return {
      email: '',
      password: '',
      loading: false
    }
  },
  methods: {
    async handleSubmit() {
      try {
        this.loading = true
        const response = await strapi.login(this.email, this.password)
        this.loading = false
        console.log('logged in', response)
        this.setUser(response.user)
        this.$router.push('/')
      } catch (err) {
        this.loading = false
        alert(err.message || 'An error occurred.')
      }
    },
    ...mapMutations({
      setUser: 'auth/setUser'
    })
  }
}
</script>
