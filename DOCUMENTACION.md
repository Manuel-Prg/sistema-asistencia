# 📚 Documentación del Sistema de Asistencia para Estudiantes

## 📋 Descripción General

Sistema integral de gestión de asistencia para estudiantes de servicio social y prácticas profesionales. Permite que estudiantes registren su entrada/salida y que supervisores monitoreen la asistencia en tiempo real.

---

## 🗂️ Estructura del Proyecto

```
sistema-asistencia/
├── app/
│   ├── api/
│   ├── login/
│   ├── student/
│   ├── supervisor/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── student/
│   ├── supervisor/
│   └── ui/
├── lib/
│   ├── supabase/
│   └── utils/
├── public/
├── scripts/
└── styles/
```

---

## 🔐 Autenticación y Seguridad

### **middleware.ts**
```typescript
/**
 * Middleware de autenticación y autorización
 * - Verifica credenciales de usuario
 * - Redirige según rol (student/supervisor)
 * - Protege rutas privadas
 * - Maneja cookies de sesión
 */
```

**Funcionalidades principales:**
- ✅ Obtiene usuario autenticado de Supabase
- ✅ Verifica acceso a rutas protegidas (/student, /supervisor)
- ✅ Redirige a login si no está autenticado
- ✅ Valida rol del usuario para acceso correcto
- ✅ Maneja refresh de tokens automáticamente
- ✅ Protege contra bucles de redirección (Perfil incompleto)

---

## 🔐 Recuperación de Contraseña

### **Flujo Completo**
1. **Solicitud (/forgot-password):**
   - Usuario ingresa correo
   - Sistema genera link de recuperación
   - Se envía correo vía Supabase (plantilla personalizada)
2. **Redirección (/auth/callback):**
   - Valida el token del correo
   - Intercambia código por sesión
   - Redirige a formulario de cambio
3. **Cambio (/reset-password):**
   - Usuario ingresa nueva contraseña
   - `updateUser` actualiza credenciales
   - Redirige al login con éxito

---

## 🔓 Página de Login

### **app/login/page.tsx**
```typescript
/**
 * Página de inicio de sesión con visualización de estudiantes activos
 * - Formulario de login (email/contraseña)
 * - Muestra lista actualizada de estudiantes activos
 * - Refresca datos cada 30 segundos
 * - Interfaz responsiva y moderna
 */
```

**Características:**
- 📧 Login con email y contraseña via Supabase
- 👥 Panel de "Estudiantes Activos" actualizado en tiempo real
- 🔄 Auto-refresco cada 30 segundos
- 🎨 Interfaz moderna con gradientes y animaciones
- 📱 Diseño completamente responsivo

**Estado:**
```typescript
- email: string              // Email del usuario
- password: string           // Contraseña
- loading: boolean          // Estado de envío
- error: string | null      // Mensajes de error
- activeStudents: array     // Lista de estudiantes activos
```

---

## 👨‍🎓 Módulo Estudiante

### **app/student/page.tsx**
```typescript
/**
 * Dashboard principal del estudiante
 * - Visualiza progreso de horas acumuladas
 * - Permite registrar entrada/salida
 * - Muestra historial de asistencias
 * - Datos en tiempo real desde Supabase
 */
```

**Componentes utilizados:**
- `ProgressCard`: Muestra avance de horas vs requeridas
- `CheckInOutCard`: Formulario de entrada/salida
- `AttendanceHistory`: Historial de últimos 10 registros

**Datos cargados:**
- Perfil del estudiante
- Entrada activa (si existe)
- Últimos 10 registros de asistencia

**Manejo de Errores:**
- Detecta si el usuario no tiene perfil de estudiante
- Muestra pantalla de "Perfil Incompleto"
- Ofrece botón de cierre de sesión para evitar bucles infinitos y permitir reintentar con otra cuenta

---

