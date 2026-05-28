<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ApiUserRepository } from '~/modules/users/infrastructure/api-user.repository'
import { GetUsersUseCase } from '~/modules/users/application/get-users.usecase'
import { UpdateUserRoleUseCase } from '~/modules/users/application/update-user-role.usecase'
import { DeleteUserUseCase } from '~/modules/users/application/delete-user.usecase'
import type { User } from '~/modules/users/domain/user.model'

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

const getUserId = (user: any): string => {
  return user.id || user._id || ''
}

const loadUsers = async () => {
  pending.value = true
  errorMsg.value = ''
  try {
    rawUsers.value = await getUsersUseCase.execute()
  } catch (err: any) {
    errorMsg.value = err.message || 'No se pudieron recuperar los usuarios del sistema.'
  } finally {
    pending.value = false
  }
}

onMounted(() => {
  loadUsers()
})

const filteredUsers = computed(() => {
  if (!rawUsers.value) return []
  return rawUsers.value.filter((user) => {
    const query = search.value.toLowerCase()
    return (
      (user.name && user.name.toLowerCase().includes(query)) || 
      (user.email && user.email.toLowerCase().includes(query))
    )
  })
})

const handleToggleRole = async (user: User) => {
  const userId = getUserId(user)
  try {
    await updateUserRoleUseCase.execute(userId, user.role)
    await loadUsers() 
  } catch (err: any) {
    alert(err.message || 'Error al cambiar el rol.')
  }
}

const handleDeleteUser = async (user: User) => {
  const userId = getUserId(user)
  if (confirm('⚠️ ¿Seguro que deseas eliminar a este usuario? Perderá el acceso a su cuenta y este cambio es irreversible.')) {
    try {
      await deleteUserUseCase.execute(userId)
      await loadUsers()
    } catch (err: any) {
      alert(err.message || 'Error al dar de baja al usuario.')
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
    class: 'text-red-500 dark:text-red-400',
    click: () => handleDeleteUser(row)
  }]
]
</script>

<template>
  <div>
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gestión de Usuarios</h1>
        <p class="text-gray-500 text-sm">Controla las cuentas de los clientes y los permisos del panel.</p>
      </div>
      
      <UButton 
        icon="i-heroicons-arrow-path" 
        color="gray" 
        variant="ghost" 
        :loading="pending" 
        @click="loadUsers"
        class="w-full sm:w-auto justify-center"
      >
        Recargar Lista
      </UButton>
    </div>

    <UAlert 
      v-if="errorMsg"
      title="Error de comunicación con el clúster"
      :description="errorMsg"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <div class="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
        <UInput 
          v-model="search" 
          icon="i-heroicons-magnifying-glass" 
          placeholder="Buscar usuario por nombre o correo electrónico..." 
          class="w-full"
          autofocus
        />
      </div>

      <UTable 
        :columns="columns" 
        :rows="filteredUsers" 
        :loading="pending"
        class="w-full overflow-x-auto"
        :empty-state="{ icon: 'i-heroicons-users', label: 'No se encontraron usuarios con esos criterios.' }"
      >
        <template #avatar-data="{ row }">
          <div class="flex items-center gap-3 py-1">
            <UAvatar 
              :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(row.name || 'U')}&background=random&color=fff`" 
              size="sm" 
            />
            <div class="flex flex-col">
              <span class="text-xs font-mono text-gray-400 dark:text-gray-500">
                #{{ getUserId(row).slice(0, 8) }}...
              </span>
            </div>
          </div>
        </template>

        <template #name-data="{ row }">
          <span class="font-semibold text-gray-900 dark:text-white">{{ row.name || 'Sin nombre' }}</span>
        </template>

        <template #email-data="{ row }">
          <span class="text-gray-600 dark:text-gray-300">{{ row.email }}</span>
        </template>

        <template #role-data="{ row }">
          <UBadge 
            :color="row.role === 'admin' ? 'red' : 'green'" 
            variant="subtle" 
            size="xs"
            class="uppercase font-bold tracking-wider"
          >
            {{ row.role === 'admin' ? 'Admin' : 'Cliente' }}
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