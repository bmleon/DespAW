<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'default'
})

const route = useRoute()
const isEditMode = ref(false)
const productId = ref('')

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

const selectedCategory = ref(categories[0])

// 🌟 DETECTOR DE MODO: Si viene un ?id= en la URL, cargamos el plato para editar
onMounted(async () => {
  if (route.query.id) {
    isEditMode.value = true
    productId.value = String(route.query.id)
    isLoading.value = true
    
    try {
      console.log(`🔍 Cargando datos del producto ${productId.value} para editar...`)
      // Pedimos los datos del plato específico al backend
      const producto = await $fetch<any>(`https://ukiyocazorla.es/api/productos/${productId.value}`)
      
      if (producto) {
        name.value = producto.nombre || ''
        price.value = Number(producto.precio) || 0
        
        // Buscamos su categoría en nuestro array para seleccionarla en el desplegable
        const catEncontrada = categories.find(c => c.label.toUpperCase() === producto.categoria?.toUpperCase())
        if (catEncontrada) {
          selectedCategory.value = catEncontrada
        }
      }
    } catch (err) {
      console.error('Error al cargar el producto para edición:', err)
      errorMsg.value = 'No se pudieron precargar los datos del plato.'
    } finally {
      isLoading.value = false
    }
  }
})

const handleGuardarPlato = async () => {
  if (!name.value || price.value < 0) {
    errorMsg.value = 'Por favor, rellena los campos obligatorios.'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    const categoriaFormateada = selectedCategory.value.label.trim()

    // Automatización del nombre de la foto física para la descripción
    const nombreNormalizado = name.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-') 
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
    const rutaImagenFinal = `/comida/${nombreNormalizado}${extensionImagen.value}`

    const bodyPayload = {
      nombre: name.value.trim(),
      precio: Number(price.value),
      categoria: categoriaFormateada,
      descripcion: rutaImagenFinal
    }

    // 🚀 DECISIÓN DE RUTA: ¿POST (crear) o PUT (actualizar)?
    const urlApi = isEditMode.value 
      ? `https://ukiyocazorla.es/api/productos/${productId.value}`
      : 'https://ukiyocazorla.es/api/productos'
      
    const metodoHttp = isEditMode.value ? 'PUT' : 'POST'

    console.log(`📦 Enviando ${metodoHttp} al clúster:`, bodyPayload)

    await $fetch(urlApi, {
      method: metodoHttp,
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: bodyPayload
    })

    successMsg.value = isEditMode.value 
      ? '¡Plato gastronómico actualizado con éxito!' 
      : '¡Plato gastronómico creado con éxito!'
    
    setTimeout(() => {
      navigateTo('/menu') 
    }, 1500)

  } catch (err: any) {
    console.error('Error crítico en la operación del producto:', err)
    errorMsg.value = err.data?.message || 'El Gateway rechazó la operación. Verifica los campos.'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-xl mx-auto pt-6 pb-12 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
        {{ isEditMode ? 'Editar Plato Ukiyo' : 'Nuevo Plato Ukiyo' }}
      </h1>
      <p class="text-gray-500 text-sm">
        {{ isEditMode ? 'Modifica las propiedades del producto en tiempo real.' : 'Añade un producto vinculándolo automáticamente a la carpeta public/comida.' }}
      </p>
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

        <div v-if="!isEditMode">
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
            Asegúrate de que la foto física esté guardada exactamente en la carpeta del cliente bajo: <code class="text-amber-500">public/comida/</code>
          </p>
        </div>

        <UAlert v-if="errorMsg" title="Error" :description="errorMsg" color="red" variant="soft" icon="i-heroicons-x-circle" />
        <UAlert v-if="successMsg" title="Éxito" :description="successMsg" color="green" variant="soft" icon="i-heroicons-check-circle" />

        <div class="flex justify-end gap-2 pt-2">
          <UButton color="gray" variant="ghost" to="/menu" :disabled="isLoading">Cancelar</UButton>
          <UButton type="submit" color="amber" variant="solid" :loading="isLoading" class="font-bold uppercase tracking-wider text-xs px-4">
            {{ isLoading ? 'Guardando...' : (isEditMode ? 'Actualizar Plato' : 'Crear Plato') }}
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>