# Fix: Botón "Nuevo Currículum" Ahora Funciona

## ✅ Problema Resuelto

El botón "Nuevo Currículum" en el dashboard solo mostraba un `console.log` y no creaba ni redirigía al editor.

## 🔧 Cambios Realizados

### **1. Server Action: `createResume()`** (`src/app/actions/resume.ts`)

Nueva función para crear currículums en la base de datos:

```typescript
export async function createResume(title: string = 'Nuevo Currículum') {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error('No autenticado');
  }

  const { nanoid } = await import('nanoid');
  const newResumeId = nanoid();
  const slug = title.toLowerCase().replace(/\s+/g, '-') + '-' + newResumeId.slice(0, 6);

  const [newResume] = await db
    .insert(resume)
    .values({
      id: newResumeId,
      userId: session.user.id,
      title,
      slug,
      templateId: 'modern',
      isPublic: false,
      viewCount: 0,
      downloadCount: 0,
    })
    .returning();

  return newResume;
}
```

**Características:**
- ✅ Genera ID único con `nanoid`
- ✅ Crea slug automático basado en el título
- ✅ Verifica autenticación del usuario
- ✅ Inserta en la base de datos
- ✅ Retorna el nuevo currículum creado

### **2. Dashboard: `handleCreateNew()`** (`src/app/dashboard/page.tsx`)

Actualizado para crear el CV y redirigir al editor:

```typescript
const handleCreateNew = async () => {
  setCreating(true);
  try {
    const newResume = await createResume('Nuevo Currículum');
    router.push(`/editor/${newResume.id}`);
  } catch (error) {
    console.error('Error creating resume:', error);
    setCreating(false);
  }
};
```

**Flujo:**
1. Usuario hace click en "Nuevo Currículum"
2. Se muestra estado "Creando..." con spinner
3. Se crea el CV en la base de datos
4. Se redirige automáticamente al editor
5. Si hay error, se muestra en consola y se resetea el botón

### **3. UI del Botón Mejorada**

Ahora muestra estados visuales:

```tsx
<button
  onClick={handleCreateNew}
  disabled={creating}
  className="..."
>
  {creating ? (
    <>
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      <span className="hidden sm:inline">Creando...</span>
    </>
  ) : (
    <>
      <Plus className="w-5 h-5" />
      <span className="hidden sm:inline">Nuevo Currículum</span>
      <span className="sm:hidden">Nuevo</span>
    </>
  )}
</button>
```

**Estados:**
- **Normal**: Icono "+" y texto "Nuevo Currículum"
- **Creando**: Spinner animado y texto "Creando..."
- **Deshabilitado**: No se puede hacer click mientras crea

## 🎯 Resultado

### **Antes:**
```
Click "Nuevo Currículum" → console.log() → Nada pasa
```

### **Ahora:**
```
Click "Nuevo Currículum" 
  → Muestra "Creando..." 
  → Crea CV en DB 
  → Redirige a /editor/[id] 
  → Usuario puede empezar a editar
```

## 📊 Base de Datos

Cuando se crea un nuevo currículum, se inserta con valores por defecto:

```sql
INSERT INTO resume (
  id,           -- nanoid único
  userId,       -- ID del usuario autenticado
  title,        -- "Nuevo Currículum"
  slug,         -- "nuevo-curriculum-abc123"
  templateId,   -- "modern"
  isPublic,     -- false
  viewCount,    -- 0
  downloadCount -- 0
) VALUES (...);
```

Los campos JSONB (`personalInfo`, `experience`, etc.) se crean automáticamente como `null` o arrays vacíos según el schema de Drizzle.

## 🚀 Próximos Pasos Sugeridos

1. **Agregar diálogo de nombre personalizado**
   ```typescript
   // Antes de crear, mostrar modal:
   const title = await showNameDialog();
   const newResume = await createResume(title);
   ```

2. **Agregar selector de template**
   ```typescript
   const template = await showTemplateSelector();
   const newResume = await createResume(title, template);
   ```

3. **Agregar toast de confirmación**
   ```typescript
   toast.success('¡Currículum creado exitosamente!');
   ```

4. **Optimistic UI**
   ```typescript
   // Agregar CV a la lista inmediatamente
   setResumes([...resumes, optimisticResume]);
   // Luego confirmar con DB
   ```

## ✅ Testing

Para probar:
1. Ir a `/dashboard`
2. Click en "Nuevo Currículum"
3. Debería mostrar "Creando..." por ~1 segundo
4. Debería redirigir a `/editor/[id]`
5. El editor debería cargar con el CV vacío
6. Volver al dashboard y ver el nuevo CV en la lista