### **app/student/actions.ts**
```typescript
/**
 * Acciones de servidor para operaciones del estudiante
 * Todas las funciones son 'Server Actions' de Next.js
 */

// checkIn(room, shift)
/**
 * Registra entrada del estudiante
 * @param room - Sala donde trabajará (Ej: "Sala 1", "Sala 2")
 * @param shift - Turno ("matutino" | "vespertino")
 * @returns { success: true } o { error: "mensaje" }
 * 
 * Validaciones:
 * - Verifica que no haya entrada activa
 * - Registra check_in con timestamp actual
 * - Revalida página automáticamente
 */

// checkOut(earlyDepartureReason?)
/**
 * Registra salida del estudiante
 * @param earlyDepartureReason - Motivo si es salida temprana
 * @returns { success: true, hoursWorked: number } o { error: "mensaje" }
 * 
 * Lógica:
 * - Busca registro activo sin check_out
 * - Calcula horas trabajadas
 * - Guarda hora de salida y horas en DB
 * - Revalida página automáticamente
 */

// signOut()
/**
 * Cierra sesión del usuario
 * - Limpia autenticación en Supabase
 * - Redirige a página de login
 */
```

---

### **components/student/check-in-out-card.tsx**
```typescript
/**
 * Tarjeta interactiva de registro de entrada/salida
 * - Interfaz para marcar entrada
 * - Interfaz para marcar salida (si hay entrada activa)
 * - Dialog para salida temprana (<3 horas)
 * - Mostrador de sala y turno
 */

// Estados:
- shift: "matutino" | "vespertino"   // Turno seleccionado
- room: string                        // Sala seleccionada
- loading: boolean                    // Procesando acción
- message: { type, text }             // Mensaje feedback
- showEarlyDepartureDialog: boolean   // Dialogo visible

// Salas disponibles:
["Sala 1", "Sala 2", "Sala 2 y Galería", "Sala 3", 
 "Sala 4", "Sala 4 y 5", "Todas", "Site"]

// Turnos:
- Matutino: 11:00 - 14:00
- Vespertino: 14:00 - 18:00

// Validaciones:
✅ Mínimo 3 horas de turno
✅ No permite múltiples entradas activas
✅ Usa date-fns para formateo de fechas
```

---

### **components/student/progress-card.tsx**
```typescript
/**
 * Tarjeta de progreso visual
 * - Barra de progreso animada
 * - Muestra horas acumuladas vs requeridas
 * - Porcentaje de avance
 * - Badges informativos
 */

// Props:
interface ProgressCardProps {
  accumulatedHours: number      // Horas completadas
  requiredHours: number         // Horas requeridas
  studentType: "servicio_social" | "practicas"
}

// Cálculos:
- percentage = (accumulated / required) * 100
- remainingHours = Math.max(required - accumulated, 0)
- isComplete = percentage >= 100

// Visualización:
📊 Barra de progreso con degradado
🎯 Horas restantes en panel separado
📈 Porcentaje de avance
🎉 Mensaje especial si está completo
```

---

### **components/student/attendance-history.tsx**
```typescript
/**
 * Historial de últimas asistencias (máximo 10)
 * - Lista de registros con fecha, hora, sala
 * - Indica horas trabajadas
 * - Muestra motivos de salida temprana
 * - Estado actual si hay entrada activa
 */

// Para cada registro muestra:
📅 Fecha completa (formato es-MX)
⏰ Hora entrada - salida
☀️/🌙 Turno (matutino/vespertino)
📍 Sala
⏱️ Horas trabajadas
⚠️ Motivo salida temprana (si aplica)
🟢 Estado: Completo/Incompleto/En curso

// Estilos condicionales:
- Verde: Completo (≥4 horas)
- Amarillo: Incompleto (<4 horas)
- Emerald: En curso
```

---

## 👔 Módulo Supervisor

### **app/supervisor/page.tsx**
```typescript
/**
 * Dashboard principal del supervisor
 * - Estadísticas generales del sistema
 * - Estudiantes activos en tiempo real
 * - Actividad reciente de asistencias
 * - Datos actualizados cada solicitud
 */

// Métricas mostradas:
- Total de estudiantes registrados
- Estudiantes activos AHORA
- Horas de trabajo acumuladas HOY
- Progreso promedio de todos los estudiantes

// Componentes:
- StatsCards: 4 tarjetas de métricas
- ActiveStudents: Lista de estudiantes en turno
- RecentActivity: Últimos 10 registros cerrados
```

