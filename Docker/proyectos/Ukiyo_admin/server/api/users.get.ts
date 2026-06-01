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
      // 1. Extraemos el nombre real buscando en todas las propiedades posibles del backend
      // Si todo falla, extrae la primera parte del correo (ej: "fabricio")
      const nombreReal = u.nombre || u.name || u.username || (u.email ? u.email.split('@')[0] : 'Usuario Registrado');

      // 2. Forzamos el ID a que sea un texto limpio completo
      const idReal = u.id || u._id || String(u);

      // 3. Mapeamos el rol asegurando compatibilidad con tu diseño de frontend
      let rolReal = 'client';
      if (Array.isArray(u.roles) && u.roles.length > 0) {
        rolReal = u.roles[0];
      } else if (u.rol || u.role) {
        rolReal = u.rol || u.role;
      }
      
      // Normalizamos el rol a formato inglés estándar por si acaso
      rolReal = rolReal.toLowerCase().includes('admin') ? 'admin' : 'client';

      // ENVIAMOS EL OBJETO CON DUPLICIDAD DE CAMPOS
      // Esto asegura que la tabla lea el campo correcto sin importar cómo esté programada la vista
      return {
        id: idReal,
        _id: idReal,
        
        name: nombreReal,     // Si la tabla busca user.name
        nombre: nombreReal,   // Si la tabla busca user.nombre
        username: nombreReal, // Si la tabla busca user.username
        
        email: u.email || 'sin-email@ukiyo.com',
        
        role: rolReal,        // Si la tabla busca user.role
        rol: rolReal,         // Si la tabla busca user.rol
        
        created_at: u.createdAt || u.fechaCreacion || u.created_at || new Date().toISOString()
      }
    })

  } catch (error: any) {
    // Imprime el error en la terminal de tu servidor de MicroK8s
    console.error(`❌ Error Gateway Usuarios:`, error)
    
    throw createError({
      statusCode: error.response?.status || 500,
      statusMessage: error.message || 'Fallo de conexión con el API Gateway',
      data: error.data || null 
    })
  }
})