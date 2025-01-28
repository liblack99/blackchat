# BlackChat

Este proyecto es una aplicación de chat en tiempo real diseñada para garantizar una comunicación eficiente y confiable. Ofrece a los usuarios la posibilidad de enviar mensajes en tiempo real y compartir imágenes de perfil, todo dentro de una interfaz intuitiva y moderna.

## Demo
Puedes ver el proyecto desplegado [aquí](https://blackchat-app.vercel.app/).

## Capturas de pantalla
(Agrega aquí imágenes representativas de tu aplicación).

## Características
- **Mensajería en Tiempo Real**: Comunicación instantánea mediante websockets.
- **Gestión de Usuarios**: Sistema de login seguro con autenticación basada en tokens.
- **Almacenamiento de Imágenes**: Fotos de perfil almacenadas en Firebase.
- **Optimización de Imágenes**: Compresión de imágenes antes de su almacenamiento.
- **Interfaz Reactiva**: UI dinámica y adaptable creada con React y Tailwind CSS.
- **Escalabilidad**: Uso de Turso como base de datos relacional.

## Tecnologías Utilizadas
### **Frontend**
- React con TypeScript
- Redux Toolkit
- Tailwind CSS
- React Router
- Firebase (solo para almacenamiento de imágenes)
- Socket.IO Client

### **Backend**
- Node.js con Express
- Turso DB
- JSON Web Tokens (JWT)
- Bcrypt para cifrado de contraseñas
- Socket.IO

## Instalación

### **Frontend**
1. Clona este repositorio: git clone <https://github.com/liblack99/blackchat.git>
2. Entra en el directorio del proyecto: cd blackchat
3. Instala las dependencias: npm install
4. Inicia el servidor de desarrollo: npm run dev
5. Abre tu navegador y visita el puerto asignado


### **Backend**
1. Clona este repositorio: git clone <https://github.com/liblack99/chat-backend.git>
2. Entra en el directorio del proyecto: cd chat-backend
3. Instala las dependencias: npm install
4. Crea un archivo .env con las siguientes variables de entorno:
   -PORT
   -TURSO_DB_URL
   -TURSO_DB_TOKEN
   -JWT_SECRET
5. Inicia el servidor de desarrollo: npm run dev
6. El backend estará disponible en: <http://localhost:el puerto que elegiste>


!Si gustas tener el repositorio aparte tambien cuento con un repositorio solo del backend [aqui](https://github.com/liblack99/chat-backend).

## Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar mi portafolio, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama (`git checkout -b feature/improvement`).
3. Haz commit de tus cambios (`git commit -am 'Add new feature'`).
4. Sube tus cambios (`git push origin feature/improvement`).
5. Abre una solicitud de extracción.

## Licencia

Este proyecto está bajo la [Licencia MIT](LICENSE).


