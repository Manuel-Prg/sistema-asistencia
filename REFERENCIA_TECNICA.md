# ⚡ Referencia Rápida Técnica

## 📂 Estructura de Archivos Clave

```
src/
├── app/
│   ├── api/active-students/route.ts      ← API para estudiantes activos
│   ├── login/page.tsx                     ← Página de login
│   ├── student/
│   │   ├── actions.ts                     ← checkIn(), checkOut(), signOut()
│   │   ├── page.tsx                       ← Dashboard estudiante
│   │   └── layout.tsx                     ← Layout + auth + navbar
│   └── supervisor/
│       ├── actions.ts                     ← forceCheckOut(), auto-close, adjust
│       ├── page.tsx                       ← Dashboard supervisor
│       └── layout.tsx                     ← Layout + auth + navbar
├── components/
│   ├── student/
│   │   ├── check-in-out-card.tsx          ← Check-in/out UI
│   │   ├── progress-card.tsx              ← Progreso visual
│   │   ├── attendance-history.tsx         ← Historial
│   │   ├── early-departure-dialog.tsx     ← Salida temprana
│   │   └── student-nav.tsx                ← Navbar estudiante
│   ├── supervisor/
│   │   ├── stats-cards.tsx                ← 4 estadísticas
│   │   ├── active-students.tsx            ← Lista de activos
│   │   ├── admin-checkout-dialog.tsx      ← Forzar salida
│   │   ├── auto-close-button.tsx          ← Auto-cerrar
│   │   ├── recent-activity.tsx            ← Actividad reciente
│   │   ├── export-button.tsx              ← Exportar (WIP)
│   │   └── supervisor-nav.tsx             ← Navbar supervisor
│   └── ui/                                ← Componentes base (Radix UI)
├── lib/
│   ├── utils.ts                           ← cn() para CSS
│   ├── supabase/
│   │   ├── client.ts                      ← Cliente browser
│   │   ├── server.ts                      ← Cliente server
│   │   ├── admin.ts                       ← Cliente admin
│   │   ├── types.ts                       ← Interfaces TypeScript
│   │   └── middleware-helper.ts           ← (si existe)
│   └── utils/
│       └── date-formatter.ts              ← Formateo de fechas
├── middleware.ts                          ← Auth middleware
└── package.json                           ← Dependencias
```

---

## 🎯 Funciones Principales

### Autenticación
```typescript
// middleware.ts
- Valida user en cada request
- Redirige según rol
- Protege /student y /supervisor
```

### Estudiante
```typescript
// checkIn(room, shift)
- Crea registro en attendance_records
- Valida: no hay entrada activa
- Retorna: { success: true } | { error }

// checkOut(reason?)
- Calcula horas = checkOut - checkIn
- Actualiza registro
- Retorna: { success, hoursWorked }

// signOut()
- Cierra sesión
```

### Supervisor
```typescript
// forceCheckOut(recordId, reason)
- Cierra registro manualmente
- CAP: máximo 10 horas
- Retorna: { success, hoursWorked, wasCapped }

// autoCloseOldRecords()
- Busca registros >24 horas
- Cierra con 4 horas
- Retorna: { success, closed, message }

// capLongSessions()
- Busca registros activos >10 horas
- Cierra a exactamente 10 horas
- Retorna: { success, capped, message }

// adjustStudentHours(studentId, hoursAdjustment, reason)
- Suma/resta horas manualmente
- Crea registro de auditoría
- Solo supervisores
```

### API
```typescript
// GET /api/active-students
- Retorna estudiantes sin check_out
- Cache: siempre fresco
- Usado por: login cada 30s
```

---

## 📊 Tipos de Datos

```typescript
// Roles
type UserRole = "student" | "supervisor"

// Tipos de programa
type StudentType = "servicio_social" | "practicas"

// Turnos
type ShiftType = "matutino" | "vespertino"

// Interfaces clave
interface Profile {
  id: string              // UUID
  email: string
  full_name: string
  role: UserRole
  created_at: string
}

interface Student {
  id: string
  student_type: StudentType
  required_hours: number
  assigned_room: string
  accumulated_hours: number
  created_at: string
}

interface AttendanceRecord {
  id: string
  student_id: string
  check_in: string        // ISO 8601
  check_out: string | null
  shift: ShiftType
  room: string
  hours_worked: number | null
  early_departure_reason: string | null
  created_at: string
}
```

---

## 🗄️ Base de Datos

### Tablas

