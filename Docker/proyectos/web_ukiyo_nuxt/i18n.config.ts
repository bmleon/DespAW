export default defineI18nConfig(() => ({
  legacy: false,
  locale: 'es',
  messages: {
    es: {
      nav: {
        home: 'Inicio',
        menu: 'Menú',
        offers: 'Ofertas',
        catering: 'Catering',
        contact: 'Contacto'
      }
    },
    en: {
      nav: {
        home: 'Home',
        menu: 'Menu',
        offers: 'Offers',
        catering: 'Catering',
        contact: 'Contact'
      }
    }
  }
}))