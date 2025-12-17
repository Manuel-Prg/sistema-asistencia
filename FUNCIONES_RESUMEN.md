# 🔍 Resumen Rápido de Funciones

## 📄 Archivos y sus funciones principales

---

## 🔐 AUTENTICACIÓN

### **middleware.ts**
```
✓ Middleware de Next.js
✓ Valida autenticación en cada request
✓ Redirige según rol del usuario
✓ Protege rutas privadas (/student, /supervisor)
```

---

## 📱 PÁGINAS

### **app/page.tsx**
```
✓ Página raíz
✓ Redirige a /login
```

### **app/login/page.tsx**
```
✓ Formulario de login (email/contraseña)
✓ Muestra estudiantes activos en tiempo real
✓ Refresca lista cada 30 segundos
✓ Redirige al dashboard según rol
```

### **app/student/page.tsx**
```
✓ Dashboard del estudiante
✓ Muestra progreso de horas
✓ Permite check-in/out
✓ Historial de últimas 10 asistencias
```

### **app/supervisor/page.tsx**
```
✓ Dashboard del supervisor
✓ 4 tarjetas de estadísticas
✓ Lista de estudiantes activos
✓ Actividad reciente
```

### **app/student/layout.tsx**
```
✓ Layout compartido para estudiante
✓ Verifica autenticación
✓ Verifica que sea estudiante
✓ Renderiza navbar y footer
```

### **app/supervisor/layout.tsx**
```
✓ Layout compartido para supervisor
✓ Verifica autenticación
✓ Verifica que sea supervisor
✓ Verifica que sea supervisor
✓ Incluye Toaster para notificaciones
```

### **app/forgot-password/page.tsx**
```
✓ Formulario solicitud de recuperación
✓ Llama a Supabase resetPasswordForEmail
✓ Maneja estados de carga y error
```

### **app/reset-password/page.tsx**
```
✓ Formulario de nueva contraseña
✓ Valida reglas de seguridad
✓ Llama a Supabase updateUser
```

---

## ⚙️ ACCIONES DEL SERVIDOR (Server Actions)

### **app/student/actions.ts**

#### `checkIn(room, shift)`
```
@param room: string - Sala de trabajo
@param shift: 'matutino' | 'vespertino'
Valida: No haya entrada activa
Crea: Registro en attendance_records
Retorna: { success: true } | { error: "msg" }
```

#### `checkOut(earlyDepartureReason?)`
```
@param earlyDepartureReason: string (opcional)
Valida: Exista entrada activa
Calcula: Horas = checkOut - checkIn
Actualiza: Check_out y hours_worked
Retorna: { success: true, hoursWorked: number }
```

#### `signOut()`
```
Cierra sesión de Supabase
Redirige a /login
```

---

### **app/supervisor/actions.ts**

#### `signOut()`
```
Cierra sesión del supervisor
```

#### `forceCheckOut(recordId, reason)`
```
@param recordId: ID del registro
@param reason: Motivo de salida forzada
Calcula horas transcurridas
CAP: Máximo 10 horas
Actualiza registro con check_out
Retorna: { success, hoursWorked, wasCapped }
```

#### `autoCloseOldRecords()`
```
Busca registros >24 horas sin cerrar
Cierra automáticamente con 4 horas
Retorna: { success, closed, message }
```

#### `capLongSessions()`
```
Busca registros activos >10 horas
Cierra exactamente a 10 horas
Retorna: { success, capped, message }
```

#### `adjustStudentHours(studentId, hoursAdjustment, reason)`
```
@param studentId: ID del estudiante
@param hoursAdjustment: Horas a sumar/restar
@param reason: Motivo del ajuste
Valida: Solo supervisores
Valida: Resultado no sea negativo
Actualiza: accumulated_hours
Crea: Registro de auditoría
Retorna: { success: true } | { error }
```

#### `exportToExcel()`
```
Descarga estudiantes con perfiles
Descarga todos los registros
```

---

## 🌐 API ROUTES

### **app/api/active-students/route.ts**

#### `GET /api/active-students`
```
Retorna: { activeStudents: Array }
Cada estudiante:
  - id, studentName, checkIn, shift, room
Orden: Por check_in descendente
Cache: Nunca (siempre fresco)
Usado: Login cada 30 segundos
```

---

## 🎨 COMPONENTES CLIENTE

### **components/student/check-in-out-card.tsx**
```
✓ Interfaz de check-in (selecciona sala + turno)
✓ Interfaz de check-out (solo si hay entrada activa)
✓ Muestra entrada activa con detalles
✓ Dialog para salida temprana (<3 horas)
```

