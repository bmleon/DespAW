<script setup lang="ts">
import { ref } from 'vue'
import { ApiProductRepository } from '~/modules/products/infrastructure/api-product.repository'

const productRepository = new ApiProductRepository()

// Estados del formulario
const name = ref('')
const price = ref(0)
const extensionImagen = ref('.jpg')

const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Array mapeado con las 12 categorías reales de Ukiyo
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

// Estado reactivo que guarda el objeto seleccionado del menú
const selectedCategory = ref(categories[0])

const handleGuardarPlato = async () => {
  if (!name.value || price.value < 0) {
    errorMsg.value = 'Por favor, rellena los campos obligatorios.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  // AUTOMATIZACIÓN DE LA RUTA DE LA IMAGEN:
  const nombreNormalizado = name.value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') 
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 

  const rutaImagenFinal = `/comida/${nombreNormalizado}${extensionImagen.value}`

  try {
    // 🌟 CORRECCIÓN DE BIENESTAR PARA EL NUEVO BACKEND:
    // Extraemos la etiqueta limpia ('Entrantes', 'Novedades!') o el valor,
    // y lo pasamos radicalmente a MAYÚSCULAS ('ENTRANTES', 'NOVEDADES!') tal y como pide el backend.
    const categoriaFormateada = selectedCategory.value.label.toUpperCase().trim()

    // 🚀 CONSTRUCCIÓN DEL OBJETO CORREGIDO SEGÚN EL DTO REAL:
    // Usamos 'any' temporalmente al llamar al repositorio si vuestro modelo 'Product' local 
    // todavía tiene la propiedad escrita como 'category' en inglés, evitando errores de tipado en el front.
    const nuevoProducto: any = {
      nombre: name.value.trim(),
      precio: Number(price.value),
      descripcion: `Exquisito plato de ${name.value.trim()} al estilo tradicional Ukiyo.`,
      disponible: true,
      
      // 🌟 Cambiado 'category' por 'categoria' en español y forzado a MAYÚSCULAS
      categoria: categoriaFormateada 
    }

    console.log('📦 Enviando plato sanitizado al nuevo DTO libre de bloqueos:', nuevoProducto)

    // Disparamos la petición al repositorio
    await productRepository.create(nuevoProducto)

    successMsg.value = '¡Plato gastronómico creado con éxito en Ukiyo!'
    setTimeout(() => {
      navigateTo('/menu') 
    }, 1500)

  } catch (err: any) {
    console.error('Error al guardar el producto:', err)
    errorMsg.value = err.data?.message || 'El Gateway rechazó el producto. Verifica el formato.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto pt-6 pb-12 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Nuevo Plato Ukiyo</h1>
      <p class="text-gray-500 text-sm">Añade un producto vinculándolo automáticamente a la carpeta public/comida.</p>
    </div>

    <UCard>
      <form @submit.prevent="handleGuardarPlato" class="space-y-5 p-2">
        
        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre del Plato *</label>
          <UInput v-model="name" placeholder="Ej: Ensalada Wakame" required class="w-full" />
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
              option-attribute="label"
              placeholder="Selecciona la categoría"
              searchable
              searchable-placeholder="Buscar categoría..."
              class="w-full" 
            />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Formato de la Foto</label>
          <URadioGroup
            v-model="extensionImagen"
            :options="[
              { label: 'Archivo .jpg (Ej: edamame.jpg)', value: '.jpg' },
              { label: 'Archivo .png (Ej: edamame.png)', value: '.png' }
            ]"
            class="text-sm text-gray-500"
          />
          <p class="text-gray-400 text-[11px] mt-2 italic">
            Asegúrate de que la foto física esté guardada exactamente en la carpeta del cliente bajo: <code class="text-primary-400">public/comida/</code>
          </p>
        </div>

        <UAlert v-if="errorMsg" title="Error" :description="errorMsg" color="red" variant="soft" icon="i-heroicons-x-circle" />
        <UAlert v-if="successMsg" title="Éxito" :description="successMsg" color="green" variant="soft" icon="i-heroicons-check-circle" />

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="gray" variant="ghost" to="/menu" :disabled="isLoading">Cancelar</UButton>
          <UButton type="submit" color="primary" :loading="isLoading">
            {{ isLoading ? 'Guardando...' : 'Crear Plato' }}
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>