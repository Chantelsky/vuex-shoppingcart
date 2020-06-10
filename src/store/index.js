import Vue from 'vue';
import Vuex from 'vuex';
import shop from '@/api/shop';
Vue.use(Vuex);

//eslint ignore
export default new Vuex.Store({
  state: {
    //data that the component depends on
    products: [],
    //id, quantity
    cart: [],
    checkoutStatus: null,
  },
  getters: {
    //accesses our state
    availableProducts(state) {
      //passes the state as first parameter and then all existing getters as the 2nd parameter.
      return state.products.filter((product) => product.inventory > 0);
    },
    cartProducts(state) {
      return state.cart.map((cartItem) => {
        const product = state.products.find(
          (product) => product.id === cartItem.id
        );
        return {
          title: product.title,
          price: product.price,
          quantity: cartItem.quantity,
        };
      });
    },
    cartTotal(state, getters) {
      return getters.cartProducts.reduce(
        (total, product) => total + product.price * product.quantity,
        0
      );
    },
    productIsInStock() {
      return (product) => {
        return product.inventory > 0;
      };
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
    addProductToCart({ state, getters, commit }, product) {
      if (getters.productIsInStock(product)) {
        //find cart item
        const cartItem = state.cart.find((item) => item.id === product.id);
        if (!cartItem) {
          //product to cart
          commit('pushProductToCart', product.id);
        } else {
          //increment
          commit('incrementItemQuantity', cartItem);
        }
        //decrement
        commit('decrementProductInventory', product);
      }
    },
    checkout({ state, commit }) {
      shop.buyProducts(
        state.cart,
        () => {
          commit('emptyCart');
          commit('setCheckoutStatus', 'success');
        },
        () => {
          commit('setCheckoutStatus', 'fail');
        }
      );
    },
  },
  mutations: {
    //commit and track state changes
    setProducts(state, products) {
      state.products = products;
    },
    pushProductToCart(state, productId) {
      state.cart.push({
        id: productId,
        quantity: 1,
      });
    },
    incrementItemQuantity(state, cartItem) {
      cartItem.quantity++;
    },
    decrementProductInventory(state, product) {
      product.inventory--;
    },
    setCheckoutStatus(state, status) {
      state.checkoutStatus = status;
    },
    emptyCart(state) {
      state.cart = [];
    },
  },
});
