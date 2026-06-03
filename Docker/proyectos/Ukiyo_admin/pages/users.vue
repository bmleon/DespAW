<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'
import { GetUsersUseCase } from '~/modules/users/application/get-users.usecase'
import { UpdateUserRoleUseCase } from '~/modules/users/application/update-user-role.usecase'
import { DeleteUserUseCase } from '~/modules/users/application/delete-user.usecase'
import type { User } from '~/modules/users/domain/user.model'

// Configuración de columnas con anchos explícitos para evitar que el ID se corte en PC
const columns = [
  { key: 'avatar', label: 'Usuario', class: 'w-[180px]' },
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'actions', label: 'Acciones', class: 'w-[80px]' }
]

const userRepository = new ApiUserRepository()
const getUsersUseCase = new GetUsersUseCase(userRepository)
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository)
const deleteUserUseCase = new DeleteUserUseCase(userRepository)

const rawUsers = ref<User[]>([])
const pending = ref(false)
const errorMsg = ref('')
const search = ref('')

const getUserId = (user: User): string => user?.id || 'N/A'

const loadUsers = async () => {
  pending.value = true
  errorMsg.value = ''
  try {
    const data = await getUsersUseCase.execute()
    rawUsers.value = Array.isArray(data) ? data : []
  } catch (err: any) {
    errorMsg.value = err.message || 'No se pudieron recuperar los usuarios.'
    rawUsers.value = []
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadUsers()
})

const filteredUsers = computed(() => {
  if (!rawUsers.value) return []
  const query = search.value.toLowerCase()
  return rawUsers.value.filter((user) => {
    const name = (user.name || '').toLowerCase()
    const email = (user.email || '').toLowerCase()
    return name.includes(query) || email.includes(query)
  })
})

const handleToggleRole = async (user: User) => {
  try {
    await updateUserRoleUseCase.execute(getUserId(user), user.role)
    await loadUsers() 
  } catch (err: any) {
    alert(err.message || 'Error al cambiar el rol.')
  }
}

const handleDeleteUser = async (user: User) => {
  if (confirm('⚠️ ¿Seguro que deseas eliminar a este usuario?')) {
    try {
      await deleteUserUseCase.execute(getUserId(user))
      await loadUsers()
    } catch (err: any) {
      alert(err.message || 'Error al dar de baja.')
    }
  }
}

const items = (row: User) => [
  [{
    label: row.role === 'admin' ? 'Quitar Administrador' : 'Hacer Administrador',
    icon: 'i-heroicons-shield-check',
    click: () => handleToggleRole(row)
  }],
  [{
    label: 'Eliminar Usuario',
    icon: 'i-heroicons-user-minus',
    class: 'text-red-500',
    click: () => handleDeleteUser(row)
  }]
]
</script>

<template>
  <div class="px-4 py-6 md:px-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <p class="text-gray-500 text-sm">Administra las cuentas registradas en la plataforma.</p>
      </div>
      <UButton
        icon="i-heroicons-arrow-path"
        color="gray"
        variant="solid"
        :loading="pending"
        @click="loadUsers"
      >
        Recargar datos
      </UButton>
    </div>

    <UAlert 
      v-if="errorMsg"
      title="Error"
      :description="errorMsg"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" class="overflow-hidden">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar por nombre o email..." 
          class="w-full"
        />
      </div>

      <div v-if="!pending && filteredUsers.length > 0" class="block md:hidden divide-y divide-gray-100 dark:divide-gray-800">
        <div 
          v-for="user in filteredUsers" 
          :key="user.id" 
          class="p-4 flex flex-col gap-3 bg-white dark:bg-ukiyo-nav"
        >
          <div class="flex items-start justify-between gap-2">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                <UIcon name="i-heroicons-user-circle" class="w-7 h-7" />
              </div>
              <div class="min-w-0">
                <h3 class="font-bold text-gray-900 dark:text-white text-base truncate">{{ user.name || 'Sin nombre' }}</h3>
                <span class="text-xs font-mono text-gray-400 block mt-0.5 break-all">ID: {{ user.id }}</span>
              </div>
            </div>
            
            <ClientOnly>
              <UDropdown :items="items(user)">
                <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
              </UDropdown>
            </ClientOnly>
          </div>

          <div class="grid grid-cols-2 gap-4 pt-2 border-t border-gray-50 dark:border-gray-800/50 text-xs">
            <div class="min-w-0">
              <span class="text-gray-400 block font-medium uppercase tracking-wider mb-0.5">Email</span>
              <span class="text-gray-700 dark:text-gray-300 break-all block">{{ user.email }}</span>
            </div>
            <div class="text-right">
              <span class="text-gray-400 block font-medium uppercase tracking-wider mb-0.5">Rol</span>
              <div class="flex justify-end mt-0.5">
                <UBadge 
                  :color="user.role === 'admin' ? 'red' : 'blue'" 
                  variant="subtle" 
                  size="xs"
                  class="uppercase font-bold"
                >
                  {{ user.role || 'client' }}
                </UBadge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="hidden md:block overflow-x-auto">
        <UTable 
          :columns="columns" 
          :rows="filteredUsers" 
          :loading="pending"
          class="w-full"
        >
          <template #avatar-data="{ row }">
            <div class="flex items-center gap-2 max-w-[170px]">
              <div class="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400 shrink-0">
                <UIcon name="i-heroicons-user-circle" class="w-6 h-6" />
              </div>
              <span class="font-mono text-xs text-gray-400 truncate">ID: {{ row.id }}</span>
            </div>
          </template>

          <template #name-data="{ row }">
            <span class="font-bold text-gray-900 dark:text-white text-sm">{{ row.name || 'Sin nombre' }}</span>
          </template>

          <template #email-data="{ row }">
            <span class="text-sm text-gray-600 dark:text-gray-400">{{ row.email }}</span>
          </template>

          <template #role-data="{ row }">
            <UBadge :color="row.role === 'admin' ? 'red' : 'blue'" variant="subtle" size="xs" class="uppercase font-bold">
              {{ row.role || 'client' }}
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
      </div>

      <div v-if="!pending && filteredUsers.length === 0" class="text-center py-12 text-gray-400 italic text-sm">
        No se han encontrado usuarios que coincidan con la búsqueda.
      </div>
    </UCard>
  </div>
</template>

<style scoped>
/* Estilos mínimos para que la tabla en PC mantenga estructura sin forzar recortes agresivos */
:deep(table) {
  width: 100% !important;
}
</style>