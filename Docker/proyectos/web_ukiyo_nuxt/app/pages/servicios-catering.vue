<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const phone = ref('')
const guests = ref(10)
const eventType = ref('Cumpleaños')
const description = ref('')

const pending = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// Opciones para el desplegable de tipo de evento
const eventOptions = ['Cumpleaños', 'Boda', 'Evento de Empresa', 'Aniversario', 'Otro privado']

const handleSolicitarCatering = async () => {
  pending.value = true
  successMsg.value = ''
  errorMsg.value = ''

  // REEMPLAZA ESTO: Pon aquí el ID real de letras y números que te dé Formspree
  const FORMSPREE_ID = 'mojzapoj' 

  const payload = {
    Nombre: name.value,
    Email: email.value,
    Telefono: phone.value,
    Comensales: guests.value,
    Tipo_Evento: eventType.value,
    Detalles: description.value
  }

  try {
    await $fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
      method: 'POST',
      body: payload
    })

    successMsg.value = '¡Solicitud enviada con éxito! Nos pondremos en contacto contigo muy pronto para pasarte el presupuesto personalizado.'
    
    // Limpiamos el formulario tras el éxito para una mejor experiencia de usuario
    name.value = ''
    email.value = ''
    phone.value = ''
    guests.value = 10
    eventType.value = 'Cumpleaños'
    description.value = ''
  } catch (err: any) {
    errorMsg.value = 'Ocurrió un error al procesar tu solicitud. Por favor, inténtalo de nuevo.'
  } finally {
    pending.value = false
  }
}
</script>

<template>
  <div class="max-w-3xl mx-auto px-4 py-12">
    <div class="text-center mb-10">
      <span class="text-xs font-bold tracking-widest text-red-500 uppercase">Servicios Exclusivos</span>
      <h1 class="text-3xl font-extrabold text-gray-950 dark:text-white mt-1">Catering & Eventos Privados</h1>
      <p class="text-gray-500 dark:text-gray-400 mt-2 max-w-lg mx-auto text-sm">
        ¿Quieres llevar la experiencia Ukiyo a tu celebración? Cuéntanos los detalles de tu evento y diseñaremos un menú a tu medida.
      </p>
    </div>

    <UAlert
      v-if="successMsg"
      title="¡Excelente!"
      :description="successMsg"
      color="green"
      variant="soft"
      icon="i-heroicons-check-circle"
      class="mb-6"
    />

    <UAlert
      v-if="errorMsg"
      title="Error de envío"
      :description="errorMsg"
      color="red"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    />

    <UCard class="shadow-xl bg-white dark:bg-ukiyo-nav border border-gray-100 dark:border-gray-800">
      <form @submit.prevent="handleSolicitarCatering" class="space-y-6">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormGroup label="Tu Nombre" required>
            <UInput v-model="name" placeholder="Ej: Belén León" icon="i-heroicons-user" required size="md" />
          </UFormGroup>

          <UFormGroup label="Correo Electrónico" required>
            <UInput v-model="email" type="email" placeholder="Ej: belen@example.com" icon="i-heroicons-envelope" required size="md" />
          </UFormGroup>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <UFormGroup label="Teléfono de Contacto" required>
            <UInput v-model="phone" type="tel" placeholder="Ej: 612345678" icon="i-heroicons-phone" required size="md" />
          </UFormGroup>

          <UFormGroup label="Tipo de Celebración" required>
            <USelect v-model="eventType" :options="eventOptions" size="md" />
          </UFormGroup>
        </div>

        <UFormGroup label="Número estimado de personas (Mínimo 10)" required>
          <UInput v-model.number="guests" type="number" min="10" max="500" icon="i-heroicons-users" size="md" required />
        </UFormGroup>

        <UFormGroup label="Cuéntanos más detalles sobre el evento" description="Especifica si necesitas barra de sushi en vivo, alérgenos, horario o ideas que tengas.">
          <UTextarea v-model="description" placeholder="Ej: Queremos un córner de sushi variado para una cena de empresa nocturna..." rows="4" size="md" />
        </UFormGroup>

        <div class="pt-2">
          <UButton
            type="submit"
            block
            color="red"
            size="lg"
            class="font-bold uppercase tracking-wider justify-center"
            :loading="pending"
          >
            Solicitar Presupuesto de Catering
          </UButton>
        </div>

      </form>
    </UCard>
  </div>
</template>