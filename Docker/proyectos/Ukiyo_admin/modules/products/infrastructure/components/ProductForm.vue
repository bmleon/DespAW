<template>
  <div class="bg-white rounded-lg shadow-md p-6 mb-8">
    <h2 class="text-xl font-bold text-gray-800 mb-4">Añadir Nuevo Plato al Menú</h2>
    
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Nombre del Plato</label>
          <input v-model="form.name" type="text" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white" placeholder="Ej. Sushi de Atún Picante" />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700">Precio (€)</label>
          <input v-model.number="form.price" type="number" step="0.01" required class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white" placeholder="0.00" />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Categoría</label>
        <select v-model="form.category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white">
          <option value="Entrantes">Entrantes</option>
          <option value="Sushi">Sushi</option>
          <option value="Ramen">Ramen</option>
          <option value="Postres">Postres</option>
          <option value="Bebidas">Bebidas</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700">Descripción del Plato</label>
        <textarea v-model="form.description" rows="3" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 bg-gray-50 focus:bg-white" placeholder="Ingredientes, alérgenos..."></textarea>
      </div>

      <div class="flex justify-end">
        <button type="submit" class="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md shadow transition">
          🚀 Guardar en la Carta
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ApiProductRepository } from '../api-product.repository'
import { CreateProductUseCase } from '../../application/create-product.usecase'

const emit = defineEmits(['product-created'])

const form = ref({
  name: '',
  price: 0,
  category: 'Sushi',
  description: '',
  available: true
})

const productRepository = new ApiProductRepository()
const createProductUseCase = new CreateProductUseCase(productRepository)

const handleSubmit = async () => {
  try {
    await createProductUseCase.execute(form.value)
    
    form.value = {
      name: '',
      price: 0,
      category: 'Sushi',
      description: '',
      available: true
    }
    
    alert('¡Plato guardado con éxito en la API!')
    emit('product-created')
  } catch (error: any) {
    alert(error.message || 'Error al guardar el plato')
  }
}
</script>