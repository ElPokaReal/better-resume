# Configuración de OAuth con GitHub y Google

Esta guía te ayudará a configurar la autenticación OAuth con GitHub y Google para tu aplicación Better Resume.

## 📋 Requisitos Previos

- Una cuenta de GitHub
- Una cuenta de Google
- Tu aplicación debe estar corriendo (al menos en desarrollo)

## 🔧 Variables de Entorno

Copia el archivo `env.example` a `.env.local` y completa las variables:

```bash
cp env.example .env.local
```

---

## 🐙 Configuración de GitHub OAuth

### Paso 1: Crear una OAuth App en GitHub

1. Ve a [GitHub Developer Settings](https://github.com/settings/developers)
2. Click en **"OAuth Apps"** en el menú lateral
3. Click en **"New OAuth App"**

### Paso 2: Configurar la Aplicación

Completa el formulario con la siguiente información:

- **Application name**: `Better Resume` (o el nombre que prefieras)
- **Homepage URL**: 
  - Desarrollo: `http://localhost:3000`
  - Producción: `https://tu-dominio.com`
- **Application description**: (Opcional) "Aplicación para crear currículums profesionales"
- **Authorization callback URL**: 
  - Desarrollo: `http://localhost:3000/api/auth/callback/github`
  - Producción: `https://tu-dominio.com/api/auth/callback/github`

### Paso 3: Obtener las Credenciales

1. Después de crear la app, verás tu **Client ID**
2. Click en **"Generate a new client secret"** para obtener tu **Client Secret**
3. **⚠️ IMPORTANTE**: Copia el Client Secret inmediatamente, no podrás verlo de nuevo

### Paso 4: Agregar a .env.local

```env
GITHUB_CLIENT_ID=tu_client_id_aqui
GITHUB_CLIENT_SECRET=tu_client_secret_aqui
```

---

## 🔍 Configuración de Google OAuth

### Paso 1: Crear un Proyecto en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Click en el selector de proyectos (arriba a la izquierda)
3. Click en **"NEW PROJECT"**
4. Nombra tu proyecto: `Better Resume`
5. Click en **"CREATE"**

### Paso 2: Habilitar la API de Google+

1. En el menú lateral, ve a **"APIs & Services"** > **"Library"**
2. Busca **"Google+ API"** o **"Google Identity"**
3. Click en **"ENABLE"**

### Paso 3: Configurar la Pantalla de Consentimiento OAuth

1. Ve a **"APIs & Services"** > **"OAuth consent screen"**
2. Selecciona **"External"** (a menos que tengas Google Workspace)
3. Click en **"CREATE"**

Completa la información:

- **App name**: `Better Resume`
- **User support email**: tu email
- **Developer contact information**: tu email
- Click en **"SAVE AND CONTINUE"**

En **"Scopes"**:
- Click en **"ADD OR REMOVE SCOPES"**
- Selecciona:
  - `.../auth/userinfo.email`
  - `.../auth/userinfo.profile`
  - `openid`
- Click en **"UPDATE"** y luego **"SAVE AND CONTINUE"**

En **"Test users"** (si es necesario):
- Agrega tu email para testing
- Click en **"SAVE AND CONTINUE"**

### Paso 4: Crear Credenciales OAuth

1. Ve a **"APIs & Services"** > **"Credentials"**
2. Click en **"CREATE CREDENTIALS"** > **"OAuth client ID"**
3. Selecciona **"Web application"**

Configura:

- **Name**: `Better Resume Web Client`
- **Authorized JavaScript origins**:
  - Desarrollo: `http://localhost:3000`
  - Producción: `https://tu-dominio.com`
- **Authorized redirect URIs**:
  - Desarrollo: `http://localhost:3000/api/auth/callback/google`
  - Producción: `https://tu-dominio.com/api/auth/callback/google`

4. Click en **"CREATE"**

### Paso 5: Obtener las Credenciales

1. Verás un modal con tu **Client ID** y **Client Secret**
2. Copia ambos valores

### Paso 6: Agregar a .env.local

```env
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
```

---

## 🔐 Generar BETTER_AUTH_SECRET

Genera una clave secreta segura usando OpenSSL:

```bash
# En terminal (Mac/Linux)
openssl rand -base64 32

# En PowerShell (Windows)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Agrega el resultado a tu `.env.local`:

```env
BETTER_AUTH_SECRET=tu_clave_secreta_generada
```

---

## 📝 Archivo .env.local Completo

Tu archivo `.env.local` debería verse así:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/better-resume

# Better Auth
BETTER_AUTH_SECRET=tu_clave_secreta_generada
BETTER_AUTH_URL=http://localhost:3000

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=tu_github_client_id
GITHUB_CLIENT_SECRET=tu_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret
```

---

## 🚀 Probar la Configuración

1. Reinicia tu servidor de desarrollo:
   ```bash
   npm run dev
   # o
   bun dev
   ```

2. Ve a tu página de login: `http://localhost:3000/login` (o la ruta que uses)

3. Intenta iniciar sesión con GitHub y Google

---

## 🐛 Solución de Problemas

### Error: "redirect_uri_mismatch"

**Causa**: La URL de callback no coincide con la configurada en GitHub/Google.

**Solución**:
- Verifica que las URLs de callback sean exactamente:
  - GitHub: `http://localhost:3000/api/auth/callback/github`
  - Google: `http://localhost:3000/api/auth/callback/google`
- Asegúrate de no tener espacios o caracteres extra
- En producción, usa `https://` en lugar de `http://`

### Error: "Client ID not found"

**Causa**: Las variables de entorno no están cargadas correctamente.

**Solución**:
- Verifica que el archivo se llame `.env.local` (no `.env`)
- Reinicia el servidor después de cambiar las variables
- Verifica que no haya espacios alrededor del `=`

### Error: "Access blocked: This app's request is invalid"

**Causa**: La pantalla de consentimiento de Google no está configurada correctamente.

**Solución**:
- Completa todos los campos requeridos en la pantalla de consentimiento
- Asegúrate de haber agregado los scopes correctos
- Si estás en modo "Testing", agrega tu email como usuario de prueba

### Los usuarios no se guardan en la base de datos

**Causa**: Las tablas de la base de datos no están creadas o no coinciden con el schema.

**Solución**:
```bash
# Genera las migraciones
npm run db:generate

# Aplica las migraciones
npm run db:migrate

# O empuja directamente el schema (desarrollo)
npm run db:push
```

---

## 🌐 Configuración para Producción

Cuando despliegues a producción:

1. **Actualiza las URLs de callback** en GitHub y Google con tu dominio real
2. **Usa HTTPS** en todas las URLs
3. **Genera un nuevo BETTER_AUTH_SECRET** para producción
4. **Nunca compartas** tus Client Secrets
5. **Usa variables de entorno** de tu plataforma de hosting (Vercel, Railway, etc.)

### Ejemplo para Vercel:

```bash
vercel env add GITHUB_CLIENT_ID
vercel env add GITHUB_CLIENT_SECRET
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
vercel env add BETTER_AUTH_SECRET
```

---

## 📚 Recursos Adicionales

- [Better Auth Documentation](https://www.better-auth.com/docs)
- [GitHub OAuth Apps Documentation](https://docs.github.com/en/apps/oauth-apps)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)

---

## ✅ Checklist

- [ ] Crear OAuth App en GitHub
- [ ] Obtener GitHub Client ID y Secret
- [ ] Crear proyecto en Google Cloud Console
- [ ] Configurar pantalla de consentimiento de Google
- [ ] Crear credenciales OAuth de Google
- [ ] Obtener Google Client ID y Secret
- [ ] Generar BETTER_AUTH_SECRET
- [ ] Crear archivo .env.local con todas las variables
- [ ] Reiniciar servidor de desarrollo
- [ ] Probar login con GitHub
- [ ] Probar login con Google
- [ ] Verificar que los usuarios se guarden en la base de datos

---

¡Listo! Ahora tu aplicación debería tener autenticación OAuth funcionando con GitHub y Google. 🎉
