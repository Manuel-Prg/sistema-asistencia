# 🚀 INICIO RÁPIDO - Sistema de Asistencia

## ¡Bienvenido! 👋

Has recibido **documentación completa** de tu proyecto. Aquí está lo esencial.

---

## 📚 Tus Archivos de Documentación

```
✅ README.md                 ← EMPIEZA AQUÍ (índice principal)
✅ DOCUMENTACION.md          ← Guía técnica completa (30-45 min)
✅ FUNCIONES_RESUMEN.md      ← Resumen rápido de funciones (10 min)
✅ GUIA_DE_USO.md            ← Manual para usuarios finales
✅ REFERENCIA_TECNICA.md     ← Cheat sheet de desarrollador
✅ ESTADISTICAS.md           ← Métricas y datos del proyecto
✅ agents.md                 ← Convenciones del proyecto
```

---

## 🎯 ¿Qué Es Este Proyecto?

```
📱 Sistema de Asistencia Para Estudiantes
   
Permite que estudiantes registren:
  ✓ Entrada a turno (check-in)
  ✓ Salida de turno (check-out)
  ✓ Ver su progreso de horas
  
Permite que supervisores:
  ✓ Ver estudiantes activos en tiempo real
  ✓ Forzar salida manual
  ✓ Auto-cerrar registros antiguos
  ✓ Ajustar horas manualmente

Límites automáticos:
  ✓ Mínimo: 3 horas por turno
  ✓ Máximo: 10 horas por día
  ✓ Auto-cierre: después de 24 horas sin salida
```

---

## 🏃 ¿Por Dónde Empiezo?

### Si eres **DESARROLLADOR:**

```
PASO 1: Lee en 10 minutos
   └─ FUNCIONES_RESUMEN.md (visión general rápida)

PASO 2: Profundiza en 30 minutos
   └─ DOCUMENTACION.md (todos los detalles)

PASO 3: Guarda como referencia
   └─ REFERENCIA_TECNICA.md (cuando necesites dudas específicas)

BONUS: Revisa las convenciones
   └─ agents.md (cómo codificar en este proyecto)
```

### Si eres **USUARIO FINAL** (Estudiante/Supervisor):

```
PASO 1: Abre el manual
   └─ GUIA_DE_USO.md

PASO 2: Busca tu sección
   ├─ "PARA ESTUDIANTES" 👨‍🎓
   └─ "PARA SUPERVISORES" 👔

PASO 3: Sigue instrucciones paso a paso
   └─ El documento está diseñado para ser muy claro
```

### Si eres **GESTOR/ADMINISTRADOR:**

```
PASO 1: Resumen ejecutivo
   └─ README.md (sección "Descripción General")

PASO 2: Características
   └─ DOCUMENTACION.md (sección "Características Principales")

PASO 3: Seguridad
   └─ DOCUMENTACION.md (sección "Seguridad")

PASO 4: Estadísticas
   └─ ESTADISTICAS.md (métricas del proyecto)
```

---

## 🎯 Contenido Rápido

### 📂 Estructura del Proyecto

```
app/
  ├─ login/          (Página de inicio de sesión)
  ├─ student/        (Dashboard del estudiante)
  └─ supervisor/     (Dashboard del supervisor)

components/
  ├─ student/        (Componentes para estudiantes)
  ├─ supervisor/     (Componentes para supervisores)
  └─ ui/             (Componentes base reutilizables)

lib/
  ├─ supabase/       (Clientes de BD)
  └─ utils/          (Funciones auxiliares)
```

### 🔑 Funciones Principales

```typescript
// Estudiante
checkIn(room, shift)        ← Registra entrada
checkOut(reason?)           ← Registra salida
signOut()                   ← Cierra sesión

// Supervisor
forceCheckOut(id, reason)   ← Fuerza salida manual
autoCloseOldRecords()       ← Auto-cierra >24h
capLongSessions()           ← Limita a 10 horas
adjustStudentHours(id, h)   ← Ajusta horas
```

### 🔐 Seguridad

```
✅ Autenticación: Supabase Auth (JWT)
✅ Autorización: RLS (Row Level Security)
✅ Secretos: Variables de entorno
✅ Validación: Zod + checks en servidor
✅ Auditoría: Todos los cambios registrados
```

---

## 💡 Lo Más Importante

### ⚠️ LÍMITES AUTOMÁTICOS

```
🔴 NUNCA más de 10 horas por día
   ├─ Se limita automáticamente
   └─ Se registra para auditoría

🔴 NUNCA menos de 3 horas por turno
   ├─ Pide motivo si es menos
   └─ Se registra el motivo

🔴 NUNCA queda abierto más de 24h
   ├─ Se cierra automáticamente con 4 horas
   └─ Se marca como auto-cerrado
```

### 📊 ESTUDIANTES VEN

```
✓ Su progreso (horas acumuladas vs requeridas)
✓ Su entrada/salida actual
✓ Historial de últimas 10 asistencias
✓ Sala, turno, hora, horas trabajadas
✓ Motivos de salida temprana
```

### 👔 SUPERVISORES VEN

```
✓ Total de estudiantes
✓ Estudiantes activos AHORA
✓ Horas de hoy acumuladas
✓ Promedio de progreso
✓ Lista completa de estudiantes activos
✓ Últimas 10 salidas registradas
✓ Alertas de >10h y >24h
```

---

## 🛠️ Stack Tecnológico

```
Frontend:  Next.js 15 + React 18 + TypeScript
UI:        Radix UI + Tailwind CSS
Backend:   Supabase (PostgreSQL)
Auth:      Supabase Auth (JWT)
Deploy:    Vercel
```

