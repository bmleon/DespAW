<template>
  <div class="overflow-x-auto bg-white rounded-lg shadow-md p-6">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold text-gray-800">Catálogo de Platos</h2>
      <button @click="loadProducts" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm transition">
        🔄 Actualizar
      </button>
    </div>

    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plato</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
          <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
          <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="product in products" :key="product.id">
          <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
              <div class="text-sm font-medium text-gray-900">{{ product.name }}</div>
            </div>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {{ product.category }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
            {{ product.price }}€
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <span :class="product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full">
              {{ product.available ? 'Disponible' : 'Agotado' }}
            </span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button @click="deleteProduct(product.id)" class="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded transition">
              Eliminar
            </button>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="5" class="px-6 py-10 text-center text-sm text-gray-500">
            No hay platos registrados en el menú todavía.
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ApiProductRepository } from '../api-product.repository'
import { GetProductsUseCase } from '../../application/get-products.usecase'
import type { Product } from '../../domain/product.model'

const products = ref<Product[]>([])

const productRepository = new ApiProductRepository()
const getProductsUseCase = new GetProductsUseCase(productRepository)

const loadProducts = async () => {
  try {
    products.value = await getProductsUseCase.execute()
  } catch (error) {
    alert('Error al conectar con la API del clúster')
  }
}

const deleteProduct = async (id: string | undefined) => {
  if (!id) return
  if (confirm('¿Seguro que deseas eliminar este plato de la carta?')) {
    try {
      await productRepository.delete(id)
      await loadProducts()
    } catch (error) {
      alert('No se pudo borrar el producto')
    }
  }
}

onMounted(() => {
  loadProducts()
})
</script>