```sql
-- Perfiles (relación con auth.users)
profiles:
  - id UUID PK
  - email TEXT
  - full_name TEXT
  - role TEXT
  - created_at TIMESTAMP

-- Estudiantes
students:
  - id UUID PK
  - student_type TEXT
  - required_hours DECIMAL
  - assigned_room TEXT
  - accumulated_hours DECIMAL
  - created_at TIMESTAMP

-- Asistencia
attendance_records:
  - id UUID PK
  - student_id UUID FK
  - check_in TIMESTAMP
  - check_out TIMESTAMP (nullable)
  - shift TEXT
  - room TEXT
  - hours_worked DECIMAL (nullable)
  - early_departure_reason TEXT (nullable)
  - created_at TIMESTAMP

-- Triggers automáticos:
✓ INSERT/UPDATE attendance_records
  → Calcula hours_worked
  → Suma a students.accumulated_hours
```

### Relaciones RLS

```
Students (Row Level Security):
✓ SELECT: Propios registros + supervisores ven todos
✓ INSERT: CHECK (user_id = auth.uid())
✓ UPDATE: RESTRICT a propios registros
✓ DELETE: RESTRICT a propios registros

Attendance Records:
✓ SELECT: Solo propios + supervisores ven todos
✓ INSERT: CHECK (student_id = auth.uid())
✓ UPDATE: Solo si check_out NULL
✓ DELETE: RESTRICT
```

---

## 🔌 Clientes Supabase

```typescript
// Browser (componentes client)
getSupabaseBrowserClient()
  ├─ Singleton
  ├─ Keys: PUBLIC
  └─ Tipo: createBrowserClient

// Server (server components/actions)
getSupabaseServerClient()
  ├─ Maneja cookies
  ├─ Keys: PUBLIC (en contexto seguro)
  └─ Tipo: createServerClient

// Admin (backend)
getSupabaseAdminClient()
  ├─ Solo backend
  ├─ Keys: SERVICE_ROLE
  └─ Tipo: createClient
```

---

## 🎨 Componentes Principales

### Student
```
CheckInOutCard
├─ Estados: input mode vs active mode
├─ Lógica: valida >3 horas
└─ Dialog: salida temprana <3h

ProgressCard
├─ Barra progreso
├─ Estadísticas en grid
└─ Mensajes motivacionales

AttendanceHistory
├─ Últimos 10 registros
├─ Formatos: fecha, hora, lugar
└─ Indica completo/incompleto
```

### Supervisor
```
StatsCards
├─ Total, Activos, Horas Hoy, Promedio
└─ 4 tarjetas con íconos

ActiveStudents
├─ Color: verde/amarillo/rojo por horas
├─ Acciones: forzar salida
└─ Alertas: >10h y >24h

AdminCheckoutDialog
├─ Información estudiante
├─ Aviso si >10h
└─ Campo motivo

AutoCloseButton
├─ Dropdown con 2 opciones
├─ Limitar a 10h
└─ Cerrar >24h
```

---

## 🔐 Seguridad

```
Autenticación:
✓ Supabase Auth + JWT
✓ Cookies seguras (httpOnly)
✓ Middleware valida cada request

Autorización:
✓ RLS en BD
✓ Verificación de rol en actions
✓ Usuarios no pueden editar otros

Secretos:
✓ Variables de entorno
✓ SERVICE_ROLE_KEY nunca en frontend
✓ Keys públicas en contexto seguro

Auditoría:
✓ Todos los cambios en attendance_records
✓ Motivos siempre se guardan
✓ Supervisores pueden auditar
```

---

## 📱 Responsive

```
Breakpoints:
- sm: 640px   (tablets)
- md: 768px   (tablets grandes)
- lg: 1024px  (desktops)
- xl: 1280px  (desktops grandes)

Estrategia:
✓ Mobile-first en Tailwind
✓ Componentes adaptativos
✓ Grid responsivo
✓ Oculta/muestra según pantalla
```

---

## ⚡ Optimizaciones

```
Next.js:
✓ App Router
✓ Server Components (default)
✓ Server Actions
✓ RevalidatePath() selectivo

Supabase:
✓ Singleton clients
✓ Reuso de instancias
✓ RLS en BD

UI:
✓ Tailwind CSS (PurgeCSS)
✓ Radix UI (accesible)
✓ Dark mode automático
✓ Responsive mobile-first

Rendimiento:
✓ Code splitting automático
✓ Image optimization
✓ Font optimization (Geist)
```

---

## 🔄 Flujos de Datos

### Check-In
```
UI (CheckInOutCard)
  ↓ handleCheckIn()
  ↓ checkIn(room, shift)        [Server Action]
  ↓ supabase.attendance_records.insert()
  ↓ revalidatePath('/student')
  ↓ trigger actualiza accumulated_hours
  ↓ UI refresca
  ↓ muestra CheckOut
```

