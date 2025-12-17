# 🚀 Guía de Uso del Sistema de Asistencia

## 📖 Manual del Usuario

---

## 👨‍🎓 PARA ESTUDIANTES

### 1. Inicio de Sesión

```
1. Dirígete a la página de login (inicio del sistema)
2. Ingresa tu email registrado
3. Ingresa tu contraseña
4. Presiona "Iniciar sesión"
5. Si todo es correcto, irás a tu dashboard
```

**Notas:**
- En la página de login puedes ver quiénes están activos AHORA
- Esta lista se actualiza cada 30 segundos automáticamente

---

### 2. Registrar Entrada (Check-In)

```
En tu dashboard, encontrarás la tarjeta "Registro de Asistencia"

PASOS:
1. Selecciona la SALA donde trabajarás
   ├─ Sala 1
   ├─ Sala 2
   ├─ Sala 2 y Galería
   ├─ Sala 3
   ├─ Sala 4
   ├─ Sala 4 y 5
   ├─ Todas
   └─ Site

2. Selecciona tu TURNO
   ├─ Matutino ☀️ (11:00 - 14:00)
   └─ Vespertino 🌙 (14:00 - 18:00)

3. Presiona "Registrar Entrada"
4. Se mostrará un tick verde confirmando
```

**¿Qué sucede después?**
- Tu entrada se registra automáticamente
- Aparece tu hora exacta de entrada
- Ahora puedes registrar tu salida

---

### 3. Registrar Salida (Check-Out)

```
Cuando termines tu turno:

1. Busca el botón rojo "Registrar Salida"
   (solo aparece si tienes entrada activa)

2. Presiona el botón

3a. Si has estado >3 horas ✓
    └─ Tu salida se registra automáticamente
    └─ Se muestran las horas trabajadas

3b. Si has estado <3 horas ⚠️
    ├─ Se abre un DIALOG
    ├─ Debes seleccionar un motivo
    │  ├─ Enfermedad 🤒
    │  ├─ Imprevisto personal ⚡
    │  ├─ Emergencia familiar 👨‍👩‍👧
    │  └─ Otra razón 📝
    │
    ├─ Si seleccionas "Otra"
    │  └─ Escribe una descripción (max 200 caracteres)
    │
    └─ Presiona "Confirmar Salida"

4. Se muestra confirmación con horas trabajadas
```

**Información importante:**
- Mínimo 3 horas por turno
- Si trabajas >10 horas, se limitará automáticamente a 10
- El motivo de salida temprana se registra para auditoría

---

### 4. Ver Tu Progreso

```
En la tarjeta "Tu Progreso" verás:

📊 BARRA DE PROGRESO
   ├─ Horas completadas
   ├─ Horas requeridas
   └─ Porcentaje de avance

📈 ESTADÍSTICAS
   ├─ Horas por completar (en azul)
   ├─ Porcentaje de avance (en púrpura)
   └─ Tipo de programa (Servicio Social / Prácticas)

💡 MENSAJES ESPECIALES
   ├─ Si < 25% completado: información normal
   ├─ Si > 75% completado: "¡Casi lo logras!"
   └─ Si 100% completado: "¡Felicidades!"
```

---

### 5. Ver Historial de Asistencias

```
En la tarjeta "Historial de Asistencias" ves:

Para cada registro:
├─ 📅 Fecha (formato: Jueves, 15 de noviembre)
├─ ⏰ Hora (entrada - salida)
├─ ☀️/🌙 Turno (Matutino / Vespertino)
├─ 📍 Sala donde trabajaste
├─ ⏱️ Horas trabajadas
├─ ⚠️ Motivo si fue salida temprana
└─ Estado (✓ Completo / ⚠️ Incompleto / 🟢 En curso)

Se muestran los últimos 10 registros
Están ordenados del más reciente al más antiguo
```

---

### 6. Cerrar Sesión

```
En la navbar superior:
1. Busca tu nombre de usuario
2. Presiona la flecha o icono de menú
3. Selecciona "Cerrar sesión"
4. Se redirige a la página de login
```

---

## 👔 PARA SUPERVISORES

### 1. Ver Dashboard Principal

```
En tu dashboard verás 4 tarjetas de estadísticas:

📊 TOTAL ESTUDIANTES (azul)
   └─ Cantidad total de estudiantes registrados

🟢 ACTIVOS AHORA (verde)
   └─ Cuántos estudiantes están en turno AHORA

⏰ HORAS HOY (naranja)
   └─ Horas de trabajo acumuladas en el día de hoy

📈 PROGRESO PROMEDIO (púrpura)
   └─ Promedio de avance de todos los estudiantes
```

---

### 2. Ver Estudiantes Activos

