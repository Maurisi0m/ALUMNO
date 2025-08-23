# Fusion Starter

Una plantilla de aplicación React full-stack lista para producción con servidor Express integrado, que incluye React Router 6 en modo SPA, TypeScript, Vitest, Zod y herramientas modernas.

Aunque el starter viene con un servidor express, solo crea endpoints cuando sea estrictamente necesario, por ejemplo para encapsular lógica que debe permanecer en el servidor, como el manejo de claves privadas, u operaciones de BD específicas, etc...

## Stack Tecnológico

- **Frontend**: React 18 + React Router 6 (spa) + TypeScript + Vite + TailwindCSS 3
- **Backend**: Servidor Express integrado con servidor de desarrollo Vite
- **Pruebas**: Vitest
- **UI**: Radix UI + TailwindCSS 3 + iconos Lucide React

## Estructura del Proyecto

```
client/                   # Frontend React SPA
├── pages/                # Componentes de rutas (Index.tsx = inicio)
├── components/ui/        # Biblioteca de componentes UI preconfigurados
├── App.tsx              # Punto de entrada de la aplicación con configuración de rutas SPA
└── global.css           # Temas de TailwindCSS 3 y estilos globales

server/                   # Backend API Express
├── index.ts             # Configuración principal del servidor (express config + rutas)
└── routes/              # Manejadores de API

shared/                   # Tipos usados por cliente y servidor
└── api.ts               # Ejemplo de cómo compartir interfaces de api
```

## Características Principales

## Sistema de Rutas SPA

El sistema de rutas está impulsado por React Router 6:

- `client/pages/Index.tsx` representa la página de inicio.
- Las rutas se definen en `client/App.tsx` usando la importación `react-router-dom`
- Los archivos de rutas se ubican en el directorio `client/pages/`

Por ejemplo, las rutas se pueden definir con:

```typescript
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* AGREGAR TODAS LAS RUTAS PERSONALIZADAS ARRIBA DE LA RUTA CATCH-ALL "*" */}
  <Route path="*" element={<NotFound />} />
</Routes>;
```

### Sistema de Estilos

- **Primario**: Clases utilitarias TailwindCSS 3
- **Tema y tokens de diseño**: Configurar en `client/global.css`
- **Componentes UI**: Biblioteca preconfigurada en `client/components/ui/`
- **Utilidad**: La función `cn()` combina `clsx` + `tailwind-merge` para clases condicionales

```typescript
// uso de utilidad cn
className={cn(
  "clases-base",
  { "clase-condicional": condicion },
  props.className  // Sobrescribir por el usuario
)}
```

### Integración del Servidor Express

- **Desarrollo**: Un solo puerto (8080) para frontend/backend
- **Recarga en caliente**: Tanto código cliente como servidor
- **Endpoints API**: Con prefijo `/api/`

#### Ejemplos de Rutas API

- `GET /api/ping` - API ping simple
- `GET /api/demo` - Endpoint de demostración

### Tipos Compartidos

Importar tipos consistentes tanto en cliente como servidor:

```typescript
import { DemoResponse } from "@shared/api";
```

Alias de rutas:

- `@shared/*` - Carpeta compartida
- `@/*` - Carpeta cliente

## Comandos de Desarrollo

```bash
npm run dev        # Iniciar servidor de desarrollo (cliente + servidor)
npm run build      # Build de producción
npm run start      # Iniciar servidor de producción
npm run typecheck  # Validación TypeScript
npm test          # Ejecutar pruebas Vitest
```

## Agregar Características

### Agregar nuevos colores al tema

Abre `client/global.css` y `tailwind.config.ts` y agrega nuevos colores tailwind.

### Nueva Ruta API

1. **Opcional**: Crear una interfaz compartida en `shared/api.ts`:

```typescript
export interface MiRutaResponse {
  mensaje: string;
  // Agregar otras propiedades de respuesta aquí
}
```

2. Crear un nuevo manejador de ruta en `server/routes/mi-ruta.ts`:

```typescript
import { RequestHandler } from "express";
import { MiRutaResponse } from "@shared/api"; // Opcional: para seguridad de tipos

export const manejarMiRuta: RequestHandler = (req, res) => {
  const respuesta: MiRutaResponse = {
    mensaje: "¡Hola desde mi endpoint!",
  };
  res.json(respuesta);
};
```

3. Registrar la ruta en `server/index.ts`:

```typescript
import { manejarMiRuta } from "./routes/mi-ruta";

// Agregar a la función createServer:
app.get("/api/mi-endpoint", manejarMiRuta);
```

4. Usar en componentes React con seguridad de tipos:

