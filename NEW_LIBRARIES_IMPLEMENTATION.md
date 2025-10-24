# Nuevas Librerías Implementadas

## ✅ Librerías Instaladas

```bash
bun add framer-motion react-dropzone @hello-pangea/dnd @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-tooltip @radix-ui/react-popover @radix-ui/react-select
```

### **Instaladas:**
- ✅ **framer-motion** (12.23.24) - Animaciones
- ✅ **react-dropzone** (14.3.8) - Drag & drop de archivos
- ✅ **@hello-pangea/dnd** (18.0.1) - Drag & drop para reordenar
- ✅ **@radix-ui/react-dialog** (1.1.15) - Modales accesibles
- ✅ **@radix-ui/react-dropdown-menu** (2.1.16) - Menús dropdown
- ✅ **@radix-ui/react-tooltip** (1.2.8) - Tooltips
- ✅ **@radix-ui/react-popover** (1.1.15) - Popovers
- ✅ **@radix-ui/react-select** (2.2.6) - Selects accesibles

**Total:** 56 paquetes instalados (incluyendo dependencias)

---

## 🎬 Framer Motion - Animaciones

### **Uso Principal:**
1. Transiciones entre layouts
2. Animaciones al agregar/eliminar items
3. Feedback visual al guardar
4. Hover effects mejorados

### **Implementación Básica:**

```typescript
import { motion, AnimatePresence } from 'framer-motion';

// Animación de entrada/salida
<AnimatePresence mode="wait">
  <motion.div
    key={layout}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {content}
  </motion.div>
</AnimatePresence>

// Animación al agregar item
<motion.div
  initial={{ opacity: 0, height: 0 }}
  animate={{ opacity: 1, height: 'auto' }}
  exit={{ opacity: 0, height: 0 }}
  transition={{ duration: 0.2 }}
>
  {newItem}
</motion.div>

// Hover effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Guardar
</motion.button>
```

### **Casos de Uso en el Editor:**

1. **Cambio de Layout**
```typescript
// En editor-preview.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={design.layout}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.3 }}
  >
    {renderContent()}
  </motion.div>
</AnimatePresence>
```

2. **Agregar/Eliminar Experiencia**
```typescript
// En experience-form.tsx
<AnimatePresence>
  {experiences.map((exp) => (
    <motion.div
      key={exp.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      layout
    >
      <ExperienceCard {...exp} />
    </motion.div>
  ))}
</AnimatePresence>
```

3. **Feedback al Guardar**
```typescript
// En toolbar
<motion.button
  onClick={handleSave}
  animate={isSaving ? { scale: [1, 1.05, 1] } : {}}
  transition={{ repeat: Infinity, duration: 1 }}
>
  {isSaving ? 'Guardando...' : 'Guardar'}
</motion.button>
```

---

## 📸 React Dropzone - Subir Foto

### **Uso Principal:**
Subir foto de perfil con drag & drop

### **Implementación:**

```typescript
import { useDropzone } from 'react-dropzone';

function PhotoUpload({ onPhotoChange }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onload = () => {
        onPhotoChange(reader.result);
      };
      reader.readAsDataURL(file);
    }
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
        isDragActive 
          ? 'border-blue-500 bg-blue-50' 
          : 'border-gray-300 hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Suelta la imagen aquí...</p>
      ) : (
        <div>
          <p>Arrastra tu foto aquí</p>
          <p className="text-sm text-gray-500">o haz click para seleccionar</p>
        </div>
      )}
    </div>
  );
}
```

### **Integración en Personal Info Form:**

```typescript
// En personal-info-form.tsx
<div className="space-y-4">
  <label>Foto de Perfil</label>
  
  {resume.personalInfo.photo ? (
    <div className="relative">
      <img 
        src={resume.personalInfo.photo} 
        alt="Profile" 
        className="w-32 h-32 rounded-full object-cover"
      />
      <button
        onClick={() => onUpdate({ personalInfo: { ...resume.personalInfo, photo: undefined } })}
        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  ) : (
    <PhotoUpload 
      onPhotoChange={(photo) => 
        onUpdate({ personalInfo: { ...resume.personalInfo, photo } })
      }
    />
  )}
</div>
```

---

## 🎯 React Beautiful DnD - Reordenar Items

### **Uso Principal:**
Reordenar experiencias, educación, proyectos, etc.

### **Implementación:**

