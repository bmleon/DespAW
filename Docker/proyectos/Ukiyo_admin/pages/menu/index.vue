<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiProductRepository } from '~/modules/products/infrastructure/api-product.repository'
import { GetProductsUseCase } from '~/modules/products/application/get-products.usecase'
import type { Product } from '~/modules/products/domain/product.model'

// Columnas de la tabla nativa de Nuxt UI
const columns = [
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'category', label: 'Categoría', sortable: true },
  { key: 'price', label: 'Precio', sortable: true },
  { key: 'available', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

// Instanciación de la Arquitectura Hexagonal
const productRepository = new ApiProductRepository()
const getProductsUseCase = new GetProductsUseCase(productRepository)

// Estados reactivos
const dbDishes = ref<Product[]>([])
const pending = ref(false)
const errorMsg = ref('')

const search = ref('')
const selectedCategory = ref('Todas')
const categories = ['Todas', 'Sushi', 'Nigiri', 'Calientes', 'Postres', 'Bebidas']

// Carga de datos aislada a través del caso de uso
const loadDishes = async () => {
  pending.value = true
  errorMsg.value = ''
  try {
    dbDishes.value = await getProductsUseCase.execute()
  } catch (err: any) {
    errorMsg.value = err.message || 'No se pudieron cargar los productos.'
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadDishes()
})

// Lógica de filtrado reactivo local
const filteredDishes = computed(() => {
  if (!dbDishes.value) return []
  return dbDishes.value.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesCategory = selectedCategory.value === 'Todas' || dish.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Acción de borrar real conectada al repositorio sin necesidad del programador
const deleteDish = async (id: string | undefined) => {
  if (!id) return
  if (confirm('⚠️ ¿Seguro que deseas eliminar este plato definitivamente de la carta? El usuario no volverá a verlo.')) {
    try {
      await productRepository.delete(id)
      await loadDishes() // Recarga automática de la lista
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el producto.')
    }
  }
}

// Configuración de las acciones por cada fila
const items = (row: Product) => [
  [{
    label: 'Editar',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => console.log('Editar', row.id)
  }, {
    label: 'Borrar',
    icon: 'i-heroicons-trash-20-solid',
    class: 'text-red-500',
    click: () => deleteDish(row.id)
  }]
]
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de la Carta</h1>
        <p class="text-gray-500 text-sm">Administra los productos visibles en la web.</p>
      </div>
      
      <div class="flex gap-2 w-full sm:w-auto justify-end">
        <UButton 
          icon="i-heroicons-arrow-path" 
          color="gray" 
          variant="ghost" 
          :loading="pending" 
          @click="loadDishes"
        >
          Recargar
        </UButton>
        
        <UButton icon="i-heroicons-plus" color="primary" variant="solid" to="/menu/new">
          Nuevo Plato
        </UButton>
      </div>
    </div>

    <UAlert 
      v-if="errorMsg"
      title="Error de Conexión"
      :description="errorMsg"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar plato..." 
          class="flex-1"
        />
        <USelect 
          v-model="selectedCategory" 
          :options="categories" 
          class="w-full md:w-48" 
        />
      </div>

      <UTable 
        :columns="columns" 
        :rows="filteredDishes" 
        :loading="pending"
        class="w-full overflow-x-auto"
        :empty-state="{ icon: 'i-heroicons-circle-stack', label: 'No hay platos registrados.' }"
      >
        <template #name-data="{ row }">
          <span class="font-bold text-gray-900 dark:text-white text-base">{{ row.name }}</span>
        </template>

        <template #price-data="{ row }">
          <span class="font-mono font-bold text-gray-900 dark:text-white">{{ Number(row.price).toFixed(2) }}€</span>
        </template>

        <template #available-data="{ row }">
          <UBadge :color="row.available !== false ? 'green' : 'gray'" variant="subtle" size="xs">
            {{ row.available !== false ? 'Activo' : 'Inactivo' }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <ClientOnly>
            <UDropdown :items="items(row)">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
            </UDropdown>
            <template #fallback>
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" disabled class="opacity-50" />
            </template>
          </ClientOnly>
        </template>
      </UTable>
    </UCard>
  </div>
</template>