### **components/student/progress-card.tsx**
```
✓ Barra de progreso animada
✓ Horas acumuladas vs requeridas
✓ Porcentaje de avance
✓ Horas faltantes
✓ Tipo de programa (servicio social | prácticas)
✓ Mensajes motivacionales
```

### **components/student/attendance-history.tsx**
```
✓ Historial de últimos 10 registros
✓ Fecha, hora entrada/salida, sala, turno
✓ Horas trabajadas por registro
✓ Motivos de salida temprana (si aplica)
✓ Estado actual si hay entrada activa
✓ Indica completo/incompleto visualmente
```

### **components/student/early-departure-dialog.tsx**
```
✓ Dialog para salida <3 horas
✓ Muestra horas trabajadas vs requeridas
✓ 4 razones predefinidas + otra personalizada
✓ Valida que esté completo antes de confirmar
✓ Max 200 caracteres en descripción
```

### **components/supervisor/stats-cards.tsx**
```
✓ 4 tarjetas de métricas
✓ Total estudiantes (azul)
✓ Activos ahora (verde)
✓ Horas hoy (naranja)
✓ Progreso promedio (púrpura)
✓ Responsive: 2 cols móvil, 4 desktop
```

### **components/supervisor/active-students.tsx**
```
✓ Lista de estudiantes activos
✓ Alerta de sesiones >10 horas ⚠️
✓ Alerta de registros >24 horas 🚨
✓ Horas transcurridas en tiempo real
✓ Botón para forzar salida manual
✓ Botón para auto-cerrar automáticamente
```

### **components/supervisor/admin-checkout-dialog.tsx**
```
✓ Dialog para forzar salida manual
✓ Información completa del estudiante
✓ Horas transcurridas
✓ Aviso si se limitará a 10 horas
✓ Campo de motivo (max 200 caracteres)
✓ Ejecuta forceCheckOut() al confirmar
```

### **components/supervisor/auto-close-button.tsx**
```
✓ Dropdown con herramientas administrativas
✓ Opción: Limitar a 10 horas
✓ Opción: Cerrar registros >24 horas
✓ Muestra cantidad de problemas
✓ Ejecuta acciones automáticas
✓ Toast de feedback
```

### **components/supervisor/export-button.tsx**
```
✓ Botón para exportar datos (WIP)
✓ Ícono con animación de carga
✓ Responsive (oculta texto en móvil)
```

### **components/supervisor/recent-activity.tsx**
```
✓ Últimos 10 registros cerrados
✓ Nombre, hora salida, horas trabajadas
✓ Turno y sala
```

### **components/refresh-button.tsx**
```
✓ Botón para recargar página manualmente
✓ Ejecuta router.refresh()
✓ Spinner durante carga
✓ Toast de feedback (éxito/error)
```

---

## 📁 UTILIDADES

### **lib/utils.ts**
```
cn(...inputs)
├─ Combina clases CSS intelligentemente
├─ Usa clsx + tailwind-merge
└─ Resuelve conflictos de especificidad
```

### **lib/utils/date-formatter.ts**
```
formatDateTime(dateString)
├─ Retorna { date, time }
├─ Zona: America/Mexico_City
└─ Formato: 12 horas AM/PM

formatTime(dateString)
├─ Solo hora

formatDate(dateString)
├─ Solo fecha
```

---

## 🔌 CLIENTES SUPABASE

### **lib/supabase/client.ts**
```
getSupabaseBrowserClient()
├─ Cliente para "use client" components
├─ Singleton pattern
└─ Usa ANON_KEY pública
```

### **lib/supabase/server.ts**
```
getSupabaseServerClient()
├─ Cliente para Server Components
├─ Cliente para Server Actions
└─ Maneja cookies del servidor
```

### **lib/supabase/admin.ts**
```
getSupabaseAdminClient()
├─ Cliente con SERVICE_ROLE_KEY
├─ Máximos permisos
└─ Solo backend - NUNCA frontend
```

### **lib/supabase/types.ts**
```
UserRole: 'student' | 'supervisor'
StudentType: 'servicio_social' | 'practicas'
ShiftType: 'matutino' | 'vespertino'

Profile
├─ id, email, full_name, role, created_at

Student
├─ id, student_type, required_hours, assigned_room
├─ accumulated_hours, created_at

AttendanceRecord
├─ id, student_id, check_in, check_out
├─ shift, room, hours_worked, early_departure_reason

StudentWithProfile
└─ Student + Profile relationship
```

---

## 🎨 COMPONENTES UI (UI Library)

```
Componentes base reutilizables:
├─ Button, Input, Label
├─ Card (Header, Title, Content, Description)
├─ Dialog (Header, Title, Content, Footer)
├─ Alert, Badge
├─ Select, RadioGroup
├─ Textarea, Progress
├─ Tabs, Accordion
├─ DropdownMenu
├─ Toaster (notificaciones)
├─ Avatar, Separator
└─ ... (35+ componentes de Radix UI)
```