```
En la sección "Estudiantes Activos":

POR CADA ESTUDIANTE VES:
├─ 👤 Nombre completo
├─ 🕐 Hora de entrada
├─ 📍 Sala donde está
├─ ☀️/🌙 Turno
└─ ⏱️ Horas transcurridas

AVISOS AUTOMÁTICOS:
├─ 🟡 AMARILLO: 10-24 horas (límite próximo)
├─ 🔴 ROJO: >24 horas sin cerrar (crítico)
└─ 🟢 VERDE: Normal (<10 horas)

ACCIONES DISPONIBLES:
├─ "Forzar Salida": Cierra manualmente un registro
└─ "Administrar": Abre opciones automáticas
```

---

### 3. Forzar Salida Manual

```
Cuando un estudiante olvida marcar salida:

1. Busca al estudiante en la lista
2. Presiona el botón rojo "Forzar Salida"
3. Se abre un DIALOG con:
   ├─ Nombre del estudiante
   ├─ Hora de entrada
   ├─ Turno y sala
   ├─ Horas transcurridas
   ├─ ⚠️ Aviso si >10 horas (se limitará)
   └─ Campo para agregar motivo (opcional)

4. Escribe un motivo si lo deseas
   (ej: "Olvidó marcar salida", "Emergencia")

5. Presiona "Confirmar Salida"

RESULTADO:
✓ Se cierra el registro automáticamente
✓ Se registra el motivo para auditoría
✓ Si >10 horas: se limita exactamente a 10 horas
✓ La lista se actualiza inmediatamente
```

---

### 4. Auto-Cerrar Registros

```
Si hay problemas, presiona "Administrar":

OPCIÓN 1: Limitar a 10 horas
├─ Cierra automáticamente registros >10 horas
├─ Los limita exactamente a 10 horas
└─ Se activa si hay estudiantes con >10 horas

OPCIÓN 2: Cerrar registros antiguos
├─ Cierra automáticamente registros >24 horas
├─ Les asigna 4 horas (turno mínimo)
└─ Se activa si hay registros muy antiguos

FLUJO:
1. Presiona la opción deseada
2. Se ejecuta automáticamente
3. Toast verde = éxito
4. Lista se actualiza con los cambios
```

---

### 5. Ver Actividad Reciente

```
En "Actividad Reciente" ves:

Últimas 10 SALIDAS registradas:
├─ 👤 Nombre del estudiante
├─ 🕐 Hora de salida
├─ ⏱️ Horas trabajadas
├─ ☀️/🌙 Turno
└─ 📍 Sala

Útil para:
✓ Auditar actividad del día
✓ Verificar que se están registrando bien
✓ Detectar patrones anómalos
```

---

### 6. Gestionar Estudiantes

```
PRÓXIMAMENTE:
- Ver perfiles completos de estudiantes
- Ajustar horas manualmente
- Agregar/editar estudiantes
- Ver historial completo de cada estudiante
- Generar reportes por estudiante
```

---

### 7. Ajustar Horas Manualmente (Próximo)

```
Para correcciones especiales:

1. Abre la lista de estudiantes
2. Selecciona al estudiante
3. Presiona "Ajustar Horas"
4. Especifica:
   ├─ Horas a sumar/restar
   └─ Motivo del ajuste
5. Se registra automáticamente
6. Se crea una auditoría del cambio
```

---

### 8. Exportar Datos (En desarrollo)

```
PRÓXIMAMENTE:
- Descargar todos los estudiantes en Excel
- Descargar todos los registros en Excel
- Generar reportes PDF
- Filtrar por fecha, estudiante, turno
```

---

## ⚙️ CONFIGURACIÓN DEL SISTEMA

### Límites y Políticas

```
🔴 LÍMITES AUTOMÁTICOS:

Mínimo por turno:
├─ 3 horas requeridas
└─ Si <3: dialogo para registrar motivo

Máximo por día:
├─ 10 horas máximo
├─ Si intenta >10: se limita automáticamente
└─ Se registra como "limitado por sistema"

Auto-cierre:
├─ >24 horas sin salida manual
├─ Se cierra automáticamente con 4 horas
└─ Se marca como "auto-cerrado por sistema"

Zona horaria:
├─ America/Mexico_City (Villahermosa, Tabasco)
└─ Formato: 12 horas con AM/PM
```

---

### Variables Importantes

```
📊 ESTUDIANTE:
- required_hours: Horas totales a cumplir
- accumulated_hours: Horas completadas hasta ahora
- student_type: Servicio Social / Prácticas
- assigned_room: Sala asignada

⏱️ REGISTRO:
- check_in: Hora de entrada
- check_out: Hora de salida (NULL si activo)
- hours_worked: Horas calculadas
- early_departure_reason: Motivo si salida temprana
```

---

## 🎨 CARACTERÍSTICAS VISUALES

### Tema Oscuro/Claro

```
En la navbar superior:
1. Presiona el ícono de luna/sol
2. Cambia automáticamente el tema
3. Se guarda tu preferencia

El sistema detecta automáticamente:
✓ Preferencia de sistema operativo
✓ Última selección manual
✓ Si no tienes selección: sigue SO
```

---

### Notificaciones (Toast)