---

### **app/supervisor/actions.ts**
```typescript
/**
 * Acciones administrativas del supervisor
 * Gestión de registros y horas
 * Creación de nuevos usuarios (Supervisor)
 */

// createNewUser(data)
/**
 * Crea nuevo usuario estudiante o supervisor
 * - Usa `admin.createUser` de Supabase
 * - Fuerza `email_confirm: false` para respetar flujo de seguridad
 * - Dispara explícitamente `auth.resend({ type: 'signup' })` para garantizar entrega del correo
 * - Crea perfil y registros asociados
 */

// signOut()
/**
 * Cierra sesión del supervisor
 */

// forceCheckOut(recordId, reason)
/**
 * 🔴 ACCIÓN IMPORTANTE: Fuerza salida manual
 * @param recordId - ID del registro a cerrar
 * @param reason - Motivo de la salida forzada
 * 
 * Lógica:
 * - Obtiene registro activo
 * - Calcula horas desde check_in hasta ahora
 * - CAP: Máximo 10 horas diarias
 * - Actualiza registro con check_out forzado
 * - Trigger automático actualiza accumulated_hours
 * 
 * Retorna:
 * { success: true, hoursWorked: number, wasCapped: boolean }
 */

// autoCloseOldRecords()
/**
 * 🟠 MANTENIMIENTO: Cierra registros >24 horas sin salida
 * 
 * Lógica:
 * - Busca registros sin check_out más antiguos a 24 horas
 * - Cierra automáticamente con 4 horas (turno mínimo)
 * - Marca con razón: "Auto-cerrado por sistema"
 * 
 * Retorna:
 * { success: true, closed: number, message: string }
 */

// capLongSessions()
/**
 * 🟠 MANTENIMIENTO: Limita sesiones a máximo 10 horas
 * 
 * Lógica:
 * - Busca registros activos >10 horas
 * - Cierra exactamente a 10 horas
 * - Marca con razón: "Auto-cerrado por límite de 10 horas"
 * 
 * Retorna:
 * { success: true, capped: number, message: string }
 */

// adjustStudentHours(studentId, hoursAdjustment, reason)
/**
 * 🔵 CORRECCIÓN: Ajusta horas manualmente
 * @param studentId - ID del estudiante
 * @param hoursAdjustment - Horas a sumar/restar
 * @param reason - Motivo del ajuste
 * 
 * Validaciones:
 * ✅ Solo supervisores pueden ejecutar
 * ✅ Verifica que resultado no sea negativo
 * ✅ Crea registro de auditoría automáticamente
 * 
 * Flujo:
 * 1. Obtiene horas actuales del estudiante
 * 2. Suma/resta ajuste
 * 3. Actualiza accumulated_hours
 * 4. Crea registro con motivo en early_departure_reason
 * 5. Revalida rutas relevantes
 * 
 * Retorna:
 * { success: true } o { success: false, error: "mensaje" }
 */

// exportToExcel()
/**
 * Exporta datos a Excel
 * - Descarga estudiantes con perfiles
 * - Descarga todos los registros de asistencia
 */
```

---

### **components/supervisor/stats-cards.tsx**
```typescript
/**
 * 4 tarjetas de estadísticas principales
 * Grid responsivo: 2 en móvil, 4 en desktop
 */

// Métricas:
1️⃣ Total Estudiantes (azul)
2️⃣ Activos Ahora (verde)
3️⃣ Horas Hoy (naranja)
4️⃣ Progreso Promedio (púrpura)

// Diseño:
- Icono + gradiente por métrica
- Fuente grande para valores
- Responsive con grid breakpoints
```

---

