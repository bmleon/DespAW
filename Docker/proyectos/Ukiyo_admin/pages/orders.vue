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

// --- TIPOS DE DATOS (alineados con lo que devuelve el backend) ---
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
  status: string       // valor real del backend: PENDIENTE, EN_PREPARACION, EN_REPARTO, ENTREGADO, CANCELADO
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

// Estados reales del backend, con su etiqueta en español para mostrar
const statusOptions = [
  { value: 'PENDIENTE', label: 'Pendiente', color: 'orange' },
  { value: 'EN_PREPARACION', label: 'En preparación', color: 'blue' },
  { value: 'EN_REPARTO', label: 'En reparto', color: 'purple' },
  { value: 'ENTREGADO', label: 'Entregado', color: 'green' },
  { value: 'CANCELADO', label: 'Cancelado', color: 'red' }
] as const

const getStatusInfo = (status: string) => {
  return statusOptions.find(s => s.value === status) || { value: status, label: status, color: 'gray' as const }
}

// --- CARGA DE DATOS REALES ---
const orders = ref<Order[]>([])
const pending = ref(false)
const loadError = ref('')

// Mapea un "pedido" tal como lo devuelve el backend (cliente_nombre, detalle_pedidos...)
// al formato Order que usa esta pantalla
const mapPedidoBackend = (p: any): Order => ({
  id: String(p.id),
  customer: p.cliente_nombre || 'Sin nombre',
  email: p.cliente_email || '',
  total: Number(p.total) || 0,
  status: p.estado_pedido || 'PENDIENTE',
  date: p.creado_en || new Date().toISOString(),
  items: (p.detalle_pedidos || []).map((d: any) => ({
    name: d.platos?.nombre || 'Plato eliminado',
    quantity: d.cantidad,
    price: Number(d.precio_unitario) || 0
  }))
})

const loadOrders = async () => {
  pending.value = true
  loadError.value = ''
  try {
    const data = await $fetch<any[]>(`${apiBase}/pedidos`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    orders.value = Array.isArray(data) ? data.map(mapPedidoBackend) : []
  } catch (err: any) {
    console.error('Error al cargar los pedidos:', err)
    loadError.value = 'No se pudieron cargar los pedidos. Comprueba tu conexión o que tu sesión de administrador siga activa.'
    orders.value = []
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
  const estadoAnterior = order.status
  order.status = newStatus // actualización optimista en la interfaz

  try {
    await $fetch(`${apiBase}/pedidos/${order.id}/estado`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: { estado: newStatus }
    })
  } catch (e: any) {
    console.error('Error al actualizar el estado del pedido:', e)
    order.status = estadoAnterior // revertimos si falla de verdad
    alert('No se pudo actualizar el estado del pedido. Inténtalo de nuevo.')
  }
}

const items = (row: Order) => [
  statusOptions.map(s => ({
    label: 'Marcar como ' + s.label,
    click: () => updateStatus(row, s.value)
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

    <UAlert v-if="loadError" :description="loadError" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

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
          :options="['Todos', ...statusOptions.map(s => s.value)]" 
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
          <span class="font-mono text-xs font-bold text-gray-700 dark:text-gray-300">#{{ row.id }}</span>
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
          <UBadge :color="getStatusInfo(row.status).color" variant="subtle" size="xs" class="font-semibold">
            {{ getStatusInfo(row.status).label }}
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
            <UBadge :color="getStatusInfo(selectedOrder.status).color" variant="solid">{{ getStatusInfo(selectedOrder.status).label }}</UBadge>
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