<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const route = useRoute()
const isEditMode = ref(false)
const productId = ref('')

// Estados del formulario
const name = ref('')
const price = ref(0)
const descripcion = ref('')
const extensionImagen = ref('.jpg')
const disponible = ref(true)

const isLoading = ref(false)
const isLoadingCategorias = ref(false)
const errorMsg = ref('')
const successMsg = ref('')

// Categorías reales, cargadas desde el backend (GET /carta/categorias),
// ya que "categoriaId" tiene que ser el ID numérico real de una categoría existente.
interface CategoriaBackend { id: number; nombre: string }
const categoriasBackend = ref<CategoriaBackend[]>([])
const selectedCategoria = ref<CategoriaBackend | undefined>(undefined)

const cargarCategorias = async () => {
  isLoadingCategorias.value = true
  try {
    const data = await $fetch<CategoriaBackend[]>(`${apiBase}/carta/categorias`)
    categoriasBackend.value = data
    if (data.length > 0 && !selectedCategoria.value) {
      selectedCategoria.value = data[0]
    }
  } catch (err) {
    console.error('Error al cargar las categorías:', err)
    errorMsg.value = 'No se pudieron cargar las categorías de la carta.'
  } finally {
    isLoadingCategorias.value = false
  }
}

// Helper para obtener el token guardado tras el login del panel
const getToken = () => {
  return useCookie('auth_token').value || (typeof window !== 'undefined' ? localStorage.getItem('token') : null)
}

// DETECTOR DE MODO: Si viene un ?id= en la URL, precargamos el plato
onMounted(async () => {
  await cargarCategorias()

  if (route.query.id) {
    isEditMode.value = true
    productId.value = String(route.query.id)
    isLoading.value = true

    try {
      console.log(`🔍 Cargando datos del plato ${productId.value} para editar...`)
      const plato = await $fetch<any>(`${apiBase}/carta/platos/${productId.value}`)

      if (plato) {
        name.value = plato.nombre || ''
        price.value = Number(plato.precio) || 0
        descripcion.value = plato.descripcion || ''
        disponible.value = plato.disponible !== false

        // Sincronizamos el selector con la categoría real del plato
        const catEncontrada = categoriasBackend.value.find(c => c.id === plato.categoria_id)
        if (catEncontrada) {
          selectedCategoria.value = catEncontrada
        }
      }
    } catch (err) {
      console.error('Error al cargar el plato para edición:', err)
      errorMsg.value = 'No se pudieron precargar los datos del plato.'
    } finally {
      isLoading.value = false
    }
  }
})

const handleGuardarPlato = async () => {
  if (!name.value || price.value < 0 || !descripcion.value || !selectedCategoria.value) {
    errorMsg.value = 'Por favor, rellena los campos obligatorios (nombre, precio, descripción y categoría).'
    return
  }

  isLoading.value = true
  errorMsg.value = ''
  successMsg.value = ''

  try {
    // Ruta de la imagen física (se guarda en el campo "imagen", no en "descripcion")
    const nombreNormalizado = name.value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    const rutaImagenFinal = `/comida/${nombreNormalizado}${extensionImagen.value}`

    const bodyPayload = {
      nombre: name.value.trim(),
      descripcion: descripcion.value.trim(),
      precio: Number(price.value),
      imagen: rutaImagenFinal,
      disponible: disponible.value,
      categoriaId: selectedCategoria.value!.id
    }

    // El backend usa PUT (no PATCH) para actualizar un plato
    const urlApi = isEditMode.value
      ? `${apiBase}/carta/platos/${productId.value}`
      : `${apiBase}/carta/platos`

    const metodoHttp = isEditMode.value ? 'PUT' : 'POST'

    console.log(`📦 Enviando ${metodoHttp} al backend:`, bodyPayload)

    await $fetch(urlApi, {
      method: metodoHttp,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${getToken()}`
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
    console.error('Error crítico en la operación del plato:', err)
    errorMsg.value = err.data?.message || 'El servidor rechazó la operación. Verifica los campos.'
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
        {{ isEditMode ? 'Modifica las propiedades del plato en tiempo real.' : 'Añade un plato vinculándolo automáticamente a la carpeta public/comida.' }}
      </p>
    </div>

    <UCard>
      <form @submit.prevent="handleGuardarPlato" class="space-y-5 p-2">

        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Nombre del Plato *</label>
          <UInput v-model="name" placeholder="Ej: Ensalada Wakame" required class="w-full" />
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Descripción *</label>
          <UTextarea v-model="descripcion" placeholder="Ej: Ensalada fresca de algas wakame con aliño de sésamo tostado" required class="w-full" />
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Precio (€) *</label>
            <UInput v-model="price" type="number" step="0.01" min="0" required class="w-full" />
          </div>
          <div>
            <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Categoría *</label>
            <USelectMenu
              v-model="selectedCategoria"
              :options="categoriasBackend"
              option-attribute="nombre"
              placeholder="Selecciona la categoría"
              searchable
              searchable-placeholder="Buscar categoría..."
              :loading="isLoadingCategorias"
              class="w-full"
            />
            <p v-if="!isLoadingCategorias && categoriasBackend.length === 0" class="text-red-400 text-[11px] mt-2">
              No hay categorías creadas todavía en la carta. Crea una desde "Categorías" antes de añadir platos.
            </p>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold uppercase text-gray-400 mb-2">Disponible</label>
          <UToggle v-model="disponible" color="amber" />
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