/** @type {import('tailwindcss').Config} */
export default {
  // Le decimos a Tailwind dónde buscar clases para generar el CSS
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  
  // Activamos el modo oscuro manual (con botón) en lugar de automático por sistema
  darkMode: 'class',
  
  theme: {
    extend: {
      // AQUÍ ESTÁN TUS COLORES PERSONALIZADOS
      colors: {
        'ukiyo-gold': '#C5A059',  // El dorado de tu logo
        'ukiyo-dark': '#121212',  // El negro de fondo principal
        'ukiyo-nav': '#1E1E1E',   // El gris oscuro de las tarjetas/menú
      },
      // Fuente principal
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}