```typescript
import { MiRutaResponse } from "@shared/api"; // Opcional: para seguridad de tipos

const respuesta = await fetch("/api/mi-endpoint");
const datos: MiRutaResponse = await respuesta.json();
```

### Nueva Ruta de Página

1. Crear componente en `client/pages/MiPagina.tsx`
2. Agregar ruta en `client/App.tsx`:

```typescript
<Route path="/mi-pagina" element={<MiPagina />} />
```

## Despliegue de Producción

- **Estándar**: `npm run build` + `npm start`
- **Binario**: Ejecutables autocontenidos (Linux, macOS, Windows)
- **Despliegue en la Nube**: Usar Netlify o Vercel a través de sus integraciones MCP para un despliegue fácil. Ambos proveedores funcionan bien con esta plantilla starter.

## Notas de Arquitectura

- Desarrollo en un solo puerto con integración Vite + Express
- TypeScript en todo (cliente, servidor, compartido)
- Recarga en caliente completa para desarrollo rápido
- Listo para producción con múltiples opciones de despliegue
- Biblioteca completa de componentes UI incluida
- Comunicación API con seguridad de tipos mediante interfaces compartidas

## Estructura Detallada del Directorio Client


# Estructura del Directorio Client

## Componentes Principales
- App.tsx - Punto de entrada y configuración de rutas
- global.css - Estilos globales y configuración de TailwindCSS
- vite-env.d.ts - Declaraciones de tipos para Vite

## Páginas (pages/)
- Dashboard.tsx - Panel principal del estudiante
- Index.tsx - Página de inicio
- Login.tsx - Página de autenticación
- Manual.tsx - Manual de usuario
- NotFound.tsx - Página 404
- Placeholder.tsx - Plantilla para secciones en desarrollo

## Componentes UI (components/ui/)
### Elementos Básicos
- button.tsx - Botones estilizados
- input.tsx - Campos de entrada
- input-otp.tsx - Campos de entrada OTP
- checkbox.tsx - Casillas de verificación
- select.tsx - Menús desplegables
- textarea.tsx - Áreas de texto
- label.tsx - Etiquetas para formularios
- form.tsx - Componentes de formulario
- radio-group.tsx - Grupos de radio buttons
- switch.tsx - Interruptores
- slider.tsx - Controles deslizantes
- toggle.tsx - Botones de alternancia
- toggle-group.tsx - Grupos de botones de alternancia

### Elementos de Navegación
- navigation-menu.tsx - Menú de navegación
- sidebar.tsx - Barra lateral
- tabs.tsx - Pestañas
- breadcrumb.tsx - Migas de pan
- menubar.tsx - Barra de menú
- pagination.tsx - Paginación
- command.tsx - Paleta de comandos
- context-menu.tsx - Menú contextual
- dropdown-menu.tsx - Menú desplegable

### Elementos de Feedback
- toast.tsx - Notificaciones emergentes
- toaster.tsx - Contenedor de notificaciones
- sonner.tsx - Notificaciones mejoradas
- alert.tsx - Alertas
- alert-dialog.tsx - Diálogos de alerta
- progress.tsx - Barras de progreso
- loading.tsx - Indicadores de carga
- loading-link.tsx - Enlaces con estado de carga
- skeleton.tsx - Esqueletos de carga

### Elementos de Layout
- card.tsx - Tarjetas
- dialog.tsx - Diálogos modales
- drawer.tsx - Paneles laterales
- sheet.tsx - Hojas deslizantes
- popover.tsx - Ventanas emergentes
- hover-card.tsx - Tarjetas flotantes
- collapsible.tsx - Contenido plegable
- accordion.tsx - Acordeones
- separator.tsx - Separadores
- aspect-ratio.tsx - Control de relación de aspecto
- scroll-area.tsx - Áreas de desplazamiento
- resizable.tsx - Elementos redimensionables

### Elementos de Datos
- table.tsx - Tablas
- calendar.tsx - Calendarios
- chart.tsx - Gráficos

### Elementos de Presentación
- avatar.tsx - Avatares de usuario
- badge.tsx - Insignias
- tooltip.tsx - Información emergente
- settings-panel.tsx - Panel de configuración
- carousel.tsx - Carruseles

### Utilidades UI
- use-toast.ts - Hook para notificaciones

## Hooks Personalizados (hooks/)
- use-i18n.tsx - Internacionalización
- use-loading.tsx - Estado de carga global
- use-mobile.tsx - Detección de dispositivos móviles
- use-toast.ts - Gestión de notificaciones
- use-user.tsx - Gestión de datos de usuario

## Utilidades (lib/)
- utils.ts - Funciones de utilidad
- utils.spec.ts - Pruebas para utilidades
```
