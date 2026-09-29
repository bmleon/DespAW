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
interface DetalleEvento {
  nombre: string
  cantidad: number
  precio: number
}

interface EventRequest {
  id: number
  contactName: string
  email: string
  phone: string
  guests: number
  eventDate: string
  status: string       // valor real del backend: SOLICITADO, APROBADO, RECHAZADO
  totalBudget: number
  notes: string
  detalles: DetalleEvento[]
}

const columns = [
  { key: 'id', label: 'ID Evento' },
  { key: 'contactName', label: 'Contacto', sortable: true },
  { key: 'eventDate', label: 'Fecha', sortable: true },
  { key: 'guests', label: 'Asistentes', sortable: true },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

// Estados reales del backend (estado_reserva), con etiqueta y color
const statusOptions = [
  { value: 'SOLICITADO', label: 'Solicitado', color: 'amber' },
  { value: 'APROBADO', label: 'Aprobado', color: 'green' },
  { value: 'RECHAZADO', label: 'Rechazado', color: 'red' }
] as const

const getStatusInfo = (status: string) => {
  return statusOptions.find(s => s.value === status) || { value: status, label: status, color: 'gray' as const }
}

// --- CARGA DE DATOS REALES ---
const events = ref<EventRequest[]>([])
const pending = ref(false)
const loadError = ref('')

const mapCateringBackend = (c: any): EventRequest => ({
  id: c.id,
  contactName: c.cliente_nombre || 'Sin nombre',
  email: c.cliente_email || '',
  phone: c.cliente_telefono || '',
  guests: c.numero_comensales || 0,
  eventDate: c.fecha_evento || new Date().toISOString(),
  status: c.estado_reserva || 'SOLICITADO',
  totalBudget: Number(c.presupuesto_estimado) || 0,
  notes: c.detalles_evento || '',
  detalles: (c.catering_detalles || []).map((d: any) => ({
    nombre: d.platos?.nombre || 'Plato eliminado',
    cantidad: d.cantidad_platos,
    precio: Number(d.precio_unitario_pactado) || 0
  }))
})

const loadEvents = async () => {
  pending.value = true
  loadError.value = ''
  try {
    const data = await $fetch<any[]>(`${apiBase}/pedidos/catering/todas`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    })
    events.value = Array.isArray(data) ? data.map(mapCateringBackend) : []
  } catch (err: any) {
    console.error('Error al cargar las solicitudes de catering:', err)
    loadError.value = 'No se pudieron cargar las solicitudes de eventos. Comprueba tu conexión o que tu sesión de administrador siga activa.'
    events.value = []
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadEvents()
})

// --- FILTROS ---
const search = ref('')
const statusFilter = ref('Todos')