```typescript
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

function ExperienceList({ experiences, onReorder }) {
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(experiences);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onReorder(items);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="experiences">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-4"
          >
            {experiences.map((exp, index) => (
              <Draggable key={exp.id} draggableId={exp.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`p-4 bg-white rounded-lg border ${
                      snapshot.isDragging ? 'shadow-lg' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                      <div className="flex-1">
                        <h3>{exp.position}</h3>
                        <p className="text-sm text-gray-600">{exp.company}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
```

### **Integración con Framer Motion:**

```typescript
import { motion } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

<Draggable key={exp.id} draggableId={exp.id} index={index}>
  {(provided, snapshot) => (
    <motion.div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={snapshot.isDragging ? 'shadow-2xl' : ''}
    >
      <ExperienceCard {...exp} />
    </motion.div>
  )}
</Draggable>
```

---

## 🎨 Radix UI - Componentes Accesibles

### **1. Dialog (Modal)**

```typescript
import * as Dialog from '@radix-ui/react-dialog';

function DeleteConfirmDialog({ open, onOpenChange, onConfirm }) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
          <Dialog.Title className="text-lg font-semibold mb-2">
            ¿Eliminar experiencia?
          </Dialog.Title>
          <Dialog.Description className="text-gray-600 mb-4">
            Esta acción no se puede deshacer.
          </Dialog.Description>
          
          <div className="flex gap-2 justify-end">
            <Dialog.Close asChild>
              <button className="px-4 py-2 rounded-lg border">
                Cancelar
              </button>
            </Dialog.Close>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg bg-red-600 text-white"
            >
              Eliminar
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
```

### **2. Dropdown Menu**

```typescript
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

function ExperienceActions({ onEdit, onDelete, onDuplicate }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className="p-2 hover:bg-gray-100 rounded">
          <MoreVertical className="w-5 h-5" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content className="bg-white rounded-lg shadow-lg p-1 min-w-[200px]">
          <DropdownMenu.Item
            onClick={onEdit}
            className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            Editar
          </DropdownMenu.Item>
          <DropdownMenu.Item
            onClick={onDuplicate}
            className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer"
          >
            Duplicar
          </DropdownMenu.Item>
          <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
          <DropdownMenu.Item
            onClick={onDelete}
            className="px-3 py-2 hover:bg-red-50 text-red-600 rounded cursor-pointer"
          >
            Eliminar
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
```

### **3. Tooltip**

```typescript
import * as Tooltip from '@radix-ui/react-tooltip';

function TooltipButton({ children, tooltip }) {
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          {children}
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="bg-gray-900 text-white px-3 py-2 rounded text-sm"
            sideOffset={5}
          >
            {tooltip}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

// Uso
<TooltipButton tooltip="Guardar cambios">
  <button>
    <Save className="w-5 h-5" />
  </button>
</TooltipButton>
```

### **4. Popover**

```typescript
import * as Popover from '@radix-ui/react-popover';

function ColorPicker({ value, onChange }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="w-10 h-10 rounded border">
          <div 
            className="w-full h-full rounded" 
            style={{ backgroundColor: value }}
          />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="bg-white rounded-lg shadow-lg p-4">
          <div className="grid grid-cols-5 gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => onChange(color)}
                className="w-8 h-8 rounded border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
```

### **5. Select**

```typescript
import * as Select from '@radix-ui/react-select';

function SkillLevelSelect({ value, onChange }) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="px-3 py-2 border rounded-lg flex items-center justify-between min-w-[150px]">
        <Select.Value placeholder="Selecciona nivel" />
        <Select.Icon>
          <ChevronDown className="w-4 h-4" />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Content className="bg-white rounded-lg shadow-lg overflow-hidden">
          <Select.Viewport className="p-1">
            <Select.Item value="beginner" className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <Select.ItemText>Principiante</Select.ItemText>
            </Select.Item>
            <Select.Item value="intermediate" className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <Select.ItemText>Intermedio</Select.ItemText>
            </Select.Item>
            <Select.Item value="advanced" className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <Select.ItemText>Avanzado</Select.ItemText>
            </Select.Item>
            <Select.Item value="expert" className="px-3 py-2 hover:bg-gray-100 rounded cursor-pointer">
              <Select.ItemText>Experto</Select.ItemText>
            </Select.Item>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
```

---

## 🎯 Plan de Implementación

### **Fase 1: Animaciones Básicas (Hoy)**
- ✅ Instalar librerías
- ⏳ Agregar Framer Motion al preview (cambio de layout)
- ⏳ Animaciones al agregar/eliminar items
- ⏳ Hover effects en botones

### **Fase 2: Foto de Perfil (Mañana)**
- ⏳ Crear componente PhotoUpload con Dropzone
- ⏳ Integrar en PersonalInfoForm
- ⏳ Guardar imagen en base64 o Supabase Storage

### **Fase 3: Drag & Drop (Próximos días)**
- ⏳ Implementar reordenar experiencias
- ⏳ Implementar reordenar educación
- ⏳ Implementar reordenar proyectos
- ⏳ Combinar con Framer Motion

### **Fase 4: Componentes Radix (Siguiente semana)**
- ⏳ Reemplazar modales con Dialog
- ⏳ Agregar Dropdown menus
- ⏳ Agregar Tooltips
- ⏳ Mejorar selects

---

## 📦 Tamaño Total

**Bundle size estimado:**
- Framer Motion: ~60KB
- React Dropzone: ~30KB
- @hello-pangea/dnd: ~40KB
- Radix UI (todos): ~50KB
- **Total:** ~180KB

**Beneficio:** Mejora dramática en UX y accesibilidad

---

## ✅ Próximos Pasos

1. Implementar animaciones con Framer Motion
2. Crear componente de foto de perfil
3. Agregar drag & drop para reordenar
4. Migrar a componentes Radix UI

🚀 **¡Listo para empezar!**