### **components/supervisor/active-students.tsx**
```typescript
/**
 * Lista de estudiantes activos CON ADVERTENCIAS
 * - Detecta sesiones >10 horas ⚠️
 * - Detecta registros >24 horas sin cerrar 🚨
 * - Permite forzar checkout manual
 * - Botón para auto-cerrar automáticamente
 */

// Cálculos:
- hoursElapsed = (ahora - checkIn) en horas
- longSessions = registros >10 horas
- oldRecords = registros >24 horas

// Color de alerta:
🟢 Normal: < 10 horas
🟡 Advertencia: 10-24 horas
🔴 Crítico: > 24 horas

// Acciones:
- AdminCheckoutDialog: Forzar salida manual
- AutoCloseButton: Cerrar automáticamente
- Muestra horas transcurridas en tiempo real

// Información por estudiante:
👤 Nombre completo
⏰ Hora de entrada
📍 Sala
☀️/🌙 Turno
⏱️ Horas transcurridas
```

---

### **components/supervisor/admin-checkout-dialog.tsx**
```typescript
/**
 * Dialog para forzar salida manual
 * - Muestra datos del estudiante
 * - Horas transcurridas hasta ahora
 * - Aviso si se limitará a 10 horas
 * - Campo de motivo opcional
 */

// Información mostrada:
📝 Nombre del estudiante
🕐 Entrada (fecha + hora)
☀️/🌙 Turno
📍 Sala
⏱️ Horas transcurridas
⚠️ Aviso si >10 horas

// Acciones:
- Campo para motivo (max 200 caracteres)
- Botón Confirmar: ejecuta forceCheckOut()
- Botón Cancelar: cierra dialog
```

---

### **components/supervisor/auto-close-button.tsx**
```typescript
/**
 * Dropdown con herramientas administrativas
 * - Limitar sesiones a 10 horas
 * - Cerrar registros >24 horas
 * - Muestra cantidad de problemas pendientes
 */

// Botón:
- Variante destructiva si hay problemas
- Mostrador visual de estado

// Opciones:
1️⃣ Limitar a 10 horas
   └─ Activa si: longSessions > 0
   
2️⃣ Cerrar registros antiguos
   └─ Activa si: oldRecords > 0

// Información:
- Cantidad exacta de registros afectados
- Estado de cada acción (spinner si está ejecutando)
- Políticas documentadas en menu
```

---

## 📡 API y Utilidades

### **app/api/active-students/route.ts**
```typescript
/**
 * GET /api/active-students
 * Retorna estudiantes activos EN TIEMPO REAL
 * 
 * Query:
 * - Busca registros sin check_out
 * - Ordena por check_in descendente
 * - Incluye datos: nombre, entrada, turno, sala
 * 
 * Respuesta:
 * {
 *   activeStudents: [
 *     {
 *       id: string
 *       studentName: string
 *       checkIn: ISO 8601 string
 *       shift: "matutino" | "vespertino"
 *       room: string
 *     }
 *   ]
 * }
 * 
 * Headers de caché:
 * - Cache-Control: no-store (siempre fresco)
 * - Pragma: no-cache
 * - Expires: 0
 * 
 * Usada por: Página de login cada 30 segundos
 */
```

---

### **lib/utils/date-formatter.ts**
```typescript
/**
 * Utilidades para formateo de fechas
 * Zona horaria: America/Mexico_City (Villahermosa, Tabasco)
 * Formato: 12 horas con AM/PM
 */

// formatDateTime(dateString)
/**
 * Retorna { date: string, time: string }
 * Ej: { date: "15 nov. 2024", time: "02:30 PM" }
 */

// formatTime(dateString)
/**
 * Retorna solo la hora
 * Ej: "02:30 PM"
 */

// formatDate(dateString)
/**
 * Retorna solo la fecha
 * Ej: "15 nov. 2024"
 */
```

---

### **lib/utils.ts**
```typescript
/**
 * Función utilitaria para combinar clases CSS
 * Usa clsx para condicionales + tailwind-merge
 */

// cn(...inputs)
/**
 * Combina múltiples clases Tailwind inteligentemente
 * Resuelve conflictos de especificidad
 * 
 * Uso:
 * cn("px-4", condition && "bg-blue-500")
 */
```

---

## 🔌 Cliente Supabase

