<template>
  <div>
    <h1>Product List</h1>
    <img
      v-if="loading"
      src="https://a.disquscdn.com/get?url=http%3A%2F%2Fimgur.com%2FJfPpwOA.gif&key=wUJUXMr1tp11IuGb__NNSA&w=800&h=100"
    />
    <ul v-else>
      <li v-for="product in products" v-bind:key="product.id">
        {{ product.title }} - {{ product.price | currency }} -
        {{ product.inventory }}
        <button
          :disabled="!productIsInStock(product)"
          @click="addProductToCart(product)"
        >
          Add to Cart
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from 'vuex';

export default {
  data() {
    return {
      loading: false,
      //productIndex: 1,
    };
  },

  computed: {
    ...mapState({
      products: (state) => state.products,
    }),

    ...mapGetters({
      productIsInStock: 'productIsInStock',
    }),
  },

  methods: {
    ...mapActions({
      fetchProducts: 'fetchProducts',
      addProductToCart: 'addProductToCart',
    }),
  },

  created() {
    this.loading = true;
    this.fetchProducts().then(() => (this.loading = false));
  },
};
</script>
