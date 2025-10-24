# Sistema de Diseño Personalizable

## ✅ Funcionalidad Implementada

El apartado de **Diseño** ahora está completamente funcional y permite personalizar la apariencia del CV en tiempo real.

### **Opciones Disponibles:**

#### **1. Esquema de Color** 🎨
Cambia el color principal del CV (títulos, enlaces, badges):

- **Azul** (#3B82F6) - Por defecto
- **Verde** (#10B981)
- **Púrpura** (#8B5CF6)
- **Rojo** (#EF4444)
- **Gris** (#6B7280)

**Elementos afectados:**
- Bordes de títulos de sección
- Enlaces (website, LinkedIn, GitHub, proyectos)
- Badges de habilidades (fondo claro + texto oscuro)

#### **2. Fuente** 📝
Cambia la tipografía de todo el CV:

- **Inter** (Por defecto)
- **Roboto**
- **Open Sans**
- **Lato**
- **Montserrat**

#### **3. Diseño** 📐
Estructura del layout (próximamente):

- **Una Columna** (Actual)
- **Dos Columnas**
- **Con Sidebar**

#### **4. Espaciado** 📏
Controla el espacio entre secciones:

- **Compact** (`space-y-4`) - Más apretado
- **Normal** (`space-y-6`) - Balanceado (por defecto)
- **Relaxed** (`space-y-8`) - Más espacioso

#### **5. Tamaño de Fuente** 🔤
Ajusta el tamaño base del texto:

- **Rango:** 12px - 18px
- **Por defecto:** 14px
- **Control:** Slider interactivo

## 🎨 Implementación Técnica

### **Color Scheme Mapping:**
```typescript
const colorSchemes = {
  blue: { 
    primary: '#3B82F6',   // Color principal
    light: '#DBEAFE',     // Fondo de badges
    dark: '#1E40AF'       // Texto de badges
  },
  green: { primary: '#10B981', light: '#D1FAE5', dark: '#047857' },
  purple: { primary: '#8B5CF6', light: '#EDE9FE', dark: '#6D28D9' },
  red: { primary: '#EF4444', light: '#FEE2E2', dark: '#B91C1C' },
  gray: { primary: '#6B7280', light: '#F3F4F6', dark: '#374151' },
};
```

### **Font Family Mapping:**
```typescript
const fontFamilies = {
  inter: 'Inter, sans-serif',
  roboto: 'Roboto, sans-serif',
  'open-sans': '"Open Sans", sans-serif',
  lato: 'Lato, sans-serif',
  montserrat: 'Montserrat, sans-serif',
};
```

### **Spacing Classes:**
```typescript
const spacingClasses = {
  compact: 'space-y-4',   // 16px entre secciones
  normal: 'space-y-6',    // 24px entre secciones
  relaxed: 'space-y-8',   // 32px entre secciones
};
```

## 📊 Elementos Personalizados

### **1. Títulos de Sección**
```tsx
<h2 
  className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2"
  style={{ borderColor: colorScheme.primary }}
>
  Experiencia Profesional
</h2>
```

**Aplica a:**
- Experiencia Profesional
- Educación
- Habilidades
- Proyectos
- Idiomas

### **2. Enlaces**
```tsx
<a 
  href={url} 
  className="hover:underline" 
  style={{ color: colorScheme.primary }}
>
  Texto del enlace
</a>
```

**Aplica a:**
- Website personal
- LinkedIn
- GitHub
- URLs de proyectos

### **3. Badges de Habilidades**
```tsx
<span
  className="px-3 py-1 rounded-full text-sm font-medium"
  style={{ 
    backgroundColor: colorScheme.light, 
    color: colorScheme.dark 
  }}
>
  React
</span>
```

### **4. Contenedor del CV**
```tsx
<div
  style={{
    fontFamily: fontFamily,    // Fuente seleccionada
    fontSize: `${fontSize}px`, // Tamaño de fuente
  }}
>
  <div className={spacing}>   {/* Espaciado entre secciones */}
    {/* Contenido del CV */}
  </div>
</div>
```

## 🎯 Flujo de Usuario

### **Cambiar Color:**
1. Usuario va a sección "Diseño"
2. Ve 5 círculos de colores
3. Click en color deseado
4. Preview se actualiza instantáneamente
5. Todos los títulos y enlaces cambian de color

### **Cambiar Fuente:**
1. Usuario abre dropdown de fuentes
2. Selecciona fuente deseada
3. Todo el texto del CV cambia de tipografía

### **Ajustar Espaciado:**
1. Usuario ve 3 botones: Compact, Normal, Relaxed
2. Click en opción deseada
3. Espacio entre secciones se ajusta

### **Cambiar Tamaño:**
1. Usuario mueve slider de 12 a 18
2. Texto se hace más grande/pequeño en tiempo real
3. Label muestra tamaño actual: "14px"

## 📐 Ejemplos Visuales

### **Azul (Por defecto):**
```
━━━━━━━━━━━━━━━━━━━━━━━  (Azul #3B82F6)
Experiencia Profesional

website.com  (Azul #3B82F6)

[React] [TypeScript]  (Fondo: #DBEAFE, Texto: #1E40AF)
```

### **Verde:**
```
━━━━━━━━━━━━━━━━━━━━━━━  (Verde #10B981)
Experiencia Profesional

website.com  (Verde #10B981)

[React] [TypeScript]  (Fondo: #D1FAE5, Texto: #047857)
```

### **Púrpura:**
```
━━━━━━━━━━━━━━━━━━━━━━━  (Púrpura #8B5CF6)
Experiencia Profesional

website.com  (Púrpura #8B5CF6)

[React] [TypeScript]  (Fondo: #EDE9FE, Texto: #6D28D9)
```

## 🔄 Auto-guardado

Todos los cambios de diseño se guardan automáticamente:

```typescript
const handleChange = (key: string, value: any) => {
  const updated = { ...design, [key]: value };
  setDesign(updated);
  onUpdate({ design: updated }); // ← Trigger auto-save
};
```

**Flujo:**
1. Usuario cambia color → `onUpdate` se llama
2. Resume se actualiza con nuevo diseño
3. Auto-save se activa después de 2 segundos
4. Cambios se guardan en BD

## 📝 Estructura de Datos

### **Resume.design:**
```typescript
interface ResumeDesign {
  colorScheme?: 'blue' | 'green' | 'purple' | 'red' | 'gray';
  fontFamily?: 'inter' | 'roboto' | 'open-sans' | 'lato' | 'montserrat';
  layout?: 'single-column' | 'two-column' | 'sidebar';
  spacing?: 'compact' | 'normal' | 'relaxed';
  fontSize?: number; // 12-18
}
```

### **Ejemplo:**
```json
{
  "design": {
    "colorScheme": "purple",
    "fontFamily": "montserrat",
    "layout": "single-column",
    "spacing": "relaxed",
    "fontSize": 16
  }
}
```

## 🎨 Paleta de Colores Completa

| Esquema | Primary | Light | Dark |
|---------|---------|-------|------|
| **Azul** | #3B82F6 | #DBEAFE | #1E40AF |
| **Verde** | #10B981 | #D1FAE5 | #047857 |
| **Púrpura** | #8B5CF6 | #EDE9FE | #6D28D9 |
| **Rojo** | #EF4444 | #FEE2E2 | #B91C1C |
| **Gris** | #6B7280 | #F3F4F6 | #374151 |

## 🚀 Próximas Mejoras

### **1. Layouts Adicionales:**
- **Dos Columnas**: Sidebar con info de contacto + contenido principal
- **Con Sidebar**: Sidebar izquierdo con skills/idiomas + contenido derecho

### **2. Más Opciones de Color:**
- Selector de color personalizado (color picker)
- Gradientes
- Modo oscuro

### **3. Tipografía Avanzada:**
- Tamaños independientes (título vs cuerpo)
- Line height ajustable
- Letter spacing

### **4. Temas Predefinidos:**
- Profesional (Azul + Inter + Normal)
- Creativo (Púrpura + Montserrat + Relaxed)
- Minimalista (Gris + Roboto + Compact)
- Moderno (Verde + Lato + Normal)

## ✅ Resultado Final

El sistema de diseño está completamente funcional y permite:

- ✅ **5 esquemas de color** con cambio instantáneo
- ✅ **5 fuentes** profesionales
- ✅ **3 niveles de espaciado**
- ✅ **Tamaño de fuente ajustable** (12-18px)
- ✅ **Preview en tiempo real**
- ✅ **Auto-guardado** de preferencias
- ✅ **Aplicación consistente** en todo el CV

El usuario ahora puede personalizar completamente la apariencia de su CV sin tocar código! 🎉
