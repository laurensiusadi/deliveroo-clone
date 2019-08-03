<template>
  <section class="container">
    <div class="row">
      <div class="col-md-12">
        <div class="form-group my-3">
          <input v-model="query" type="text" class="form-control" placeholder="Search...">
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <div class="row">
          <div v-for="restaurant in filteredList" :key="restaurant.id" class="col-md-4 col-sm-6">
            <div class="card mb-4">
              <img :src="restaurant.image.url" class="card-img-top">
              <div class="card-body">
                <h5 class="card-title">{{ restaurant.name }}</h5>
                <p class="card-text text-muted">{{ restaurant.description || 'No description provided' }}.</p>
                <router-link :to="{ name: 'restaurants-id', params: { id: restaurant.id }}" tag="a" class="btn btn-primary">
                  See dishes
                </router-link>
              </div>
            </div>
          </div>
          <p v-if="!filteredList.length">No results :(</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import Strapi from 'strapi-sdk-javascript/build/main'
const apiUrl = process.env.API_URL || 'http://localhost:1337'
const strapi = new Strapi(apiUrl)

export default {
  data() {
    return {
      query: ''
    }
  },
  computed: {
    filteredList() {
      return this.restaurants.filter((restaurant) => {
        return restaurant.name.toLowerCase().includes(this.query.toLowerCase())
      })
    },
    restaurants() {
      return this.$store.getters['restaurants/list']
    }
  },
  async fetch({ store }) {
    store.commit('restaurants/emptyList')
    const response = await strapi.request('post', '/graphql', {
      data: {
        query: `query {
            restaurants {
              id
              name
              description
              image {
                url
              }
            }
          }
          `
      }
    })
    response.data.restaurants.forEach((restaurant) => {
      restaurant.image.url = `${apiUrl}${restaurant.image.url}`
      store.commit('restaurants/add', {
        id: restaurant.id,
        ...restaurant
      })
    })
  }
}
</script>

<style scoped>
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-text {
  height: 6rem;
  overflow-y: hidden;
}

.card-img-top {
  height: 24rem;
  width: 100%;
  overflow: hidden;
  object-fit: cover;
  vertical-align: middle;
}

</style>
