<template>
  <section class="container">
    <div>
      <h1 class="mt-2">Dishes</h1>
      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div v-for="dish in dishes" :key="dish.id" class="col-md-4 col-sm-6">
              <div class="card">
                <img :src="dish.image.url" class="card-img-top" alt="Card image cap">
                <div class="card-body">
                  <h5 class="card-title">{{ dish.name }}</h5>
                  <p class="card-text">{{ dish.description || 'No description provided.' }}</p>
                  <p class="card-text">${{ dish.price }}</p>
                  <button class="btn btn-primary" @click="addToCart(dish)">Add to cart</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">Cart</h5>
              <p class="card-text">{{ numberOfItems }} items selected:</p>
              <ul>
                <li v-for="dish in selectedDishes" :key="dish.id" class="card-text mb-2">
                  Name: {{ dish.name }} (${{ dish.price }}) ({{ dish.quantity }})
                  <button class="btn btn-sm btn-success" @click="addToCart(dish)">+</button>
                  <button class="btn btn-sm btn-warning ml-2" @click="removeFromCart(dish)">-</button>
                </li>
              </ul>
              <h5 class="card-text">
                Total: ${{ price }}
              </h5>
              <p v-if="!selectedDishes.length">Please select some items.</p>
              <button :disabled="!selectedDishes.length" class="btn btn-primary">Order</button>
            </div>
          </div>
        </div>
      </div>
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
      complete: false
    }
  },
  computed: {
    id() {
      return this.$route.params.id
    },
    dishes() {
      return this.$store.getters['dishes/list']
    },
    selectedDishes() {
      return this.$store.getters['cart/items']
    },
    price() {
      return this.$store.getters['cart/price']
    },
    numberOfItems() {
      return this.$store.getters['cart/numberOfItems']
    }
  },
  async fetch({ store, params }) {
    store.commit('dishes/emptyList')
    const response = await strapi.request('post', '/graphql', {
      data: {
        query: `query {
            restaurant(id: "${params.id}") {
              id
              name
              dishes {
                id
                name
                description
                price
                image {
                  url
                }
              }
            }
          }
          `
      }
    })
    response.data.restaurant.dishes.forEach((dish) => {
      dish.image.url = `${apiUrl}${dish.image.url}`
      store.commit('dishes/add', {
        id: dish.id,
        ...dish
      })
    })
  },
  methods: {
    ...mapMutations({
      addToCart: 'cart/add',
      removeFromCart: 'cart/remove',
      emptyCart: 'cart/emptyList'
    })
  }
}
</script>
