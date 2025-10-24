# Better Resume - Landing Page Features

## Nuevas Características Implementadas

### 🌓 Modo Oscuro / Claro
- **Toggle de tema** en la navegación con iconos de sol/luna
- **Persistencia** del tema en localStorage
- **Sin flash** al cargar la página (script inline en el head)
- **Transiciones suaves** entre temas
- **Soporte para preferencias del sistema** (prefers-color-scheme)

### ⬆️ Botón Scroll to Top
- **Aparece automáticamente** después de hacer scroll 300px
- **Animación suave** al hacer scroll hacia arriba
- **Diseño adaptable** al tema (claro/oscuro)
- **Posición fija** en la esquina inferior derecha

### 👥 Avatar Circles
- **Componente de avatares** mostrando usuarios activos
- **Contador dinámico** (+99 usuarios)
- **Diseño circular** con overlap de avatares
- **Adaptable al tema** con bordes que cambian según el modo

## Estructura de Componentes

```
src/
├── components/
│   ├── theme-toggle.tsx       # Toggle de tema oscuro/claro
│   ├── scroll-to-top.tsx      # Botón para volver arriba
│   └── ui/
│       └── avatar-circles.tsx # Círculos de avatares
├── lib/
│   └── utils.ts               # Utilidades (cn function)
└── app/
    ├── page.tsx               # Landing page principal
    ├── layout.tsx             # Layout con script de tema
    └── globals.css            # Estilos globales
```

## Tecnologías Utilizadas

- **Next.js 16** - Framework React
- **Tailwind CSS 4** - Estilos con modo oscuro
- **Lucide React** - Iconos modernos
- **TypeScript** - Type safety
- **clsx + tailwind-merge** - Utilidades de clases CSS

## Paleta de Colores

### Modo Claro
- Fondo: `bg-white`
- Texto: `text-black`
- Secundario: `text-gray-600`
- Bordes: `border-gray-200`

### Modo Oscuro
- Fondo: `bg-black`
- Texto: `text-white`
- Secundario: `text-gray-400`
- Bordes: `border-white/10`

## Uso

### Cambiar Tema
El usuario puede cambiar entre modo claro y oscuro haciendo clic en el botón de sol/luna en la navegación.

### Scroll to Top
El botón aparece automáticamente cuando el usuario hace scroll hacia abajo y desaparece cuando está en la parte superior.

### Avatares
Los avatares se muestran debajo del texto "Usado cada día por miles de profesionales" en la sección hero.
