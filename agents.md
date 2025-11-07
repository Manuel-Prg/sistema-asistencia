# Reglas para Agentes de IA

## 1. Estilo y Convenciones de Código (Estricto)
- **NAMING CONVENTION**: TODAS las variables, funciones, nombres de archivos y carpetas DEBEN usar `snake_case` estrictamente.
    - *Incorrecto:* `myVariable`, `getUserData`, `AttendanceController.js`
    - *Correcto:* `my_variable`, `get_user_data`, `attendance_controller.js`
- **COMENTARIOS**: CADA función nueva debe incluir un bloque de comentario JSDoc (o equivalente según lenguaje) encima, detallando parámetros (`@param`) y retornos (`@returns`).

## 2. Arquitectura y Separación de Responsabilidades
- **NO LÓGICA EN VISTAS**: Los archivos de interfaz de usuario (frontend/vistas) NO deben realizar llamadas directas a la base de datos ni contener lógica de negocio compleja. Deben solicitar datos a una capa de servicio o controlador API.
- **CAPA DE SERVICIOS**: La lógica principal del sistema (ej. calcular horas trabajadas, validar permisos) debe residir en archivos dedicados (ej. carpeta `services/` o `logic/`), nunca dispersa en controladores.
- **DRY (Don't Repeat Yourself)**: Antes de crear una nueva función de utilidad, verifica si ya existe una similar para reutilizarla.

## 3. Seguridad y Manejo de Datos
- **SECRETOS**: NUNCA escribas credenciales, contraseñas, tokens o claves de API directamente en el código. Usa siempre variables de entorno (ej. `.env`).
- **VALIDACIÓN**: NUNCA confíes en los datos de entrada del usuario. Toda información recibida en el backend debe ser validada antes de procesarse o guardarse en la base de datos.
- **ERRORES**: Usa bloques `try/catch` para operaciones asíncronas (llamadas a DB, APIs externas). No dejes errores "silenciosos"; regístralos adecuadamente.