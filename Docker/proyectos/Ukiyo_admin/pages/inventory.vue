<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

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

// --- TIPOS (alineados con lo que realmente devuelve el backend) ---
interface InventoryItem {
  id: number
  itemName: string
  stock: number
  unit: string
  minStock: number
  status: 'correcto' | 'bajo stock' | 'agotado'
}

const columns = [
  { key: 'itemName', label: 'Insumo / Producto', sortable: true },
  { key: 'stock', label: 'Stock Actual' },
  { key: 'minStock', label: 'Stock Mínimo' },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

const getStatus = (stock: number, minStock: number): InventoryItem['status'] => {
  if (stock <= 0) return 'agotado'
  if (stock <= minStock) return 'bajo stock'
  return 'correcto'
}

const mapInsumoBackend = (i: any): InventoryItem => ({
  id: i.id,
  itemName: i.nombre || 'Sin nombre',
  stock: Number(i.stock_actual) || 0,
  unit: i.unidad_medida || 'unidades',
  minStock: Number(i.stock_minimo) || 0,
  status: getStatus(Number(i.stock_actual) || 0, Number(i.stock_minimo) || 0)
})

// --- CARGA DE DATOS REALES ---
const inventory = ref<InventoryItem[]>([])
const pending = ref(false)
const loadError = ref('')

const loadInventory = async () => {
  pending.value = true
  loadError.value = ''
  try {
    const data = await $fetch<any[]>(`${apiBase}/inventario/insumos`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    inventory.value = Array.isArray(data) ? data.map(mapInsumoBackend) : []
  } catch (err: any) {
    console.error('Error al cargar el inventario:', err)
    loadError.value = 'No se pudo cargar el inventario. Comprueba tu conexión o que tu sesión de administrador siga activa.'
    inventory.value = []
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadInventory()
})

// --- FILTRO DE BÚSQUEDA ---
const search = ref('')

const filteredInventory = computed(() => {
  if (!inventory.value) return []
  return inventory.value.filter(item =>
    item.itemName.toLowerCase().includes(search.value.toLowerCase())
  )
})

// --- ALTA DE NUEVO INSUMO ---
const isOpenModal = ref(false)
const isSaving = ref(false)
const saveError = ref('')

const nuevoInsumo = ref({
  nombre: '',
  stockActual: 0,
  stockMinimo: 1,
  unidadMedida: 'kg'
})

const unidadesDisponibles = ['kg', 'g', 'l', 'ml', 'unidades', 'paquetes', 'botellas']

const guardarNuevoInsumo = async () => {
  if (!nuevoInsumo.value.nombre) return
  isSaving.value = true
  saveError.value = ''

  try {
    await $fetch(`${apiBase}/inventario/insumos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: {
        nombre: nuevoInsumo.value.nombre.trim(),
        stockActual: Number(nuevoInsumo.value.stockActual),
        stockMinimo: Number(nuevoInsumo.value.stockMinimo),
        unidadMedida: nuevoInsumo.value.unidadMedida
      }
    })

    await loadInventory()
    nuevoInsumo.value = { nombre: '', stockActual: 0, stockMinimo: 1, unidadMedida: 'kg' }
    isOpenModal.value = false
  } catch (err: any) {
    console.error('Error al crear el insumo:', err)
    saveError.value = err.data?.message || 'No se pudo crear el insumo.'
  } finally {
    isSaving.value = false
  }
}

// --- ACTUALIZAR STOCK DE UN INSUMO ---
const editingId = ref<number | null>(null)
const editingStock = ref(0)

const startEditStock = (item: InventoryItem) => {
  editingId.value = item.id
  editingStock.value = item.stock
}

const cancelEditStock = () => {
  editingId.value = null
}

const saveStock = async (item: InventoryItem) => {
  try {
    await $fetch(`${apiBase}/inventario/insumos/${item.id}/stock`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: { stockActual: Number(editingStock.value) }
    })
    item.stock = Number(editingStock.value)
    item.status = getStatus(item.stock, item.minStock)
    editingId.value = null
  } catch (err: any) {
    console.error('Error al actualizar el stock:', err)
    alert('No se pudo actualizar el stock. Inténtalo de nuevo.')
  }
}
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Control de Inventario</h1>
        <p class="text-gray-500 text-sm">Supervisión de niveles de materias primas y alertas de stock mínimo.</p>
      </div>
      <div class="flex items-center gap-2">
        <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="loadInventory" />
        <UButton icon="i-heroicons-plus" color="amber" class="font-bold uppercase text-xs" @click="isOpenModal = true">
          Nuevo Insumo
        </UButton>
      </div>
    </div>

    <UAlert v-if="loadError" :description="loadError" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar materia prima..." class="flex-1" />
      </div>

      <UTable
        :columns="columns"
        :rows="filteredInventory"
        :loading="pending"
        class="w-full"
        :empty-state="{ icon: 'i-heroicons-archive-box', label: 'No hay insumos registrados todavía.' }"
      >
        <template #itemName-data="{ row }">
          <span class="font-bold text-gray-900 dark:text-white">{{ row.itemName }}</span>
        </template>

        <template #stock-data="{ row }">
          <div v-if="editingId === row.id" class="flex items-center gap-2">
            <UInput v-model="editingStock" type="number" step="0.01" size="xs" class="w-24" />
            <span class="text-xs text-gray-400">{{ row.unit }}</span>
          </div>
          <span v-else class="font-mono font-bold" :class="row.stock <= row.minStock ? 'text-red-500' : 'text-gray-900 dark:text-white'">
            {{ row.stock }} {{ row.unit }}
          </span>
        </template>

        <template #minStock-data="{ row }">
          <span class="text-gray-500 dark:text-gray-400 text-sm">{{ row.minStock }} {{ row.unit }}</span>
        </template>

        <template #status-data="{ row }">
          <UBadge
            :color="row.status === 'correcto' ? 'green' : row.status === 'bajo stock' ? 'orange' : 'red'"
            variant="subtle"
            size="xs"
            class="capitalize font-bold"
          >
            {{ row.status }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div v-if="editingId === row.id" class="flex items-center gap-1 justify-end">
            <UButton icon="i-heroicons-check" color="green" variant="ghost" size="xs" @click="saveStock(row)" />
            <UButton icon="i-heroicons-x-mark" color="gray" variant="ghost" size="xs" @click="cancelEditStock" />
          </div>
          <UButton v-else icon="i-heroicons-pencil-square" color="gray" variant="ghost" size="xs" label="Ajustar stock" @click="startEditStock(row)" />
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isOpenModal">
      <div class="p-6 space-y-6 bg-white dark:bg-gray-900 rounded-2xl">
        <div class="border-b border-gray-100 dark:border-gray-800 pb-3">
          <h3 class="text-xl font-black uppercase text-gray-900 dark:text-white tracking-tight">Nuevo Insumo</h3>
          <p class="text-xs text-gray-400 mt-1">Se registrará directamente en el inventario del restaurante</p>
        </div>

        <form @submit.prevent="guardarNuevoInsumo" class="space-y-4">
          <UFormGroup label="Nombre del Insumo" required>
            <UInput v-model="nuevoInsumo.nombre" placeholder="Ej: Lomo de Atún Rojo" icon="i-heroicons-cube" size="md" required />
          </UFormGroup>

          <div class="grid grid-cols-2 gap-4">
            <UFormGroup label="Stock Inicial" required>
              <UInput v-model="nuevoInsumo.stockActual" type="number" step="0.01" min="0" size="md" required />
            </UFormGroup>
            <UFormGroup label="Stock Mínimo" required>
              <UInput v-model="nuevoInsumo.stockMinimo" type="number" step="0.01" min="0" size="md" required />
            </UFormGroup>
          </div>

          <UFormGroup label="Unidad de Medida">
            <USelectMenu v-model="nuevoInsumo.unidadMedida" :options="unidadesDisponibles" size="md" />
          </UFormGroup>

          <UAlert v-if="saveError" :description="saveError" color="red" variant="soft" icon="i-heroicons-x-circle" />

          <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <UButton color="gray" variant="ghost" class="font-bold uppercase text-xs" @click="isOpenModal = false">Cancelar</UButton>
            <UButton type="submit" color="amber" variant="solid" class="font-bold uppercase text-xs px-4" :loading="isSaving">Guardar</UButton>
          </div>
        </form>
      </div>
    </UModal>
  </div>
</template>