---

## 📊 Estadísticas Rápidas

```
Líneas de código:      ~7,000
Documentación:         ~2,200 líneas en 6 archivos
Componentes:           ~45 componentes
Dependencias:          49 total (42 prod, 7 dev)
Cobertura de docs:     100%
Responsive:            100% (móvil, tablet, desktop)
Idioma:                Español
```

---

## 🎓 Información Técnica Esencial

### Variables de Entorno Necesarias

```env
NEXT_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

### Scripts Disponibles

```bash
npm run dev       # Desarrollo local (localhost:3000)
npm run build     # Compilar para producción
npm start         # Iniciar servidor
npm run lint      # Revisar código
```

### Base de Datos

```
3 tablas:
  ├─ profiles         (usuarios + roles)
  ├─ students         (información estudiante)
  └─ attendance_records (asistencias)

RLS Policies: Implementadas
Triggers: Cálculos automáticos
```

---

## ✨ Lo Que Está Listo

### ✅ COMPLETADO

```
✅ Login con email/contraseña
✅ Check-in/out
✅ Visualizar progreso
✅ Historial de asistencias
✅ Dashboard supervisor
✅ Forzar salida (supervisor)
✅ Auto-cerrar registros (supervisor)
✅ Ajustar horas (supervisor)
✅ Tema oscuro/claro
✅ 100% Responsive
✅ Documentación completa
✅ Seguridad (Auth + RLS + validación)
```

### ⏳ EN DESARROLLO

```
⏳ Exportar a Excel
⏳ Reportes PDF
⏳ Gráficos interactivos
⏳ Cambiar contraseña
⏳ Reset por email
⏳ 2FA (autenticación de dos factores)
```

---

## 🔗 Rutas del Sitio

```
/                 → Redirige a /login
/login            → Página de login
/student          → Dashboard estudiante (protegido)
/supervisor       → Dashboard supervisor (protegido)
/api/active-students  → API de estudiantes activos
```

---

## 🚀 Cómo Ejecutar

### Desarrollo Local

```bash
1. Clonar proyecto
   git clone <repo>

2. Instalar dependencias
   npm install

3. Crear .env.local con variables

4. Ejecutar desarrollo
   npm run dev

5. Abrir
   http://localhost:3000
```

### Deployment (Vercel)

```bash
1. Push a GitHub
2. Conectar con Vercel
3. Vercel construye automáticamente
4. Configurar variables de entorno
5. Deploy completado
```

---

## 🆘 Solución de Problemas

### "No puedo iniciar sesión"
```
✓ Verifica email y contraseña
✓ Verifica que la cuenta está activada
✓ Intenta en incógnito
✓ Limpia cookies y cache
```

### "No aparece mi entrada activa"
```
✓ Presiona "Actualizar"
✓ Espera unos segundos
✓ Recarga la página
✓ Cierra y abre sesión nuevamente
```

### "Se registró mal mi hora"
```
✓ Avisa al supervisor inmediatamente
✓ El supervisor puede ajustar manualmente
✓ Queda registrado para auditoría
```

---

## 📞 Contacto

```
Problemas técnicos:
  └─ Contactar: Manuel Prg (desarrollador)

Problemas de uso:
  └─ Contactar: Supervisor del sistema

Mejoras/Features:
  └─ Contactar: Equipo de desarrollo
```

---

## 📝 Reglas Importantes

Antes de escribir código, lee **agents.md** que especifica:

```
✅ NAMING: snake_case en variables
✅ COMENTARIOS: JSDoc en cada función
✅ ARQUITECTURA: No lógica en vistas
✅ DRY: Reutiliza funciones existentes
✅ SEGURIDAD: Secretos en .env
✅ VALIDACIÓN: Valida siempre entrada
✅ ERRORES: Usa try/catch y loga errores
```

---

## 🎯 Próximas Acciones

### Si vas a DESARROLLAR:

```
1. [ ] Lee FUNCIONES_RESUMEN.md (10 min)
2. [ ] Lee DOCUMENTACION.md (30 min)
3. [ ] Guarda REFERENCIA_TECNICA.md como favorito
4. [ ] Lee agents.md para convenciones
5. [ ] Setup de desarrollo local
6. [ ] Comienza a desarrollar
```

### Si eres USUARIO:

```
1. [ ] Abre GUIA_DE_USO.md
2. [ ] Salta a tu sección (ESTUDIANTE o SUPERVISOR)
3. [ ] Sigue las instrucciones paso a paso
4. [ ] ¡Empieza a usar el sistema!
```

---

## ✅ Checklist Rápido

```
¿Tengo las variables de entorno?
  [ ] Sí, tengo .env configurado

¿Puedo ejecutar el proyecto?
  [ ] npm run dev (funciona)

¿Puedo ver la documentación?
  [ ] Todos los .md files están aquí

¿Entiendo la estructura?
  [ ] He leído FUNCIONES_RESUMEN.md

¿Puedo empezar a codificar?
  [ ] He leído agents.md (convenciones)
  [ ] Tengo REFERENCIA_TECNICA.md como referencia
```

---

## 🎉 ¡Listo para Empezar!

```
Tienes TODO lo que necesitas:
  ✅ 6 documentos completos
  ✅ Código bien organizado
  ✅ Stack moderno
  ✅ Seguridad implementada
  ✅ 100% Responsive
  ✅ Auditoría completa

¿Siguiente paso?
  → Lee README.md (índice principal)
  → Elige tu camino según tu rol
  → ¡Diviértete desarrollando o usando! 🚀
```

---

**Sistema de Asistencia para Estudiantes**
Casa Universitaria del Agua
15 de noviembre de 2024

