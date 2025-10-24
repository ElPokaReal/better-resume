# Layouts del CV - Implementados

## ✅ 3 Layouts Disponibles

### **1. Una Columna (Single Column)** 📄

**Descripción:** Layout tradicional y profesional con todo el contenido centrado.

**Estructura:**
```
┌─────────────────────────────────┐
│         Juan Pérez              │
│   email • teléfono • ubicación  │
│   website • LinkedIn • GitHub   │
│                                 │
│  ─────────────────────────────  │
│         Resumen                 │
│  ─────────────────────────────  │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Experiencia Profesional        │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Puesto 1                     │
│  • Puesto 2                     │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Educación                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  • Título 1                     │
│  • Título 2                     │
│                                 │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  Habilidades                    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  [React] [TypeScript] [Node]    │
└─────────────────────────────────┘
```

**Características:**
- ✅ Información personal centrada
- ✅ Todas las secciones en una columna
- ✅ Ideal para CVs tradicionales
- ✅ Fácil de leer y escanear
- ✅ Mejor para imprimir

**Uso recomendado:**
- CVs académicos
- Posiciones corporativas tradicionales
- Cuando se requiere formato ATS-friendly

---

### **2. Dos Columnas (Two Column)** 📊

**Descripción:** Layout moderno con contenido principal en 2/3 y sidebar en 1/3.

**Estructura:**
```
┌─────────────────────────────────────────────────┐
│  Juan Pérez                    │  ENLACES       │
│  email • teléfono              │  • Website     │
│                                │  • LinkedIn    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │  • GitHub      │
│  Experiencia                   │                │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │  HABILIDADES   │
│  • Puesto 1                    │  [React]       │
│    Empresa • 2020-2023         │  [TypeScript]  │
│    Descripción...              │  [Node.js]     │
│                                │  [Python]      │
│  • Puesto 2                    │                │
│    Empresa • 2018-2020         │  IDIOMAS       │
│    Descripción...              │  • Español     │
│                                │    (Nativo)    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │  • Inglés      │
│  Educación                     │    (Fluido)    │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━  │                │
│  • Título en Campo             │                │
│    Universidad                 │                │
└─────────────────────────────────────────────────┘
```

**Características:**
- ✅ Contenido principal: 66% (2/3)
- ✅ Sidebar derecho: 33% (1/3)
- ✅ Habilidades e idiomas en sidebar
- ✅ Enlaces destacados en sidebar
- ✅ Mejor aprovechamiento del espacio
- ✅ Diseño moderno y profesional

**Uso recomendado:**
- Desarrolladores y diseñadores
- Posiciones creativas
- CVs para startups
- Cuando tienes muchas habilidades técnicas

---

### **3. Con Sidebar (Sidebar Layout)** 🎨

**Descripción:** Layout distintivo con sidebar izquierdo de color y contenido principal a la derecha.

**Estructura:**
```
┌────────────┬────────────────────────────────────┐
│            │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Juan Pérez │  Experiencia Profesional          │
│            │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ email      │                                   │
│ teléfono   │  Senior Developer                 │
│ ubicación  │  Tech Company • 2020 - Presente   │
│            │  Descripción del puesto...        │
│ ─────────  │                                   │
│ ENLACES    │  Full Stack Developer             │
│ • Website  │  Startup Inc • 2018 - 2020        │
│ • LinkedIn │  Descripción del puesto...        │
│ • GitHub   │                                   │
│            │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ ─────────  │  Educación                        │
│ HABILIDADES│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ [React]    │                                   │
│ [TS]       │  Ingeniería en Sistemas           │
│ [Node]     │  Universidad XYZ                  │
│ [Python]   │                                   │
│            │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ ─────────  │  Proyectos                        │
│ IDIOMAS    │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ • Español  │                                   │
│   (Nativo) │  Proyecto Increíble               │
│ • Inglés   │  Descripción del proyecto...      │
│   (Fluido) │                                   │
└────────────┴────────────────────────────────────┘
```

**Características:**
- ✅ Sidebar izquierdo: 33% (1/3) con fondo de color
- ✅ Contenido principal: 66% (2/3)
- ✅ Información personal en sidebar
- ✅ Habilidades e idiomas destacados
- ✅ Diseño muy distintivo y memorable
- ✅ Color de fondo según esquema elegido

