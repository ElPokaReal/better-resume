# View Transitions Nativas - Better Resume

## 🚀 Implementación con View Transitions API Nativa

Este proyecto usa la **View Transitions API** nativa del navegador para transiciones fluidas y performantes entre páginas.

## 🎬 Transiciones Implementadas

### **1. Transición Global de Páginas** (`template.tsx`)
- **Ubicación**: `src/app/template.tsx`
- **Efecto**: Fade + Slide vertical
- **Duración**: 300ms
- **Easing**: Cubic bezier [0.22, 1, 0.36, 1] (easeOutExpo)

```tsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
```

### **2. Animaciones en Login/Signup**

#### **Stagger Animation (Cascada)**
Los elementos aparecen secuencialmente con un delay de 100ms entre cada uno:

1. **Logo y título** (primer elemento)
2. **Formulario** (segundo elemento)
3. **Link "Volver al inicio"** (tercer elemento)

#### **Variantes de Animación**

**Container:**
```tsx
hidden: { opacity: 0 }
visible: { 
  opacity: 1,
  staggerChildren: 0.1,
  delayChildren: 0.1
}
```

**Items:**
```tsx
hidden: { opacity: 0, y: 20 }
visible: { 
  opacity: 1, 
  y: 0,
  duration: 0.5
}
```

### **3. Microinteracciones**

#### **Logo Hover/Tap**
```tsx
whileHover={{ scale: 1.1, rotate: 5 }}
whileTap={{ scale: 0.95 }}
transition={{ type: 'spring', stiffness: 400, damping: 17 }}
```

- **Hover**: Escala 110% + rotación 5°
- **Tap**: Escala 95% (feedback táctil)
- **Transición**: Spring physics para movimiento natural

## 🎨 Características de las Transiciones

### **Timing Functions**
- **easeOutExpo**: `[0.22, 1, 0.36, 1]` - Salida rápida, llegada suave
- **Spring**: Física realista con rebote sutil

### **Durations**
- **Transición de página**: 300ms
- **Animación de items**: 500ms
- **Stagger delay**: 100ms entre elementos

### **Effects**
- ✅ **Fade In/Out** - Opacidad 0 → 1
- ✅ **Slide Up** - Desplazamiento vertical 20px
- ✅ **Scale** - Zoom sutil 98% → 100%
- ✅ **Rotate** - Rotación en hover del logo
- ✅ **Stagger** - Aparición secuencial de elementos

## 🚀 Flujo de Navegación

### **Login → Signup**
1. Página Login hace fade out + slide up
2. Delay de 100ms
3. Página Signup hace fade in + slide down
4. Elementos aparecen en cascada (stagger)

### **Signup → Login**
1. Página Signup hace fade out + slide up
2. Delay de 100ms
3. Página Login hace fade in + slide down
4. Elementos aparecen en cascada (stagger)

## 📱 Experiencia de Usuario

### **Beneficios**
- ✅ **Continuidad visual** - Las transiciones conectan las páginas
- ✅ **Feedback inmediato** - El usuario sabe que algo está pasando
- ✅ **Jerarquía clara** - Los elementos importantes aparecen primero
- ✅ **Sensación premium** - Movimientos suaves y naturales
- ✅ **Reducción de carga cognitiva** - Cambios graduales vs. instantáneos

### **Performance**
- ✅ Animaciones GPU-accelerated (transform, opacity)
- ✅ No hay layout shifts
- ✅ Duración optimizada (< 500ms)
- ✅ Easing functions eficientes

## 🔧 Personalización

### **Cambiar la duración**
```tsx
// En template.tsx o en las páginas
transition={{ duration: 0.4 }} // Más lento
transition={{ duration: 0.2 }} // Más rápido
```

### **Cambiar el easing**
```tsx
// Más suave
ease: [0.25, 0.1, 0.25, 1]

// Más rápido al inicio
ease: [0.4, 0, 0.2, 1]

// Linear
ease: "linear"
```

### **Desactivar stagger**
```tsx
// Remover staggerChildren y delayChildren del containerVariants
visible: {
  opacity: 1,
  // Sin stagger
}
```

## 📚 Recursos

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Easing Functions](https://easings.net/)
- [Animation Principles](https://material.io/design/motion/understanding-motion.html)

## 🎯 Mejoras Futuras

- [ ] Transiciones específicas por ruta (diferentes animaciones para diferentes páginas)
- [ ] Shared element transitions (elementos que se mueven entre páginas)
- [ ] Gesture-based navigation (swipe para cambiar de página)
- [ ] Loading states animados
- [ ] Skeleton screens con transiciones
