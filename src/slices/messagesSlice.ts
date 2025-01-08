import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppDispatch} from "../store/store";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  content: string;
  createdAt: string;
  delivered: number;
}

interface MessagesState {
  conversation: Message[];
  pendingMessages: Message[];
  loading: boolean;
  error: unknown;
}

const initialState: MessagesState = {
  conversation: [],
  pendingMessages: [],
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setConversation(state, action: PayloadAction<Message[]>) {
      state.conversation = action.payload;
    },
    addMessage(state, action: PayloadAction<Message>) {
      const exists = state.conversation.some(
        (message) => message.id === action.payload.id
      );
      if (!exists) {
        state.conversation = [...state.conversation, action.payload];
      }
    },
    setPendingMessages(state, action: PayloadAction<Message[]>) {
      state.pendingMessages = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<unknown>) {
      state.error = action.payload;
    },
  },
});

export const {
  setConversation,
  addMessage,
  setPendingMessages,
  setLoading,
  setError,
} = messagesSlice.actions;

export default messagesSlice.reducer;

// Función para obtener la conversación

export const getConversation = async (
  friend_id: number,
  dispatch: AppDispatch
) => {
  dispatch(setLoading(true));
  try {
    // Obtener el token de autenticación desde el almacenamiento local o de la sesión
    const token = localStorage.getItem("token"); // o sessionStorage dependiendo de tu implementación

    // Verificar si el token existe
    if (!token) {
      throw new Error("No se ha encontrado el token de autenticación.");
    }

    // Realizar la solicitud con axios
    const response = await axios.get(`${API_URL}/api/chat/conversation`, {
      params: {friend_id: friend_id},
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los encabezados
      },
    });

    dispatch(setConversation(response.data));
  } catch (error: unknown) {
    if (error instanceof Error) {
      dispatch(setError(error.message));
    } else {
      dispatch(setError("Error desconocido"));
    }
  } finally {
    dispatch(setLoading(false));
  }
};

export const markMessagesAsDelivered = async (senderId: number) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) console.log("No se ha encontrado el token de autenticación.");

    await axios.put(
      `${API_URL}/api/chat/mark-delivered`,
      {senderId},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error: unknown) {
    console.error("Error al marcar mensajes como entregados:", error);
  }
};
