<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// --- TIPOS DE DATOS ---
interface OrderItem {
  name: string
  quantity: number
  price: number
}

interface Order {
  id: string
  customer: string
  email: string
  total: number
  status: string
  date: string
  items: OrderItem[]
}

// --- CONFIGURACIÓN TABLA ---
const columns = [
  { key: 'id', label: 'ID Pedido' },
  { key: 'customer', label: 'Cliente', sortable: true },
  { key: 'date', label: 'Hora', sortable: true },
  { key: 'total', label: 'Total', sortable: true },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

// Estados posibles y sus colores
const statusOptions = ['Pendiente', 'En Cocina', 'Listo', 'Entregado', 'Cancelado']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'orange'
    case 'En Cocina': return 'blue'
    case 'Listo': return 'purple'
    case 'Entregado': return 'green'
    case 'Cancelado': return 'red'
    default: return 'gray'
  }
}

// --- MOCKS DE RESPALDO ---
const mockOrders: Order[] = [
  {
    id: "PED-2026-001",
    customer: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    total: 24.50,
    status: "En Cocina",
    date: "2026-06-02T10:15:00Z",
    items: [
      { name: "Gyozas de Carne (5 uds.)", quantity: 2, price: 4.80 },
      { name: "Ramen Tonkotsu Especial", quantity: 1, price: 14.90 }
    ]
  },
  {
    id: "PED-2026-002",
    customer: "Lucía Gómez",
    email: "lucia.g@email.com",
    total: 36.50,
    status: "Pendiente",
    date: "2026-06-02T09:45:00Z",
    items: [
      { name: "Takoyaki (5 uds.)", quantity: 1, price: 5.50 },
      { name: "Ukiyo Roll Premium (8 piezas)", quantity: 2, price: 15.50 }
    ]
  },
  {
    id: "PED-2026-003",
    customer: "Alejandro Silva",
    email: "alex.silva@email.com",
    total: 17.30,
    status: "Entregado",
    date: "2026-06-01T21:30:00Z",
    items: [
      { name: "Gyozas de Verduras (5 uds.)", quantity: 1, price: 4.50 },
      { name: "Poke de Salmón", quantity: 1, price: 12.80 }
    ]
  }
]

// --- CARGA DE DATOS REALES ---
const orders = ref<Order[]>([])
const pending = ref(false)

const loadOrders = async () => {
  pending.value = true
  try {
    const data = await $fetch<Order[]>('/api/order')
    if (data && Array.isArray(data) && data.length > 0) {
      orders.value = data
    } else {
      orders.value = [...mockOrders]
    }
  } catch (err) {
    console.warn('Cargando pasarela de mocks por desconexión del servidor...')
    orders.value = [...mockOrders]
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadOrders()
})

// --- FILTROS ---
const search = ref('')
const statusFilter = ref('Todos')

