# Frontend - Sistema de Gestión de Pedidos

Este proyecto es el **frontend** de una aplicación de gestión de pedidos, productos y usuarios, desarrollado con **Angular**. Incluye autenticación JWT, login con Google OAuth, formularios reactivos, guardas de ruta y control de acceso según rol del usuario.

## Tecnologías

- [Angular 17+](https://angular.io/)
- [RxJS](https://rxjs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Angular Router](https://angular.io/guide/router)
- [JWT](https://jwt.io/)
- Google OAuth 2.0
- LocalStorage para persistencia de sesión

## Roles y Permisos

- Los usuarios tienen un \`role\` (Administrador, Usuario) y un \`charge\` (Administrativo, Limpieza, etc).
- El frontend muestra u oculta secciones y botones según el rol.
- Las rutas del backend también están protegidas según el tipo de usuario.

## Componentes Destacados

- \`OrdersComponent\`: gestión de pedidos, creación, finalización y rechazo.
- \`ProductsComponent\`: listado, creación, edición y eliminación de productos.
- \`UsersComponent\`: administración de usuarios activos/inactivos.
- \`ErrorModalComponent\`: modal de error reutilizable.
- \`FormUtils\`: utilidades para validación de formularios.

## Instalación y ejecución

1. Clonar el repositorio:
   \`\`\`bash
   git clone https://github.com/tu-usuario/frontend-pedidos.git
   cd frontend-pedidos
   \`\`\`

2. Instalar dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Configurar el archivo de entorno \`src/environments/environments.ts\`:
   \`\`\`ts
   export const environment = {
   production: false,
   apiUrl: 'http://localhost:3000/api', // URL del backend NestJS
   };
   \`\`\`

4. Ejecutar el proyecto:
   \`\`\`bash
   ng serve
   \`\`\`

5. Abrir en el navegador:
   \`\`\`
   http://localhost:4200
   \`\`\`

## Login con Google (opcional)

Asegurate de tener configuradas estas variables en el backend:

- \`GOOGLE_CLIENT_ID\`
- \`GOOGLE_CLIENT_SECRET\`
- \`GOOGLE_CALLBACK_URL\`

Y que el callback redirija correctamente al frontend con el token en la URL.

## Build para producción

\`\`\`bash
ng build --configuration production
\`\`\`

Los archivos generados se encuentran en \`dist/\`.

## Recursos

- [Documentación oficial de Angular](https://angular.io/docs)
- [Guía de Tailwind CSS](https://tailwindcss.com/docs)
- [RxJS operators](https://rxjs.dev/operator-decision-tree)

## Autor

**Facundo Martirena Arena**  
Desarrollador Frontend Junior  
fmartirena@globaluy.com  
[LinkedIn](https://www.linkedin.com/in/facundo-martirena-9b8109243/)