### **lib/supabase/client.ts**
```typescript
/**
 * Cliente de Supabase para lado del cliente (browser)
 * Singleton pattern - reutiliza instancia
 */

// getSupabaseBrowserClient()
/**
 * Retorna cliente Supabase reutilizable
 * - Usa keys públicas (ANON_KEY)
 * - Acceso autenticado a través de sesión
 * - Maneja cookies automáticamente
 * 
 * Usado en: Componentes "use client"
 */
```

---

### **lib/supabase/server.ts**
```typescript
/**
 * Cliente de Supabase para lado del servidor
 * Seguro para Server Components y Server Actions
 */

// getSupabaseServerClient()
/**
 * Crea cliente Supabase con cookies de servidor
 * - Usa keys públicas pero en contexto seguro
 * - Acceso a cookies del request
 * - Soporta middleware de Next.js
 * 
 * Usado en: Pages, Actions, Layouts
 */
```

---

### **lib/supabase/admin.ts**
```typescript
/**
 * Cliente administrador de Supabase
 * Solo en backend - MÁS PERMISOS
 */

// getSupabaseAdminClient()
/**
 * Crea cliente con SERVICE_ROLE_KEY
 * ⚠️ Máximos permisos - NUNCA expongas en frontend
 * 
 * Usos:
 * - Operaciones administrativas
 * - Triggers y cálculos automáticos
 * - Acceso directo a BD sin restricciones
 */
```

---

### **lib/supabase/types.ts**
```typescript
/**
 * Tipos TypeScript para entidades de Supabase
 */

type UserRole = "student" | "supervisor"
type StudentType = "servicio_social" | "practicas"
type ShiftType = "matutino" | "vespertino"

interface Profile {
  id: string                // UUID de usuario
  email: string            // Email único
  full_name: string        // Nombre completo
  role: UserRole           // student | supervisor
  created_at: string       // Timestamp ISO 8601
}

interface Student {
  id: string               // UUID (FK a auth.users.id)
  student_type: StudentType
  required_hours: number   // Horas a cumplir
  assigned_room: string    // Sala asignada
  accumulated_hours: number // Horas acumuladas
  created_at: string
}

interface AttendanceRecord {
  id: string               // UUID
  student_id: string       // FK Students
  check_in: string         // Entrada (ISO 8601)
  check_out: string | null // Salida (NULL si activo)
  shift: ShiftType
  room: string
  hours_worked: number | null
  early_departure_reason: string // Motivo salida temprana
  created_at: string
}

interface StudentWithProfile extends Student {
  profile: Profile  // Relación incluida
}
```

---

## 🎨 Componentes UI

### **components/student/early-departure-dialog.tsx**
```typescript
/**
 * Dialog para registrar salida temprana (<3 horas)
 * - Muestra horas trabajadas vs requeridas
 * - Lista de motivos predefinidos
 * - Opción de motivo personalizado
 */

// Motivos disponibles:
1️⃣ Enfermedad 🤒
2️⃣ Imprevisto personal ⚡
3️⃣ Emergencia familiar 👨‍👩‍👧
4️⃣ Otra razón 📝 (requiere descripción)

// Validaciones:
✅ Motivo requerido
✅ Si "otra", motivo personalizado requerido
✅ Max 200 caracteres en descripción

// Cálculo:
- remainingHours = Math.max(3 - hoursWorked, 0)
- Muestra gráficamente diferencia
```

---

### **components/refresh-button.tsx**
```typescript
/**
 * Botón para recargar página manualmente
 * - Ejecuta router.refresh() de Next.js
 * - Spinner durante la carga
 * - Toast de feedback
 */

// Estados:
- Normal: "Actualizar"
- Cargando: Spinner + "Actualizando datos..."

// Feedback:
✅ Toast verde: "Datos actualizados"
❌ Toast rojo: "Error al actualizar"
```

---

### **components/supervisor/recent-activity.tsx**
```typescript
/**
 * Muestra últimas 10 salidas registradas
 * - Nombre estudiante
 * - Hora de salida
 * - Horas trabajadas
 * - Turno y sala
 */
```

---

