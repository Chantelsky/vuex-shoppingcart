<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://a.disquscdn.com/get?url=http%3A%2F%2Fimgur.com%2FJfPpwOA.gif&key=wUJUXMr1tp11IuGb__NNSA&w=800&h=100"
    />
    <ul v-else>
      <li v-for="product in products" v-bind:key="product.id">
        {{ product.title }} - {{ product.price }}
      </li>
    </ul>
  </div>
</template>

<script>
import store from '@/store/index';

export default {
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    products() {
      return store.getters.availableProducts;
    },
  },

  created() {
    this.loading = true;
    store.dispatch('fetchProducts').then(() => (this.loading = false));
  },
};
</script>