---

## 📊 MODELO DE DATOS

```
PROFILES
├─ id: UUID (FK auth.users.id)
├─ email: TEXT
├─ full_name: TEXT
├─ role: 'student' | 'supervisor'
└─ created_at: TIMESTAMP

STUDENTS
├─ id: UUID (FK profiles.id)
├─ student_type: 'servicio_social' | 'practicas'
├─ required_hours: DECIMAL
├─ assigned_room: TEXT
├─ accumulated_hours: DECIMAL
└─ created_at: TIMESTAMP

ATTENDANCE_RECORDS
├─ id: UUID
├─ student_id: UUID (FK students.id)
├─ check_in: TIMESTAMP
├─ check_out: TIMESTAMP (nullable)
├─ shift: 'matutino' | 'vespertino'
├─ room: TEXT
├─ hours_worked: DECIMAL (nullable)
├─ early_departure_reason: TEXT (nullable)
└─ created_at: TIMESTAMP

TRIGGERS:
✓ Actualizar hours_worked cuando check_out
✓ Sumar a accumulated_hours automáticamente
```

---

## 🔐 AUTENTICACIÓN

```
Auth Flow:
1. Usuario introduce email/contraseña
2. Supabase Auth valida credenciales
3. Se crea sesión con JWT token
4. Token se guarda en cookie segura
5. Middleware valida en cada request
6. Se verifica rol (student/supervisor)
7. Se redirige al dashboard correcto

RLS (Row Level Security):
✓ Estudiantes ven solo sus registros
✓ Supervisores ven todos los registros
✓ Operaciones admin verifican rol
```

---

## 🎯 FLUJOS PRINCIPALES

### **Flujo de Check-In**
```
1. Estudiante abre check-in-out-card
2. Selecciona sala y turno
3. Presiona "Registrar Entrada"
4. checkIn() valida no hay entrada activa
5. Crea registro en attendance_records
6. Se actualiza la página
7. Ahora muestra check-out
```

### **Flujo de Check-Out Normal (≥3 horas)**
```
1. Estudiante presiona "Registrar Salida"
2. checkOut() calcula horas transcurridas
3. Si ≥3 horas: procede directamente
4. Si <3 horas: abre early-departure-dialog
5. Actualiza check_out y hours_worked
6. Trigger suma a accumulated_hours
7. Se actualiza la página
```

### **Flujo de Check-Out Temprano (<3 horas)**
```
1. Estudiante intenta salir antes de 3 horas
2. Se abre early-departure-dialog
3. Selecciona motivo (enfermedad, imprevisto, etc)
4. Si "otra": escribe descripción personalizada
5. Presiona "Confirmar Salida"
6. Se guarda motivo en early_departure_reason
7. Trigger suma horas a accumulated_hours
```

### **Flujo de Forzar Salida (Supervisor)**
```
1. Supervisor ve lista de estudiantes activos
2. Presiona "Forzar Salida" en algún estudiante
3. Se abre admin-checkout-dialog
4. Muestra horas transcurridas
5. Si >10 horas: aviso de limitación
6. Opcionalmente agrega motivo
7. Presiona "Confirmar Salida"
8. Ejecuta forceCheckOut()
9. Calcula horas (máximo 10)
10. Actualiza registro
```

### **Flujo de Auto-Cerrar Antiguo (Supervisor)**
```
1. Supervisor ve alerta de >24 horas
2. Presiona "Administrar"
3. Selecciona "Cerrar registros antiguos"
4. Ejecuta autoCloseOldRecords()
5. Busca registros sin cerrar >24h
6. Cierra cada uno con 4 horas
7. Toast de confirmación
8. Lista se actualiza
```

### **Flujo de Limitar Sesiones Largas (Supervisor)**
```
1. Supervisor ve alerta de >10 horas
2. Presiona "Administrar"
3. Selecciona "Limitar a 10 horas"
4. Ejecuta capLongSessions()
5. Busca registros activos >10h
6. Cierra cada uno a exactamente 10 horas
7. Toast de confirmación
8. Lista se actualiza
```

---

## ⚡ OPTIMIZACIONES

```
✓ Next.js 15 App Router
✓ Server Components por defecto
✓ Server Actions para operaciones
✓ RevalidatePath() para refresco selectivo
✓ Singleton clients (Supabase)
✓ Date-fns con localización
✓ Tailwind CSS con PurgeCSS
✓ Responsive design mobile-first
✓ Dark mode con next-themes
✓ Toast notifications con Sonner
✓ Componentes UI con Radix + Tailwind
```

---

**Última actualización:** 15 de noviembre de 2024
