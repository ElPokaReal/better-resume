# Configuración de GitHub OAuth para Better Resume

## Paso 1: Crear una GitHub OAuth App

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click en **"OAuth Apps"** en el menú lateral
3. Click en **"New OAuth App"**

## Paso 2: Configurar la OAuth App

Completa el formulario con la siguiente información:

- **Application name**: `Better Resume` (o el nombre que prefieras)
- **Homepage URL**: 
  - Desarrollo: `http://localhost:3000`
  - Producción: `https://tu-dominio.com`
- **Application description**: `Aplicación para crear currículums profesionales`
- **Authorization callback URL**: 
  - Desarrollo: `http://localhost:3000/api/auth/callback/github`
  - Producción: `https://tu-dominio.com/api/auth/callback/github`

## Paso 3: Obtener las credenciales

Después de crear la app:

1. Copia el **Client ID**
2. Click en **"Generate a new client secret"**
3. Copia el **Client Secret** (solo se muestra una vez)

## Paso 4: Configurar variables de entorno

1. Crea o edita el archivo `.env.local` en la raíz del proyecto:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Database
DATABASE_URL=tu_database_url

# GitHub OAuth
GITHUB_CLIENT_ID=tu_client_id_aqui
GITHUB_CLIENT_SECRET=tu_client_secret_aqui
```

2. **IMPORTANTE**: Nunca subas el archivo `.env.local` a Git
3. El archivo `.env.example` ya está incluido como referencia

## Paso 5: Reiniciar el servidor

```bash
# Detén el servidor actual (Ctrl+C)
# Luego ejecuta:
bun dev
```

## Verificar la configuración

1. Ve a `http://localhost:3000/login` o `http://localhost:3000/signup`
2. Deberías ver el botón **"Continuar con GitHub"**
3. Al hacer click, serás redirigido a GitHub para autorizar la app
4. Después de autorizar, volverás a la app y estarás autenticado

## Producción

Para producción, necesitas:

1. Crear una nueva OAuth App en GitHub con la URL de producción
2. Configurar las variables de entorno en tu plataforma de hosting (Vercel, Netlify, etc.)
3. Asegurarte de que `NEXT_PUBLIC_APP_URL` apunte a tu dominio de producción

## Troubleshooting

### Error: "The redirect_uri MUST match the registered callback URL"
- Verifica que la Authorization callback URL en GitHub coincida exactamente con tu URL
- Asegúrate de incluir `/api/auth/callback/github` al final

### Error: "Client authentication failed"
- Verifica que `GITHUB_CLIENT_ID` y `GITHUB_CLIENT_SECRET` estén correctamente configurados
- Asegúrate de que no haya espacios extra en las variables de entorno

### El botón no aparece
- Verifica que el servidor esté corriendo
- Revisa la consola del navegador para errores
- Asegúrate de que las variables de entorno estén cargadas (reinicia el servidor)

## Recursos

- [GitHub OAuth Documentation](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app)
- [Better Auth Documentation](https://www.better-auth.com/docs/authentication/social)