const filteredEvents = computed(() => {
  if (!events.value) return []
  return events.value.filter(event => {
    const matchesSearch = (event.contactName || '').toLowerCase().includes(search.value.toLowerCase()) ||
                          String(event.id).includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'Todos' || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

// --- DETALLES DEL EVENTO (MODAL) ---
const isModalOpen = ref(false)
const selectedEvent = ref<EventRequest | null>(null)
const editingBudget = ref(0)
const isSavingBudget = ref(false)
const budgetError = ref('')

const openEventDetails = (event: EventRequest) => {
  selectedEvent.value = event
  editingBudget.value = event.totalBudget
  budgetError.value = ''
  isModalOpen.value = true
}

const saveBudget = async () => {
  if (!selectedEvent.value) return
  isSavingBudget.value = true
  budgetError.value = ''

  try {
    await $fetch(`${apiBase}/pedidos/catering/${selectedEvent.value.id}/presupuesto`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: { presupuesto: Number(editingBudget.value) }
    })
    selectedEvent.value.totalBudget = Number(editingBudget.value)
    const enTabla = events.value.find(e => e.id === selectedEvent.value!.id)
    if (enTabla) enTabla.totalBudget = Number(editingBudget.value)
  } catch (err: any) {
    console.error('Error al guardar el presupuesto:', err)
    budgetError.value = 'No se pudo guardar el presupuesto.'
  } finally {
    isSavingBudget.value = false
  }
}

// --- CAMBIAR ESTADO ---
const updateEventStatus = async (event: EventRequest, newStatus: string) => {
  const estadoAnterior = event.status
  event.status = newStatus // actualización optimista

  try {
    await $fetch(`${apiBase}/pedidos/catering/${event.id}/estado`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      },
      body: { estado: newStatus }
    })
  } catch (e) {
    console.error('Error al actualizar el estado del evento:', e)
    event.status = estadoAnterior
    alert('No se pudo actualizar el estado de la solicitud. Inténtalo de nuevo.')
  }
}

const items = (row: EventRequest) => [
  statusOptions.map(s => ({
    label: 'Marcar como ' + s.label,
    click: () => updateEventStatus(row, s.value)
  }))
]
</script>

<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Solicitudes de Eventos</h1>
        <p class="text-gray-500 text-sm">Gestión de reservas de grandes grupos y catering privado.</p>
      </div>
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="loadEvents" />
    </div>

    <UAlert v-if="loadError" :description="loadError" color="red" variant="soft" icon="i-heroicons-exclamation-triangle" class="mb-4" />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar contacto o ID..." class="flex-1" />
        <USelectMenu v-model="statusFilter" :options="['Todos', ...statusOptions.map(s => s.value)]" searchable class="w-full md:w-48" />
      </div>

      <UTable
        :columns="columns"
        :rows="filteredEvents"
        :loading="pending"
        class="w-full"
        :empty-state="{ icon: 'i-heroicons-calendar-days', label: 'No hay solicitudes de eventos todavía.' }"
      >
        <template #id-data="{ row }">
          <span class="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">#{{ row.id }}</span>
        </template>
        <template #contactName-data="{ row }">
          <div class="flex flex-col py-1">
            <span class="font-semibold text-gray-900 dark:text-white">{{ row.contactName }}</span>
            <span class="text-xs text-gray-400">{{ row.email }}</span>
          </div>
        </template>
        <template #eventDate-data="{ row }">
          <span class="text-sm font-medium">{{ new Date(row.eventDate).toLocaleDateString() }}</span>
        </template>
        <template #guests-data="{ row }">
          <UBadge color="gray" variant="solid" size="xs" class="font-mono">{{ row.guests }} Pers.</UBadge>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="getStatusInfo(row.status).color" variant="subtle" size="xs" class="font-semibold">
            {{ getStatusInfo(row.status).label }}
          </UBadge>
        </template>
        <template #actions-data="{ row }">
          <div class="flex items-center gap-1">
            <UButton icon="i-heroicons-eye" color="gray" variant="ghost" @click="openEventDetails(row)" />
            <UDropdown :items="items(row)">
              <UButton icon="i-heroicons-pencil-square" color="gray" variant="ghost" />
            </UDropdown>
          </div>
        </template>
      </UTable>
    </UCard>

    <UModal v-model="isModalOpen">
      <UCard v-if="selectedEvent">
        <template #header>
          <div class="flex justify-between items-center">
            <h3 class="font-black text-lg">Solicitud #{{ selectedEvent.id }}</h3>
            <UBadge :color="getStatusInfo(selectedEvent.status).color">{{ getStatusInfo(selectedEvent.status).label }}</UBadge>
          </div>
        </template>
        <div class="space-y-4 text-sm">
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
            <p><span class="font-bold">Contacto:</span> {{ selectedEvent.contactName }}</p>
            <p><span class="font-bold">Email:</span> {{ selectedEvent.email }}</p>
            <p><span class="font-bold">Teléfono:</span> {{ selectedEvent.phone }}</p>
            <p><span class="font-bold">Fecha del evento:</span> {{ new Date(selectedEvent.eventDate).toLocaleDateString() }}</p>
            <p><span class="font-bold">Asistentes:</span> {{ selectedEvent.guests }}</p>
          </div>

          <div>
            <span class="block font-bold uppercase text-xs text-gray-400 mb-1">Notas del cliente</span>
            <p class="p-3 bg-gray-100/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg italic text-gray-600 dark:text-gray-300">
              {{ selectedEvent.notes || 'Sin notas adicionales.' }}
            </p>
          </div>

          <div v-if="selectedEvent.detalles.length > 0">
            <span class="block font-bold uppercase text-xs text-gray-400 mb-2">Platos acordados</span>
            <div class="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800">
              <table class="w-full text-sm">
                <thead class="bg-gray-50 dark:bg-gray-800 text-left text-gray-400 font-bold text-xs uppercase">
                  <tr>
                    <th class="p-2">Cant.</th>
                    <th class="p-2">Plato</th>
                    <th class="p-2 text-right">Precio pactado</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                  <tr v-for="(d, i) in selectedEvent.detalles" :key="i">
                    <td class="p-2 font-bold text-primary-500">{{ d.cantidad }}x</td>
                    <td class="p-2">{{ d.nombre }}</td>
                    <td class="p-2 text-right font-mono">{{ d.precio.toFixed(2) }}€</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <p v-else class="text-xs text-gray-400 italic">
            El cliente todavía no ha seleccionado platos concretos; solo ha pedido presupuesto estimado.
          </p>

          <div>
            <span class="block font-bold uppercase text-xs text-gray-400 mb-2">Presupuesto cotizado</span>
            <div class="flex items-center gap-2">
              <UInput v-model="editingBudget" type="number" step="0.01" min="0" class="flex-1" />
              <UButton color="amber" :loading="isSavingBudget" @click="saveBudget">Guardar</UButton>
            </div>
            <p v-if="budgetError" class="text-red-500 text-xs mt-1">{{ budgetError }}</p>
            <p class="text-[11px] text-gray-400 mt-1 italic">
              Introduce el importe una vez hayas revisado la solicitud y decidido el precio del evento.
            </p>
          </div>
        </div>
        <template #footer>
          <div class="flex justify-end">
            <UButton color="gray" variant="ghost" @click="isModalOpen = false">Cerrar</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>