<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'
import { GetUsersUseCase } from '~/modules/users/application/get-users.usecase'
import { UpdateUserRoleUseCase } from '~/modules/users/application/update-user-role.usecase'
import { DeleteUserUseCase } from '~/modules/users/application/delete-user.usecase'
import type { User } from '~/modules/users/domain/user.model'

// Ajustamos las columnas a las propiedades reales de tu interfaz de dominio 'User'
const columns = [
  { key: 'avatar', label: 'Usuario' },
  { key: 'name', label: 'Nombre', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rol', sortable: true },
  { key: 'actions', label: 'Acciones' }
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
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
      </div>
      <UButton icon="i-heroicons-arrow-path" color="gray" variant="ghost" :loading="pending" @click="loadUsers">
        Recargar Lista
      </UButton>
    </div>

    <UAlert v-if="errorMsg" title="Error" :description="errorMsg" color="red" variant="soft" class="mb-6" />

    <UCard :ui="{ body: { padding: 'p-0' } }">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass" placeholder="Buscar..." class="w-full" />
      </div>

      <div class="overflow-x-auto">
        <UTable :columns="columns" :rows="filteredUsers" :loading="pending" class="w-full">
          
          <template #avatar-data="{ row }">
            <div class="flex items-center gap-3 min-w-[180px]">
              <UAvatar :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'U')}`" size="sm" />
              <span class="text-xs font-mono text-gray-500 break-all w-24 block">{{ getUserId(row) }}</span>
            </div>
          </template>

          <template #name-data="{ row }">
            <span class="font-semibold text-gray-900 dark:text-white whitespace-nowrap">{{ row.name || 'Sin nombre' }}</span>
          </template>

          <template #email-data="{ row }">
            <span class="text-gray-600 dark:text-gray-300 whitespace-nowrap">{{ row.email || 'N/A' }}</span>
          </template>

          <template #role-data="{ row }">
            <UBadge :color="row.role === 'admin' ? 'red' : 'green'" variant="subtle" size="xs" class="capitalize">
              {{ row.role === 'admin' ? 'Admin' : 'Cliente' }}
            </UBadge>
          </template>

          <template #actions-data="{ row }">
            <UDropdown :items="items(row)">
              <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal" />
            </UDropdown>
          </template>

        </UTable>
      </div>
    </UCard>
  </div>
</template>