### **components/supervisor/export-button.tsx**
```typescript
/**
 * Botón para exportar datos (funcionalidad pendiente)
 * - Ícono de descarga
 * - Estado de carga con animación
 * - Responsive (oculta texto en móvil)
 */
```

---

## 📊 Modelo de Datos

### **Tablas Supabase**

```sql
-- Perfiles de usuarios (relación con auth.users)
profiles:
  - id (UUID, PK, FK auth.users.id)
  - email (TEXT)
  - full_name (TEXT)
  - role (TEXT: 'student' | 'supervisor')
  - created_at (TIMESTAMP)

-- Información de estudiantes
students:
  - id (UUID, PK, FK profiles.id)
  - student_type (TEXT: 'servicio_social' | 'practicas')
  - required_hours (DECIMAL)
  - assigned_room (TEXT)
  - accumulated_hours (DECIMAL, default 0)
  - created_at (TIMESTAMP)

-- Registros de asistencia
attendance_records:
  - id (UUID, PK)
  - student_id (UUID, FK students.id)
  - check_in (TIMESTAMP)
  - check_out (TIMESTAMP, nullable)
  - shift (TEXT: 'matutino' | 'vespertino')
  - room (TEXT)
  - hours_worked (DECIMAL, nullable)
  - early_departure_reason (TEXT, nullable)
  - created_at (TIMESTAMP)

-- Triggers automáticos:
✅ Cuando se actualiza attendance_records.check_out
   └─ Calcula horas_worked = (check_out - check_in)
   └─ Suma a students.accumulated_hours
```

---

## 🔒 Seguridad

### **Principios implementados:**

1️⃣ **RLS (Row Level Security)**
   - Estudiantes ven solo sus registros
   - Supervisores ven todos los registros

2️⃣ **Secretos en .env**
   - Todas las keys en variables de entorno
   - NUNCA hardcodeadas

3️⃣ **Validación de servidor**
   - Verificación de autenticación en actions
   - Verificación de rol en operaciones admin

4️⃣ **Límites de datos**
   - Máximo 10 horas por turno
   - Auto-cierre después de 24 horas
   - Motivos auditables

---

## 📱 Responsive Design

### **Breakpoints Tailwind**

```
sm: 640px   (Tablets)
md: 768px   (Small laptops)
lg: 1024px  (Desktops)
xl: 1280px  (Widescreen)
```

### **Estrategia:**
- Mobile-first approach
- Oculta/muestra elementos según pantalla
- Fonts escalables (sm:, lg:)
- Grid y flex adaptativos

---

## 🎯 Características Principales

### ✅ Completadas

- ✅ Login/logout con Supabase Auth
- ✅ Dashboard estudiante con check-in/out
- ✅ Dashboard supervisor con estadísticas
- ✅ Historial de asistencias
- ✅ Límite de 10 horas diarias
- ✅ Auto-cierre tras 24 horas sin salida
- ✅ Salida temprana con motivos
- ✅ Forzar salida manual (supervisor)
- ✅ Ajuste manual de horas (supervisor)
- ✅ Temas claro/oscuro
- ✅ Diseño fully responsive

### 🔄 En desarrollo

- ⏳ Exportar a Excel
- ⏳ Generación de reportes PDF
- ⏳ Gráficos de progreso

---

## 🚀 Variables de Entorno

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# Vercel Analytics (opcional)
NEXT_PUBLIC_VERCEL_ANALYTICS=true
```

---

## 📞 Contacto y Soporte

**Proyecto:** Casa Universitaria del Agua
**Sistema:** Asistencia para Estudiantes de Prácticas y Servicio Social
**Desarrollador:** Manuel Prg
**Repositorio:** sistema-asistencia

---

## 📝 Notas Importantes

1. **Zona horaria:** América/México_City (Villahermosa, Tabasco)
2. **Formato de hora:** 12 horas con AM/PM
3. **Mínimo de turno:** 3 horas
4. **Máximo por día:** 10 horas
5. **Auto-cierre:** 24 horas sin salida
6. **Auditoría:** Todos los ajustes se registran en attendance_records

---

**Última actualización:** 15 de noviembre de 2024
