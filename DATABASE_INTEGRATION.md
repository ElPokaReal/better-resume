# Integración de Base de Datos - Dashboard

## ✅ Cambios Realizados

### **1. Schema de Base de Datos** (`src/app/db/schema.ts`)
- ✅ Corregidas las relaciones para evitar errores en Drizzle Studio
- ✅ Removidas relaciones `sessions` y `accounts` de `userRelations`
- ✅ Solo mantiene la relación `resumes` (one-to-many)

### **2. Server Actions** (`src/app/actions/resume.ts`)
Funciones creadas para interactuar con la base de datos:

#### **`getUserResumes()`**
```typescript
// Obtiene todos los currículums del usuario autenticado
// Ordenados por fecha de actualización (más reciente primero)
// Retorna: { id, title, templateId, updatedAt }[]
```

#### **`getResumeById(id)`**
```typescript
// Obtiene un currículum específico por ID
// Verifica que pertenezca al usuario autenticado
// Retorna: Resume completo o null
```

### **3. Dashboard Page** (`src/app/dashboard/page.tsx`)

#### **Removido:**
- ❌ Mock data hardcodeado
- ❌ Datos estáticos

#### **Agregado:**
- ✅ `useEffect` para cargar datos al montar el componente
- ✅ Estado de `loading` con spinner
- ✅ Función `formatRelativeTime()` para fechas relativas
- ✅ Integración con `getUserResumes()`
- ✅ Manejo de errores con try/catch

#### **Estados:**
```typescript
const [resumes, setResumes] = useState<Resume[]>([]);
const [loading, setLoading] = useState(true);
```

#### **Flujo:**
1. Componente se monta
2. Muestra spinner de carga
3. Llama a `getUserResumes()` (server action)
4. Actualiza estado con datos reales
5. Renderiza cards con información de la BD

## 🗄️ Estructura de Datos

### **Resume (desde BD)**
```typescript
interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: Date;
}
```

### **ResumeCard Props**
```typescript
interface ResumeCardProps {
  id: string;
  title: string;
  template: string;        // templateId
  updatedAt: string;       // formatRelativeTime(date)
  isFavorite?: boolean;
}
```

## 🔄 Formato de Fechas

La función `formatRelativeTime()` convierte timestamps a texto legible:

```typescript
- Menos de 1 min    → "hace unos segundos"
- Menos de 1 hora   → "hace X minutos"
- Menos de 1 día    → "hace X horas"
- Menos de 1 semana → "hace X días"
- Menos de 1 mes    → "hace X semanas"
- Más de 1 mes      → "hace X meses"
```

## 🚀 Próximos Pasos

### **Para usar el dashboard:**

1. **Generar y aplicar migración:**
```bash
bun run db:generate
bun run db:push
```

2. **Verificar en Drizzle Studio:**
```bash
bun run db:studio
```

3. **Crear un resume de prueba:**
```typescript
import { db } from '@/app/db';
import { resume } from '@/app/db/schema';
import { nanoid } from 'nanoid';

await db.insert(resume).values({
  id: nanoid(),
  userId: 'USER_ID_AQUI',
  title: 'Mi Primer CV',
  slug: 'mi-primer-cv',
  templateId: 'modern',
  personalInfo: {
    fullName: 'Tu Nombre',
    email: 'tu@email.com',
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  customSections: [],
});
```

## 📊 Estados del Dashboard

### **1. Loading**
```
┌─────────────────────────┐
│   🔄 Spinner animado    │
│ Cargando currículums... │
└─────────────────────────┘
```

### **2. Empty State**
```
┌─────────────────────────┐
│   📄 Icono grande       │
│ No tienes currículums   │
│  [Crear mi primer CV]   │
└─────────────────────────┘
```

### **3. Con Datos**
```
┌───────┐ ┌───────┐ ┌───────┐
│  CV 1 │ │  CV 2 │ │  CV 3 │
│ ⭐📄  │ │ ⭐📄  │ │ ⭐📄  │
└───────┘ └───────┘ └───────┘
```

### **4. Búsqueda Sin Resultados**
```
┌─────────────────────────────┐
│ No se encontraron CVs que   │
│ coincidan con "búsqueda"    │
└─────────────────────────────┘
```

## 🔐 Seguridad

- ✅ Server Actions con autenticación
- ✅ Verificación de sesión en cada request
- ✅ Solo retorna datos del usuario autenticado
- ✅ Validación de ownership en `getResumeById()`

## 📝 Notas

- Los datos se cargan **una sola vez** al montar el componente
- Para refrescar, el usuario debe recargar la página
- Considera agregar **optimistic updates** para mejor UX
- Considera agregar **React Query** para cache y refetch automático
