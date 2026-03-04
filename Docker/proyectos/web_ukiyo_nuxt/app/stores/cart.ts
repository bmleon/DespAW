import { defineStore } from 'pinia'

// Definimos la estructura de un producto en el carrito
interface CartItem {
  id: number | string
  name: string
  description?: string
  price: number
  image?: string
  category?: string
  quantity: number
}

// Definimos el estado de la tienda
interface CartState {
  items: CartItem[]
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: []
  }),
  
  getters: {
    // Sincronizado con NavBar y Cart: 'count' y 'total'
    count: (state): number => {
      return state.items.reduce((total, item) => total + (item.quantity || 1), 0)
    },
    total: (state): number => {
      return state.items.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)
    }
  },
  
  actions: {
    // Sincronizado con delivery.vue: 'add'
    add(product: Omit<CartItem, 'quantity'>) {
      const existingItem = this.items.find(item => item.id === product.id)
      if (existingItem) {
        existingItem.quantity++
      } else {
        this.items.push({ ...product, quantity: 1 })
      }
    },
    // Sincronizado con cart.vue: 'remove' y 'clear'
    remove(index: number) {
      this.items.splice(index, 1)
    },
    clear() {
      this.items = []
    }
  }
})