**Uso recomendado:**
- Posiciones creativas (diseño, marketing)
- Cuando quieres destacar visualmente
- CVs para industrias modernas
- Portfolios profesionales

---

## 🎨 Personalización por Layout

### **Colores Aplicados:**

**Una Columna:**
- Títulos de sección: Color primario (border-bottom)
- Enlaces: Color primario
- Badges: Fondo claro + texto oscuro

**Dos Columnas:**
- Títulos principales: Color primario (border-bottom)
- Enlaces en sidebar: Color primario
- Badges: Fondo claro + texto oscuro

**Con Sidebar:**
- Fondo del sidebar: Color claro del esquema
- Enlaces en sidebar: Color oscuro del esquema
- Títulos principales: Color primario (border-bottom)
- Badges en sidebar: Fondo blanco + texto oscuro

---

## 📐 Dimensiones

### **Una Columna:**
```css
padding: 48px (3rem)
max-width: 100%
text-align: center (header)
```

### **Dos Columnas:**
```css
display: grid
grid-cols: 2fr 1fr (66% / 33%)
gap: 32px
padding: 48px
```

### **Con Sidebar:**
```css
display: flex
sidebar: width: 33%
content: width: 66%
sidebar-padding: 32px
content-padding: 48px
```

---

## 🔄 Cambio de Layout

El usuario puede cambiar entre layouts en tiempo real desde el formulario de diseño:

```typescript
// En el formulario
<button onClick={() => handleChange('layout', 'two-column')}>
  Dos Columnas
</button>

// En el preview
const renderContent = () => {
  switch (layout) {
    case 'two-column':
      return renderTwoColumnLayout();
    case 'sidebar':
      return renderSidebarLayout();
    default:
      return renderSingleColumnLayout();
  }
};
```

---

## ✨ Ventajas de Cada Layout

### **Una Columna:**
| Ventaja | Descripción |
|---------|-------------|
| 📄 **Tradicional** | Formato familiar y profesional |
| 🖨️ **Imprimible** | Excelente para imprimir |
| 🤖 **ATS-Friendly** | Fácil de parsear por sistemas |
| 📱 **Responsive** | Se adapta bien a móvil |

### **Dos Columnas:**
| Ventaja | Descripción |
|---------|-------------|
| 💼 **Moderno** | Diseño contemporáneo |
| 📊 **Eficiente** | Mejor uso del espacio |
| 👁️ **Escaneable** | Fácil de revisar rápidamente |
| 🎯 **Destacado** | Habilidades visibles |

### **Con Sidebar:**
| Ventaja | Descripción |
|---------|-------------|
| 🎨 **Distintivo** | Muy memorable visualmente |
| 🌈 **Colorido** | Usa el esquema de color |
| 💡 **Creativo** | Ideal para roles creativos |
| ⭐ **Único** | Te diferencia de otros |

---

## 🚀 Implementación Técnica

### **Sin Librerías Externas:**
- ✅ Solo CSS Grid y Flexbox
- ✅ Tailwind CSS para estilos
- ✅ Componentes React nativos
- ✅ Sin dependencias adicionales
- ✅ Rendimiento óptimo

### **Código Limpio:**
```typescript
// Función para renderizar según layout
const renderContent = () => {
  switch (layout) {
    case 'two-column':
      return renderTwoColumnLayout();
    case 'sidebar':
      return renderSidebarLayout();
    default:
      return renderSingleColumnLayout();
  }
};

// Cada layout es una función separada
const renderSingleColumnLayout = () => (
  <div className="single-column">
    {/* Contenido */}
  </div>
);
```

---

## 📝 Resultado Final

Ahora tienes **3 layouts profesionales** completamente funcionales:

1. ✅ **Una Columna** - Tradicional y ATS-friendly
2. ✅ **Dos Columnas** - Moderno y eficiente
3. ✅ **Con Sidebar** - Distintivo y creativo

Todos los layouts:
- ✅ Respetan el esquema de color elegido
- ✅ Aplican la fuente seleccionada
- ✅ Usan el espaciado configurado
- ✅ Ajustan el tamaño de fuente
- ✅ Se actualizan en tiempo real
- ✅ Son completamente responsivos

🎉 **El sistema de diseño está completo!**
