
<template>
  <!-- 
    Contenedor Principal:
    - min-h-screen: Ocupa al menos el 100% de la altura de la ventana.
    - flex flex-col: Organiza los elementos en columna vertical.
    - transition-colors: Para que el cambio Claro/Oscuro sea suave.
  -->
  <div class="min-h-screen bg-gray-50 dark:bg-ukiyo-dark font-sans text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
    
    <!-- 1. Barra de Navegación (Fija arriba) -->
    <NavBar />
    
    <!-- 2. Contenido de la Página -->
    <!-- flex-grow: Hace que este div se estire para ocupar todo el espacio disponible, empujando el footer abajo -->
    <div class="flex-grow">
      <slot />
    </div>

    <!-- 3. Pie de Página -->
    <Footer />
    
  </div>
</template>