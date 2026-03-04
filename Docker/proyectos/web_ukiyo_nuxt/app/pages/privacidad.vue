<script setup lang="ts">
// SEO: Configuración de metadatos para la página de privacidad
useHead({
  title: 'Política de Privacidad | Ukiyo Cazorla',
  meta: [
    { name: 'description', content: 'Consulta nuestra política de privacidad para saber cómo protegemos tus datos personales en Ukiyo Cazorla.' }
  ]
})
</script>

<template>
  <div class="pb-20 pt-10 px-4">
    <div class="max-w-4xl mx-auto bg-white dark:bg-ukiyo-nav p-8 md:p-12 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 leading-relaxed">

      <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-8 text-center border-b-2 border-ukiyo-gold pb-4 inline-block mx-auto uppercase tracking-tighter">
        Política de <span class="text-ukiyo-gold">Privacidad</span>
      </h1>

      <section class="mb-8 space-y-6">
        <p>
          El presente documento tiene por objeto establecer la Política de Privacidad de este sitio web, portal titularidad de YAMILA GONZÁLEZ ROSADO, con domicilio social en P.I. CORREDERA Nº15, 23470, CAZORLA y C.I.F. Y7133143Y.
        </p>
        <p>
          Para nosotros es muy importante la transparencia, es por ello que te pedimos que dediques unos instantes a la lectura de esta Política de Privacidad, cuyo objetivo es garantizar el total cumplimiento del Reglamento General de Protección de Datos.
        </p>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Responsable del tratamiento</h3>
        <div class="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl mb-6 text-sm border border-gray-100 dark:border-gray-700">
          <ul class="space-y-2">
            <li><strong class="text-ukiyo-gold">Identidad:</strong> YAMILA GONZÁLEZ ROSADO - Y7133143Y</li>
            <li><strong class="text-ukiyo-gold">Dirección:</strong> P.I. CORREDERA Nº15, 23470, CAZORLA</li>
            <li><strong class="text-ukiyo-gold">Contacto:</strong> ukiyocazorla@gmail.com</li>
          </ul>
        </div>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Finalidad del tratamiento</h3>
        <p>
          Tratamos la información facilitada por las personas interesadas con el fin de:
        </p>
        <ul class="list-disc pl-6 mb-4 space-y-3 font-medium">
          <li>Gestionar la entrega del pedido y atender posibles incidencias.</li>
          <li>Envío de comunicaciones relacionadas con el servicio.</li>
          <li>Cumplimiento de obligaciones legales y fiscales.</li>
        </ul>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Derechos de los interesados</h3>
        <p>
          Cualquier persona tiene derecho a obtener confirmación sobre si estamos tratando datos personales que le conciernen. Usted tiene derecho a acceder, rectificar, suprimir sus datos, limitar el tratamiento u oponerse al mismo.
        </p>
        <p class="font-bold">
          Para ejercer sus derechos puede dirigirse por escrito a nuestra dirección postal o mediante correo electrónico a <span class="text-ukiyo-gold">ukiyocazorla@gmail.com</span>.
        </p>

        <h3 class="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase tracking-tight italic">Seguridad</h3>
        <p>
          Hemos adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida o acceso no autorizado, de acuerdo con la tecnología actual.
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