<script setup lang="ts">
// SEO: Configuración de metadatos para la página de términos y condiciones
useHead({
  title: 'Condiciones de Compra | Ukiyo Cazorla',
  meta: [
    { name: 'description', content: 'Consulta las condiciones generales de compra de Ukiyo Cazorla: procesos de pedido, precios, formas de pago y política de entregas.' }
  ]
})
</script>

<template>
  <div class="pb-20 pt-10 px-4">
    <div class="max-w-4xl mx-auto bg-white dark:bg-ukiyo-nav p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed">
      
      <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 text-center border-b-2 border-ukiyo-gold pb-4 inline-block mx-auto uppercase tracking-tighter">
        Condiciones <span class="text-ukiyo-gold">Generales</span>
      </h1>

      <section class="mb-8 space-y-6">
        <p>
          Estas Condiciones Generales de Compra se aplican a la compra de los productos que YAMILA GONZÁLEZ ROSADO (en adelante “El Restaurante”), vende a través de este sitio web a cualquier usuario del mismo, mediante las modalidades de “Entrega en Tienda” y/o “Entrega a domicilio”.
        </p>

        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-6 text-sm border border-gray-100 dark:border-gray-700">
          <p class="font-bold mb-3 text-ukiyo-gold uppercase tracking-widest text-xs">Datos de identificación y contacto:</p>
          <ul class="space-y-2">
            <li><strong>Domicilio social:</strong> P.I. CORREDERA Nº15, 23470, CAZORLA</li>
            <li><strong>C.I.F.:</strong> Y7133143Y</li>
            <li><strong>Correo electrónico:</strong> ukiyocazorla@gmail.com</li>
            <li><strong>Teléfono:</strong> 643 925 344</li>
          </ul>
        </div>

        <p>
          La compra de los productos conlleva la aceptación de los términos previstos en estas Condiciones. Al realizar un pedido, el Cliente declara tener capacidad legal para contratar y se obliga a facilitar información veraz.
        </p>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Precio y forma de pago</h3>
        <p>
          El precio de los productos será el que aparezca en Euros junto a cada producto e incluirá los impuestos aplicables. El pago se realizará mediante tarjeta de débito o crédito a través de nuestra pasarela segura.
        </p>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Entregas y Desistimiento</h3>
        <p>
          Tras verificar el proceso de compra, procederemos a la entrega en la dirección indicada. Dada la naturaleza de los productos (alimentos perecederos preparados al momento), <strong>no rige el derecho de desistimiento</strong> una vez el pedido ha entrado en preparación.
        </p>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Garantía y Reclamaciones</h3>
        <p>
          El Cliente puede contactar con nosotros a través de la sección “Contacto” para manifestar cualquier queja o reclamación. Nos comprometemos a ofrecer una solución en el menor tiempo posible para garantizar tu satisfacción.
        </p>
      </section>

      <!-- Botón de retorno adaptado a Nuxt -->
      <div class="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
        <NuxtLink 
          to="/" 
          class="inline-block px-10 py-3 bg-ukiyo-gold text-black font-black uppercase tracking-widest rounded-full hover:bg-white hover:text-ukiyo-gold border-2 border-ukiyo-gold transition-all duration-300 shadow-lg"
        >
          Volver al Inicio
        </NuxtLink>
      </div>

    </div>
  </div>
</template>