import Vue from 'vue';
import Vuex from 'vuex';
import shop from '@/api/shop';
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    //data that the component depends on
    products: [],
  },
  getters: {
    //accesses our state
    availableProducts(state) {
      //passes the state as first parameter and then all existing getters as the 2nd parametere.
      return state.products.filter((product) => product.inventory > 0);
    },
  },
  actions: {
    //updates the Vuex state
    fetchProducts({ commit }) {
      return new Promise((resolve) => {
        shop.getProducts((products) => {
          commit('setProducts', products);
          resolve();
          //pass in the name of the mutation and the payload
        });
      });
    },
  },
  mutations: {
    //commit and track state changes
    setProducts(state, products) {
      state.products = products;
    },
  },
});
