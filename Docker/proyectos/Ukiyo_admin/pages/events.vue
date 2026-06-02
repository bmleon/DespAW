<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface EventRequest {
  id: string
  contactName: string
  email: string
  phone: string
  eventType: string
  guests: number
  eventDate: string
  status: string
  totalBudget: number
  notes: string
}

// Columnas de la tabla
const columns = [
  { key: 'id', label: 'ID Evento' },
  { key: 'contactName', label: 'Contacto / Empresa', sortable: true },
  { key: 'eventDate', label: 'Fecha', sortable: true },
  { key: 'guests', label: 'Asistentes', sortable: true },
  { key: 'status', label: 'Estado' },
  { key: 'actions', label: 'Acciones' }
]

const statusOptions = ['Pendiente', 'Aprobado', 'Rechazado']

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pendiente': return 'amber'
    case 'Aprobado': return 'green'
    case 'Rechazado': return 'red'
    default: return 'gray'
  }
}

// Mocks estables de salvaguarda
const mockEvents: EventRequest[] = [
  {
    id: "EVT-8841",
    contactName: "Marta Rovira (TechSolutions)",
    email: "marta.rovira@techsolutions.com",
    phone: "+34 655 443 322",
    eventType: "Cena de Empresa",
    guests: 25,
    eventDate: "2026-06-18",
    status: "Pendiente",
    totalBudget: 850.00,
    notes: "Solicitan menú cerrado con opciones vegetarianas e intolerancia a frutos secos."
  },
  {
    id: "EVT-8842",
    contactName: "Javier Ortiz",
    email: "javi.ortiz@gmail.com",
    phone: "+34 622 334 455",
    eventType: "Cumpleaños privado",
    guests: 12,
    eventDate: "2026-06-25",
    status: "Aprobado",
    totalBudget: 420.00,
    notes: "Quieren barra libre de sushi durante las dos primeras horas del evento."
  },
  {
    id: "EVT-8843",
    contactName: "Elena Pastor",
    email: "elena.pastor@outlook.com",
    phone: "+34 699 001 122",
    eventType: "Catering Particular",
    guests: 50,
    eventDate: "2026-07-04",
    status: "Rechazado",
    totalBudget: 1800.00,
    notes: "Rechazado automáticamente por falta de disponibilidad de espacio en cocina."
  }
]

const events = ref<EventRequest[]>([])
const pending = ref(false)

const loadEvents = async () => {
  pending.value = true
  try {
    const data = await $fetch<EventRequest[]>('/api/events')
    if (data && Array.isArray(data) && data.length > 0) {
      events.value = data
    } else {
      events.value = [...mockEvents]
    }
  } catch (err) {
    console.warn('API de eventos no disponible. Cargando mocks de respaldo local...')
    events.value = [...mockEvents]
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadEvents()
})

const search = ref('')
const statusFilter = ref('Todos')

const filteredEvents = computed(() => {
  if (!events.value) return []
  return events.value.filter(event => {
    const matchesSearch = (event.contactName || '').toLowerCase().includes(search.value.toLowerCase()) || 
                          (event.id || '').toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'Todos' || event.status === statusFilter.value
    return matchesSearch && matchesStatus
  })
})

const isModalOpen = ref(false)
const selectedEvent = ref<EventRequest | null>(null)

const openEventDetails = (event: EventRequest) => {
  selectedEvent.value = event
  isModalOpen.value = true
}

const updateEventStatus = async (event: EventRequest, newStatus: string) => {
  event.status = newStatus
  try {
    // 🌟 Corregido el tipado 'as any' para evitar conflictos con TypeScript y Nuxt 3
    await $fetch('/api/events', {
      method: 'PUT' as any,
      body: { id: event.id, status: newStatus }
    })
  } catch (e) {
    console.warn('Cambio guardado localmente (Backend desconectado).')
  }
}

const items = (row: EventRequest) => [
  statusOptions.map(status => ({
    label: 'Marcar como ' + status,
    click: () => updateEventStatus(row, status)
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

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <div class="flex flex-col md:flex-row gap-4 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar contacto o ID..." class="flex-1" />
        <USelectMenu v-model="statusFilter" :options="['Todos', ...statusOptions]" searchable class="w-full md:w-48" />
      </div>

      <UTable :columns="columns" :rows="filteredEvents" :loading="pending" class="w-full">
        <template #id-data="{ row }">
          <span class="font-mono text-xs font-bold text-gray-600 dark:text-gray-400">{{ row.id }}</span>
        </template>
        <template #contactName-data="{ row }">
          <div class="flex flex-col py-1">
            <span class="font-semibold text-gray-900 dark:text-white">{{ row.contactName }}</span>
            <span class="text-xs text-gray-400">{{ row.eventType }}</span>
          </div>
        </template>
        <template #eventDate-data="{ row }">
          <span class="text-sm font-medium">{{ new Date(row.eventDate).toLocaleDateString() }}</span>
        </template>
        <template #guests-data="{ row }">
          <UBadge color="gray" variant="solid" size="xs" class="font-mono">{{ row.guests }} Pers.</UBadge>
        </template>
        <template #status-data="{ row }">
          <UBadge :color="getStatusColor(row.status)" variant="subtle" size="xs" class="font-semibold">
            {{ row.status }}
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
            <h3 class="font-black text-lg">Reserva #{{ selectedEvent.id }}</h3>
            <UBadge :color="getStatusColor(selectedEvent.status)">{{ selectedEvent.status }}</UBadge>
          </div>
        </template>
        <div class="space-y-4 text-sm">
          <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2">
            <p><span class="font-bold">Contacto:</span> {{ selectedEvent.contactName }}</p>
            <p><span class="font-bold">Email:</span> {{ selectedEvent.email }}</p>
            <p><span class="font-bold">Teléfono:</span> {{ selectedEvent.phone }}</p>
            <p><span class="font-bold">Tipo de Evento:</span> {{ selectedEvent.eventType }}</p>
            <p><span class="font-bold">Presupuesto Estimado:</span> <span class="font-mono font-bold text-green-500">{{ selectedEvent.totalBudget.toFixed(2) }}€</span></p>
          </div>
          <div>
            <span class="block font-bold uppercase text-xs text-gray-400 mb-1">Notas especiales</span>
            <p class="p-3 bg-gray-100/50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg italic text-gray-600 dark:text-gray-300">
              "{{ selectedEvent.notes }}"
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