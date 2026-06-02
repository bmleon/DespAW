<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface InventoryItem {
  id: string
  itemName: string
  category: string
  stock: number
  unit: string
  minStock: number
  supplier: string
  status: 'correcto' | 'bajo stock' | 'agotado'
}

const columns = [
  { key: 'itemName', label: 'Insumo / Producto', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'stock', label: 'Stock Actual' },
  { key: 'supplier', label: 'Proveedor' },
  { key: 'status', label: 'Estado' }
]

const mockInventory: InventoryItem[] = [
  { id: "INV-001", itemName: "Lomo de Atún Rojo Balfegó", category: "Materia Prima", stock: 14.5, unit: "kg", minStock: 5.0, supplier: "PescaMar S.A.", status: "correcto" },
  { id: "INV-002", itemName: "Alga Nori (Paquetes 50 ud)", category: "Materia Prima", stock: 3, unit: "paquetes", minStock: 8, supplier: "Tokyo Foods Import", status: "bajo stock" },
  { id: "INV-003", itemName: "Cerveza Asahi 33cl", category: "Bebidas", stock: 120, unit: "botellas", minStock: 48, supplier: "Estrella Galicia Distribución", status: "correcto" },
  { id: "INV-004", itemName: "Arroz para Sushi Koshihikari", category: "Materia Prima", stock: 0, unit: "kg", minStock: 25, supplier: "Tokyo Foods Import", status: "agotado" }
]

const inventory = ref<InventoryItem[]>([])
const pending = ref(false)

const loadInventory = async () => {
  pending.value = true
  try {
    const data = await $fetch<InventoryItem[]>('/api/inventory')
    if (data && Array.isArray(data) && data.length > 0) {
      inventory.value = data
    } else {
      inventory.value = [...mockInventory]
    }
  } catch (err) {
    console.warn('API de inventario desconectada. Montando panel estático de control...')
    inventory.value = [...mockInventory]
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadInventory()
})

const search = ref('')
const categoryFilter = ref('Todas')
const categories = ['Todas', 'Materia Prima', 'Bebidas', 'Limpieza']

const filteredInventory = computed(() => {
  if (!inventory.value) return []
  return inventory.value.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = categoryFilter.value === 'Todas' || item.category === categoryFilter.value
    return matchesSearch && matchesCategory
  })
})
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Control de Inventario</h1>
        <p class="text-gray-500 text-sm">Supervisión de niveles de materias primas y alertas de stock mínimo.</p>
      </div>
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="loadInventory" />
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar materia prima..." class="flex-1" />
        <USelectMenu v-model="categoryFilter" :options="categories" class="w-full md:w-48" />
      </div>

      <UTable :columns="columns" :rows="filteredInventory" :loading="pending" class="w-full">
        <template #itemName-data="{ row }">
          <span class="font-bold text-gray-900 dark:text-white">{{ row.itemName }}</span>
        </template>
        <template #stock-data="{ row }">
          <span class="font-mono font-bold" :class="row.stock <= row.minStock ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'">
            {{ row.stock }} {{ row.unit }}
          </span>
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
      </UTable>
    </UCard>
  </div>
</template>