### Check-Out (Normal)
```
UI (CheckInOutCard)
  ↓ handleCheckOut()
  ↓ valida horas >= 3
  ↓ checkOut()                  [Server Action]
  ↓ supabase.attendance_records.update()
    ├─ check_out = now
    ├─ hours_worked = (co - ci) / (1000*60*60)
    └─ si < 3: earlyDepartureReason
  ↓ trigger suma accumulated_hours
  ↓ revalidatePath('/student')
  ↓ UI refresca
```

### Forzar Salida (Supervisor)
```
UI (AdminCheckoutDialog)
  ↓ handleForceCheckout()
  ↓ forceCheckOut(recordId, reason)  [Server Action]
  ↓ supabase.getRecord(recordId)
  ↓ calcula horas = min(elapsed, 10)
  ↓ supabase.update()
    ├─ check_out = now
    ├─ hours_worked = horas
    └─ early_departure_reason = reason
  ↓ trigger suma accumulated_hours
  ↓ revalidatePath('/supervisor')
  ↓ router.refresh()
  ↓ dialog se cierra
  ↓ lista actualiza
```

---

## 🧪 Testing (Recomendaciones)

```
Casos a probar:

✓ Login/logout
✓ Check-in sin entrada activa
✓ No permite múltiples entradas
✓ Check-out normal (>=3h)
✓ Check-out temprano (<3h) → dialog motivo
✓ Horas se suman correctamente
✓ Máximo 10h se respeta
✓ Auto-cierre tras 24h
✓ Supervisor puede forzar salida
✓ Supervisor puede ajustar horas
✓ Middlewares redirige correctamente
✓ RLS: estudiante solo ve sus datos
✓ RLS: supervisor ve todos
✓ Cambio de tema oscuro/claro
✓ Responsivo en móvil/tablet/desktop
✓ Toasts aparecen correctamente
✓ Refresco de datos actualiza
```

---

## 🚀 Deployment

```
Hosting: Vercel (Next.js)
Backend: Supabase
Variables:
  ├─ NEXT_PUBLIC_SUPABASE_URL
  ├─ NEXT_PUBLIC_SUPABASE_ANON_KEY
  └─ SUPABASE_SERVICE_ROLE_KEY

Build:
  npm run build

Start:
  npm start

Dev:
  npm run dev
```

---

## 📚 Documentación Relacionada

```
DOCUMENTACION.md
  └─ Guía completa y detallada

FUNCIONES_RESUMEN.md
  └─ Resumen rápido de cada función

GUIA_DE_USO.md
  └─ Manual para usuarios

README.md (este archivo)
  └─ Referencia rápida técnica
```

---

## 🔗 Dependencias Clave

```
Framework:
├─ next@15.2.4
├─ react@18.3.1
└─ typescript@5

Supabase:
├─ @supabase/supabase-js
├─ @supabase/ssr
├─ @supabase/auth-helpers-nextjs

UI:
├─ @radix-ui/* (35+ componentes)
├─ tailwindcss@4.1.9
├─ lucide-react (íconos)

Utilidades:
├─ date-fns (fechas)
├─ react-hook-form (formularios)
├─ zod (validación)
├─ sonner (toasts)
├─ next-themes (temas)

Desarrollo:
├─ @types/node
├─ @types/react
├─ typescript
└─ autoprefixer
```

---

## 🐛 Debug

```
Middleware issues:
  → Revisar logs en Vercel
  → Verificar .env variables
  → Cookies se guardan correctamente?

Auth issues:
  → Verificar Supabase RLS policies
  → Check JWT token en Application > Cookies
  → getUser() retorna null?

Data issues:
  → Revisar BD schema en Supabase
  → Triggers se ejecutan?
  → RLS permite las operaciones?

UI issues:
  → Responsive: test en DevTools
  → Dark mode: check en inspector
  → Toast: console.log de sonner

Performance:
  → Next.js analytics en console
  → Lighthouse para métricas
  → Network en DevTools
```

---

## 📖 Convenciones Usadas

```
Naming:
✓ snake_case en variables
✓ camelCase en funciones
✓ PascalCase en componentes React
✓ UPPERCASE en constantes

Carpetas:
✓ app/: Pages y layouts (App Router)
✓ components/: Componentes React
✓ lib/: Utilidades y clientes
✓ public/: Archivos estáticos

Archivos:
✓ .tsx: React components
✓ .ts: Utilidades, types, actions
✓ page.tsx: Page components
✓ layout.tsx: Layout components
✓ route.ts: API routes

Comentarios:
✓ /** JSDoc */ antes de funciones
✓ // Explicación rápida inline
✓ ✓ Para features implementadas
✓ ⏳ Para features en desarrollo
```

---

**Última actualización:** 15 de noviembre de 2024

