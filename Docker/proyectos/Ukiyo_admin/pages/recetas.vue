<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const apiBase = config.public.apiBase as string

const getToken = (): string | null => {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem('user_session')
  if (!raw) return null
  try {
    const session = JSON.parse(raw)
    return session?.token || null
  } catch {
    return null
  }
}

// --- CARGA DE PLATOS E INSUMOS DISPONIBLES ---
interface PlatoBackend { id: number; nombre: string }
interface InsumoBackend { id: number; nombre: string; unidad_medida: string }

const platos = ref<PlatoBackend[]>([])
const insumos = ref<InsumoBackend[]>([])
const isLoadingListas = ref(false)
const loadError = ref('')

const cargarListas = async () => {
  isLoadingListas.value = true
  loadError.value = ''
  try {
    const [platosData, insumosData] = await Promise.all([
      $fetch<PlatoBackend[]>(`${apiBase}/carta/platos`),
      $fetch<InsumoBackend[]>(`${apiBase}/inventario/insumos`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
      })
    ])
    platos.value = platosData
    insumos.value = insumosData
  } catch (err) {
    console.error('Error al cargar platos o insumos:', err)
    loadError.value = 'No se pudieron cargar los platos o el inventario.'
  } finally {
    isLoadingListas.value = false
  }
}

onMounted(() => {
  cargarListas()
})

// --- SELECCIÓN DE PLATO Y CARGA DE SU RECETA ACTUAL ---
const selectedPlato = ref<PlatoBackend | undefined>(undefined)

interface LineaIngrediente {
  insumo: InsumoBackend | undefined
  cantidadNecesaria: number
}

const lineas = ref<LineaIngrediente[]>([])
const isLoadingReceta = ref(false)
const sinRecetaPrevia = ref(false)

const cargarRecetaDelPlato = async (platoId: number) => {
  isLoadingReceta.value = true
  sinRecetaPrevia.value = false
  lineas.value = []

  try {
    const data = await $fetch<any[]>(`${apiBase}/inventario/recetas/plato/${platoId}`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    })
    lineas.value = data.map(item => ({
      insumo: insumos.value.find(i => i.id === item.insumo_id) || undefined,
      cantidadNecesaria: Number(item.cantidad_necesaria)
    }))
  } catch (err: any) {
    // El backend devuelve 404 si el plato todavía no tiene receta asignada — no es un error real
    if (err?.response?.status === 404 || err?.statusCode === 404) {
      sinRecetaPrevia.value = true
      lineas.value = []
    } else {
      console.error('Error al cargar la receta del plato:', err)
      loadError.value = 'No se pudo cargar la receta de este plato.'
    }
  } finally {
    isLoadingReceta.value = false
  }
}

watch(selectedPlato, (nuevo) => {
  if (nuevo) {
    cargarRecetaDelPlato(nuevo.id)
  } else {
    lineas.value = []
  }
})

// --- EDITAR LÍNEAS DE LA RECETA ---
const añadirLinea = () => {
  lineas.value.push({ insumo: undefined, cantidadNecesaria: 0 })
}

const quitarLinea = (index: number) => {
  lineas.value.splice(index, 1)
}

const lineasValidas = computed(() =>
  lineas.value.filter(l => l.insumo !== undefined && l.cantidadNecesaria > 0)
)

// --- GUARDAR RECETA COMPLETA ---
const isSaving = ref(false)
const saveError = ref('')
const saveSuccess = ref('')

const guardarReceta = async () => {
  if (!selectedPlato.value) return
  if (lineasValidas.value.length === 0) {
    saveError.value = 'Añade al menos un ingrediente con cantidad antes de guardar.'
    return
  }

  isSaving.value = true
  saveError.value = ''
  saveSuccess.value = ''

  try {
    await $fetch(`${apiBase}/inventario/recetas`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: {
        platoId: selectedPlato.value.id,
        ingredientes: lineasValidas.value.map(l => ({
          insumoId: l.insumo!.id,
          cantidadNecesaria: Number(l.cantidadNecesaria)
        }))
      }
    })
    saveSuccess.value = '¡Receta guardada! El stock se descontará automáticamente con cada venta de este plato.'
    sinRecetaPrevia.value = false
    setTimeout(() => { saveSuccess.value = '' }, 4000)
  } catch (err: any) {
    console.error('Error al guardar la receta:', err)
    saveError.value = err.data?.message || 'No se pudo guardar la receta.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto pt-6 pb-12 px-4">
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Recetas de Platos</h1>
      <p class="text-gray-500 text-sm">Asocia los insumos del inventario a cada plato para que el stock se descuente automáticamente con cada venta.</p>
    </div>

    <UAlert v-if="loadError" :description="loadError" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

    <UCard class="mb-6">
      <UFormGroup label="Selecciona un plato" required>
        <USelectMenu
          v-model="selectedPlato"
          :options="platos"
          option-attribute="nombre"
          placeholder="Elige el plato a configurar"
          searchable
          searchable-placeholder="Buscar plato..."
          :loading="isLoadingListas"
          class="w-full"
        />
      </UFormGroup>
    </UCard>

    <UCard v-if="selectedPlato">
      <template #header>
        <div class="flex justify-between items-center">
          <h3 class="font-bold text-gray-900 dark:text-white">Ingredientes de "{{ selectedPlato.nombre }}"</h3>
          <UButton icon="i-heroicons-plus" size="xs" color="gray" variant="ghost" @click="añadirLinea">Añadir ingrediente</UButton>
        </div>
      </template>

      <div v-if="isLoadingReceta" class="text-center py-6 text-gray-400">
        Cargando receta actual...
      </div>

      <div v-else>
        <p v-if="sinRecetaPrevia" class="text-xs text-amber-500 mb-4 italic">
          Este plato todavía no tiene receta asignada. Añade sus ingredientes y guarda para crearla.
        </p>

        <div v-if="lineas.length === 0" class="text-center py-6 text-gray-400">
          No hay ingredientes todavía. Pulsa "Añadir ingrediente" para empezar.
        </div>

        <div v-for="(linea, index) in lineas" :key="index" class="flex items-end gap-3 mb-3">
          <div class="flex-1">
            <label class="block text-xs font-bold uppercase text-gray-400 mb-1">Insumo</label>
            <USelectMenu
              v-model="linea.insumo"
              :options="insumos"
              option-attribute="nombre"
              placeholder="Selecciona un insumo"
              searchable
              searchable-placeholder="Buscar insumo..."
              class="w-full"
            />
          </div>
          <div class="w-36">
            <label class="block text-xs font-bold uppercase text-gray-400 mb-1">
              Cantidad {{ linea.insumo ? `(${linea.insumo.unidad_medida})` : '' }}
            </label>
            <UInput v-model="linea.cantidadNecesaria" type="number" step="0.01" min="0" />
          </div>
          <UButton icon="i-heroicons-trash" color="red" variant="ghost" @click="quitarLinea(index)" />
        </div>

        <UAlert v-if="saveError" :description="saveError" color="red" variant="soft" icon="i-heroicons-x-circle" class="mt-4" />
        <UAlert v-if="saveSuccess" :description="saveSuccess" color="green" variant="soft" icon="i-heroicons-check-circle" class="mt-4" />

        <div class="flex justify-end pt-4 mt-4 border-t border-gray-100 dark:border-gray-800">
          <UButton color="amber" class="font-bold uppercase text-xs px-6" :loading="isSaving" @click="guardarReceta">
            Guardar Receta
          </UButton>
        </div>
      </div>
    </UCard>
  </div>
</template>