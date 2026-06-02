<script setup lang="ts">
import { ref } from 'vue'
import { ApiProductRepository } from '~/modules/products/infrastructure/api-product.repository'
import type { Product } from '~/modules/products/domain/product.model'

const productRepository = new ApiProductRepository()

// Estados del formulario
const name = ref('')
const price = ref(0)
const selectedCategory = ref('entrantes') // Inicializado en minúscula para sincronía con BD
const imagenArchivo = ref<File | null>(null)
const imagePreview = ref('')

const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// 🌟 Array mapeado con las 12 categorías reales de Ukiyo para el SelectMenu profesional
const categories = [
  { label: 'Entrantes', value: 'entrantes' },
  { label: 'Niguiris', value: 'niguiris' },
  { label: 'Hosomakis', value: 'hosomakis' },
  { label: 'Futomakis', value: 'futomakis' },
  { label: 'Uramakis', value: 'uramakis' },
  { label: 'Novedades!', value: 'novedades!' },
  { label: 'Combos', value: 'combos' },
  { label: 'Variados Ukiyo', value: 'variados ukiyo' },
  { label: 'Pokes', value: 'pokes' },
  { label: 'Postres', value: 'postres' },
  { label: 'Bebidas', value: 'bebidas' },
  { label: 'Suplementos', value: 'suplementos' }
]

// Manejar la selección de la foto y crear una previsualización rápida
const onFileSelected = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    imagenArchivo.value = file
    imagePreview.value = URL.createObjectURL(file)
  }
}

const handleGuardarPlato = async () => {
  if (!name.value || price.value < 0) {
    errorMsg.value = 'Por favor, rellena los campos obligatorios.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''
  
  let urlImagenFinal = ''

  try {
    // Paso 1: Subida autónoma de la foto a ImgBB si existe
    if (imagenArchivo.value) {
      const formData = new FormData()
      formData.append('image', imagenArchivo.value)

      // TODO: Reemplaza esto por tu clave personal de ImgBB (api.imgbb.com)
      const IMGBB_API_KEY = 'TU_IMGBB_API_KEY_AQUI'
      
      const imgbbResponse = await $fetch<any>(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData
      })
      
      urlImagenFinal = imgbbResponse.data.url
    }

    // Paso 2: Crear el objeto cumpliendo estrictamente con la interfaz "Product"
    const nuevoProducto: Product = {
      name: name.value,
      price: Number(price.value),
      description: urlImagenFinal || 'Sin descripción', // Guardamos la URL en la descripción temporalmente
      category: selectedCategory.value,
      available: true
    }

    // Paso 3: Enviar al repositorio
    await productRepository.create(nuevoProducto)

    successMsg.value = '¡Plato gastronómico creado con éxito en Ukiyo!'
    setTimeout(() => {
      navigateTo('/menu') 
    }, 1500)

  } catch (err: any) {
    console.error('Error al guardar el producto:', err)
    errorMsg.value = err.data?.message || 'El Gateway rechazó el producto. Verifica la conexión.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto pt-6 pb-12 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Plato Ukiyo</h1>
      <p class="text-gray-500 text-sm">Añade un producto culinario a la carta mapeando la imagen de forma externa.</p>
    </div>

    <UCard>
      <form @submit.prevent="handleGuardarPlato" class="space-y-5 p-2">
        
        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre del Plato *</label>
          <UInput v-model="name" placeholder="Ej: Dragon Roll Especial" required class="w-full" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Precio (€) *</label>
            <UInput v-model="price" type="number" step="0.01" min="0" required class="w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Categoría</label>
            <USelectMenu 
              v-model="selectedCategory" 
              :options="categories" 
              value-attribute="value"
              option-attribute="label"
              placeholder="Selecciona la categoría"
              searchable
              searchable-placeholder="Buscar categoría..."
              class="w-full" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Fotografía del Plato</label>
          <div class="flex items-center gap-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50/50 dark:bg-gray-800/30">
            <div v-if="imagePreview" class="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 bg-white flex-shrink-0">
              <img :src="imagePreview" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-16 h-16 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 flex-shrink-0">
              <UIcon name="i-heroicons-photo" class="w-8 h-8" />
            </div>
            <input type="file" accept="image/*" @change="onFileSelected" class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer" />
          </div>
        </div>

        <UAlert v-if="errorMsg" title="Error" :description="errorMsg" color="red" variant="soft" icon="i-heroicons-x-circle" />
        <UAlert v-if="successMsg" title="Éxito" :description="successMsg" color="green" variant="soft" icon="i-heroicons-check-circle" />

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="gray" variant="ghost" to="/menu" :disabled="isLoading">Cancelar</UButton>
          <UButton type="submit" color="primary" :loading="isLoading">
            {{ isLoading ? 'Subiendo datos...' : 'Crear Plato' }}
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>