import {io, Socket} from "socket.io-client";

let socket: Socket | null = null;

const API_URL = import.meta.env.VITE_API_URL;

export const initializeSocket = (token: string | null): Socket => {
  if (!socket) {
    socket = io(`${API_URL}`, {
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("Conectado al servidor de Socket.IO");
    });

    socket.on("disconnect", () => {
      console.log("Desconectado del servidor de Socket.IO");
    });

    socket.on("error", (error: string) => {
      console.error("Error de Socket.IO:", error);
    });
  }

  return socket;
};

// Obtener la instancia del socket
export const getSocket = (): Socket | null => socket;
