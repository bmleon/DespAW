export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  
  const gatewayUrl = config.public.apiBase || 'https://ukiyocazorla.es'

  try {
    console.log(`🔌 Conectando Usuarios a: ${gatewayUrl}/api/usuarios`)

    const response: any = await $fetch(`${gatewayUrl}/api/usuarios`, {
      method: 'GET',
      timeout: 5000
    })

    const usersList = Array.isArray(response) ? response : response.data || []

    return usersList.map((u: any) => {
      // Forzamos a que el ID sea un string completo por si viene como ObjectId de MongoDB
      const userId = u.id || u._id || String(u);

      // MAPEO DEL NOMBRE COMPLETO: Buscamos todas las combinaciones posibles del backend
      const userName = u.nombre || u.name || u.username || 'Usuario Registrado';

      // MAPEO DEL ROL: Buscamos si viene como 'rol', 'role' o en el array 'roles'
      let userRole = 'client';
      if (Array.isArray(u.roles) && u.roles.length > 0) {
        userRole = u.roles[0];
      } else if (u.rol || u.role) {
        userRole = u.rol || u.role;
      }

      // Limpiamos los roles típicos de Spring/Express para que se adapten a tu interfaz ('admin' o 'client')
      userRole = userRole.toLowerCase().includes('admin') ? 'admin' : 'client';

      return {
        id: userId,
        name: userName, // <-- Aquí ya no saldrá "Sin Nombre", usará el dato real
        email: u.email || 'sin-email@ukiyo.es',
        role: userRole,
        created_at: u.createdAt || u.fechaCreacion || u.created_at || new Date().toISOString()
      }
    })

  } catch (error: any) {
    console.error(`❌ Error Gateway Usuarios:`, error)
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Fallo de conexión con el API Gateway',
      data: error.data || null 
    })
  }
})