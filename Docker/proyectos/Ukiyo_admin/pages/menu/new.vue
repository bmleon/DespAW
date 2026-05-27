<script setup lang="ts">
import { ref } from 'vue'
import { ApiProductRepository } from '~/modules/products/infrastructure/api-product.repository'
import { CreateProductUseCase } from '~/modules/products/application/create-product.usecase'
import type { Product } from '~/modules/products/domain/product.model'

const isSaving = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')

// Instanciación de la lógica del puerto
const productRepository = new ApiProductRepository()
const createProductUseCase = new CreateProductUseCase(productRepository)

// Formulario reactivo adaptado a las propiedades del dominio puro
const newDish = ref<Product>({
  name: '',
  description: '',
  price: 0,
  category: 'Sushi',
  available: true
})

const categories = ['Sushi', 'Nigiri', 'Calientes', 'Postres', 'Bebidas']

const saveDish = async () => {
  isSaving.value = true
  errorMessage.value = ''
  showSuccess.value = false

  try {
    // Mandamos el objeto a través del filtro de reglas de aplicación
    await createProductUseCase.execute(newDish.value)

    showSuccess.value = true
    
    // Redirección limpia automática controlada
    setTimeout(async () => {
       await navigateTo('/menu') 
    }, 1500)

  } catch (error: any) {
    console.error('Error al guardar a través del caso de uso:', error)
    errorMessage.value = error.message || 'Ocurrió un error inesperado al procesar la solicitud.'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto pb-20 px-4">
    
    <div class="flex items-center gap-4 mb-8">
      <UButton icon="i-heroicons-arrow-left" color="gray" variant="ghost" to="/menu" />
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Añadir Nuevo Producto</h1>
        <p class="text-gray-500 text-sm">Introduce los datos del plato para actualizar la carta.</p>
      </div>
    </div>

    <UAlert 
      v-if="showSuccess" 
      title="¡Guardado con éxito!" 
      description="El plato se ha registrado y ya está sincronizado en el clúster."
      color="green" 
      variant="soft" 
      icon="i-heroicons-check-circle"
      class="mb-6"
    />

    <UAlert 
      v-if="errorMessage" 
      title="No se pudo guardar el producto" 
      :description="errorMessage"
      color="red" 
      variant="soft" 
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard>
      <form @submit.prevent="saveDish" class="space-y-6">
        
        <UFormGroup label="Nombre del Plato" required>
          <UInput v-model="newDish.name" placeholder="Ej: Dragon Roll" autofocus class="w-full" />
        </UFormGroup>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <UFormGroup label="Categoría" required>
            <USelect 
              v-model="newDish.category" 
              :options="categories" 
              class="w-full"
            />
          </UFormGroup>

          <UFormGroup label="Precio (€)" required>
            <UInput 
              v-model.number="newDish.price" 
              type="number" 
              step="0.10" 
              min="0"
              placeholder="0.00" 
              icon="i-heroicons-currency-euro" 
              class="w-full"
            />
          </UFormGroup>
        </div>

        <UFormGroup label="Descripción / Alérgenos">
          <UTextarea 
            v-model="newDish.description" 
            placeholder="Describe los ingredientes principales del plato..." 
            :rows="3"
            class="w-full"
          />
        </UFormGroup>

        <div class="flex justify-end gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
          <UButton color="gray" variant="ghost" to="/menu">Cancelar</UButton>
          <UButton type="submit" color="primary" :loading="isSaving" icon="i-heroicons-check">
            Guardar Plato
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>