const filteredOrders = computed(() => {
  if (!orders.value) return []
  
  return orders.value.filter(order => {
    const matchesSearch = (order.customer || '').toLowerCase().includes(search.value.toLowerCase()) || 
                          (order.id || '').toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'Todos' || order.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

// --- DETALLES DEL PEDIDO (MODAL) ---
const isModalOpen = ref(false)
const selectedOrder = ref<Order | null>(null)

const openOrderDetails = (order: Order) => {
  selectedOrder.value = order
  isModalOpen.value = true
}

// --- CAMBIAR ESTADO ---
const updateStatus = async (order: Order, newStatus: string) => {
  order.status = newStatus 

  try {
    await $fetch('/api/order', {
      method: 'PUT' as any,
      body: { id: order.id, status: newStatus }
    })
  } catch (e: any) {
    console.warn('Estado modificado localmente.')
  }
}

const items = (row: Order) => [
  statusOptions.map(status => ({
    label: 'Marcar como ' + status,
    click: () => updateStatus(row, status)
  }))
]
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Pedidos en Curso</h1>
        <p class="text-gray-500 text-sm">Control de comandas de delivery y recogida en local.</p>
      </div>
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="gray" 
        variant="ghost" 
        :loading="pending" 
        @click="loadOrders"
      >
        Actualizar
      </UButton>
    </div>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar por cliente o ID..." 
          class="flex-1"
        />
        <USelectMenu 
          v-model="statusFilter" 
          :options="['Todos', ...statusOptions]" 
          searchable
          searchable-placeholder="Filtrar estado..."
          class="w-full md:w-52" 
        />
      </div>

      <UTable 
        :columns="columns" 
        :rows="filteredOrders" 
        :loading="pending"
        class="w-full"
        :empty-state="{ icon: 'i-heroicons-shopping-bag', label: 'No hay pedidos con este criterio.' }"
      >
        <template #id-data="{ row }">
          <span class="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">{{ row.id }}</span>
        </template>

        <template #customer-data="{ row }">
          <div class="flex flex-col py-1">
            <span class="font-semibold text-gray-900 dark:text-white">{{ row.customer }}</span>
            <span class="text-xs text-gray-400 dark:text-gray-500">{{ row.email }}</span>
          </div>
        </template>

        <template #total-data="{ row }">
          <span class="font-mono font-bold text-gray-900 dark:text-white">{{ Number(row.total).toFixed(2) }}€</span>
        </template>

        <template #date-data="{ row }">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {{ row.date ? new Date(row.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '--:--' }}
          </span>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="subtle" size="xs" class="font-semibold">
            {{ row.status }}
          </UBadge>
        </template>

        <template #actions-data="{ row }">
          <div class="flex items-center gap-1">
            <UTooltip text="Ver Ticket Completo">
              <UButton icon="i-heroicons-eye" color="gray" variant="ghost" @click="openOrderDetails(row)" />
            </UTooltip>
            <UDropdown :items="items(row)">
              <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" />
            </UDropdown>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard v-if="selectedOrder" :ui="{ divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-black text-lg text-gray-900 dark:text-white">Ticket #{{ selectedOrder.id }}</h3>
            <UBadge :color="getStatusColor(selectedOrder.status)" variant="solid">{{ selectedOrder.status }}</UBadge>
          </div>
        </template>

        <div class="space-y-5 py-2">
          <div class="p-3.5 bg-gray-50 dark:bg-gray-800/60 rounded-xl text-sm border border-gray-100 dark:border-gray-800 space-y-1">
            <p class="text-gray-700 dark:text-gray-300"><span class="font-bold text-gray-900 dark:text-white">Cliente:</span> {{ selectedOrder.customer }}</p>
            <p class="text-gray-700 dark:text-gray-300"><span class="font-bold text-gray-900 dark:text-white">Email:</span> {{ selectedOrder.email }}</p>
            <p class="text-gray-700 dark:text-gray-300"><span class="font-bold text-gray-900 dark:text-white">Fecha de Solicitud:</span> {{ new Date(selectedOrder.date).toLocaleString() }}</p>
          </div>

          <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
            <table class="w-full text-sm">
              <thead class="bg-gray-50 dark:bg-gray-800 text-left text-gray-400 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th class="py-2.5 px-3">Cant.</th>
                  <th class="py-2.5 px-3">Producto</th>
                  <th class="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900/40">
                <tr v-for="(item, i) in (selectedOrder.items || [])" :key="i" class="text-gray-700 dark:text-gray-300">
                  <td class="py-3 px-3 font-extrabold text-primary-500 dark:text-primary-400">{{ item.quantity }}x</td>
                  <td class="py-3 px-3 font-medium">{{ item.name }}</td>
                  <td class="py-3 px-3 text-right font-mono font-bold text-gray-900 dark:text-white">{{ (item.price * item.quantity).toFixed(2) }}€</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="flex justify-between items-center pt-2 text-xl font-black text-gray-900 dark:text-white tracking-tight">
            <span>TOTAL FACTURADO</span>
            <span class="font-mono text-2xl">{{ Number(selectedOrder.total).toFixed(2) }}€</span>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">Cerrar</UButton>
            <UButton icon="i-heroicons-printer" color="primary" class="font-bold uppercase text-xs" @click="isModalOpen = false">Imprimir Ticket</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>