```
🟢 VERDE (Éxito)
   ├─ "Entrada registrada exitosamente"
   ├─ "Datos actualizados"
   └─ "Salida registrada correctamente"

🔴 ROJO (Error)
   ├─ "Ya tienes una entrada activa"
   ├─ "No hay entrada activa"
   └─ "Error al actualizar"

🟡 AMARILLO (Advertencia)
   └─ Aparece en dialogs de salida temprana

🔵 AZUL (Información)
   └─ "Actualizando datos..."
```

---

## 📱 DISEÑO RESPONSIVO

```
El sistema se adapta a:

📱 MÓVIL (hasta 640px)
   ├─ Menú colapsado
   ├─ Componentes apilados verticalmente
   ├─ Botones grandes y fáciles de tocar
   └─ Texto escalado para lectura

📱 TABLET (640px - 1024px)
   ├─ Menú expandido parcialmente
   ├─ Grid de 2 columnas
   └─ Componentes más espaciados

🖥️ DESKTOP (>1024px)
   ├─ Menú completo en sidebar
   ├─ Grid de múltiples columnas
   └─ Máxima información visible
```

---

## 🔒 PRIVACIDAD Y SEGURIDAD

```
✅ TUS DATOS:
├─ Autenticados con Supabase
├─ Encriptados en tránsito (HTTPS)
├─ Solo TÚ ves tus registros
└─ Supervisores ven solo de su institución

✅ CONTRASEÑAS:
├─ Nunca se envían en texto plano
├─ Se hashean automáticamente
└─ Supabase maneja la seguridad

✅ AUDITORÍA:
├─ Todos los cambios se registran
├─ Motivos quedan documentados
├─ Supervisores pueden ver qué pasó
└─ Reportes disponibles para auditoría
```

---

## ❓ PREGUNTAS FRECUENTES

### **¿Qué pasa si olvido marcar salida?**
```
- El sistema no te deja completar >10 horas
- Pasadas 24 horas: se cierra automáticamente
- El supervisor puede forzar la salida manualmente
- Se registra todo para auditoría
```

### **¿Puedo editar mis horas?**
```
- Los estudiantes NO pueden editar
- Solo supervisores pueden ajustar horas
- Cada ajuste se registra con motivo
- Queda constancia en auditoría
```

### **¿Qué significa "Salida temprana"?**
```
- Trabajaste menos de 3 horas
- Sistema requiere motivo para guardar
- El motivo se registra permanentemente
- Supervisores pueden ver todos los motivos
```

### **¿Cómo veo mi progreso?**
```
- En tu dashboard: tarjeta "Tu Progreso"
- Muestra porcentaje completado
- Horas acumuladas vs requeridas
- Horas faltantes para terminar
```

### **¿Puedo trabajar más de 10 horas?**
```
- El sistema solo registra máximo 10 horas/día
- Si trabajas 12 horas: se cuenta como 10
- Es una política de protección laboral
- Se registra que fue limitado
```

### **¿Dónde aparecen mis historial?**
```
- En tu dashboard: tarjeta "Historial de Asistencias"
- Últimos 10 registros
- Ordenados del más reciente al más antiguo
- Detalles completos de cada uno
```

### **¿Qué pasa cuando termino mis horas?**
```
- Tu tarjeta "Tu Progreso" mostrará 100%
- Mensaje de felicitación: "¡Completado!"
- Ícono especial de logro
- Supervisor recibe confirmación automática
```

---

## 🆘 SOLUCIÓN DE PROBLEMAS

### **No puedo iniciar sesión**
```
✓ Verifica email correcto
✓ Verifica contraseña correcta
✓ ¿Cuenta está activada?
✓ Intenta limpiar cookies del navegador
✓ Abre en incógnito si persiste
→ Contacta al supervisor si sigue fallando
```

### **No aparece mi entrada activa**
```
✓ Presiona el botón "Actualizar"
✓ Espera unos segundos
✓ Recarga la página (F5)
✓ Si persiste: cierra sesión y vuelve a entrar
→ Contacta al supervisor si sigue sin aparecer
```

### **Se registró mal mi hora**
```
✓ Avisa al supervisor inmediatamente
✓ El supervisor puede ajustar manualmente
✓ Se registra todo para auditoría
✓ Incluye el motivo de la corrección
→ Es importante reportarlo pronto
```

### **Quiero cambiar mi contraseña**
```
1. En el Login, haz clic en "¿Olvidaste tu contraseña?"
2. Ingresa tu correo electrónico registrado
3. Recibirás un enlace de recuperación
4. Sigue el enlace y crea tu nueva contraseña
```

---

## 📞 CONTACTO

```
SOPORTE:
- Supervisor del sistema
- Email: [contacto@sistema]
- Ubicación: Casa Universitaria del Agua

REPORTAR PROBLEMAS:
- Avisa al supervisor inmediatamente
- Incluye: qué intentabas hacer + error
- Hora exacta del problema
- Navegador y dispositivo que usas
```

---

**Última actualización:** 15 de noviembre de 2024

¡Gracias por usar el Sistema de Asistencia! 🎓
