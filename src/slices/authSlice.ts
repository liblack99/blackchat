import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {AppDispatch} from "../store/store";

const API_URL = import.meta.env.VITE_API_URL;

interface User {
  id: number;
  username: string;
  profileImage: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface RegisterData {
  fullName: string;
  email: string;
  password: string;
  profileImage: string;
}

interface LoginData {
  email: string;
  password: string;
}

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
    },
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setAuth: (state, action: PayloadAction<{token: string; user: User}>) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

// Exportamos las acciones y el reducer
export const {logout, startLoading, setAuth, setError} = authSlice.actions;
export default authSlice.reducer;

// Funciones asincrónicas: Ahora con tipado de error (AxiosError)
export const registerUser =
  (userData: RegisterData) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        userData
      );
      dispatch(setAuth({token: response.data.token, user: response.data.user}));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Aquí verificamos si el error es de tipo AxiosError
        dispatch(
          setError(error.response?.data || "Error al registrar el usuario")
        );
      } else {
        // En caso de que no sea un error de Axios
        dispatch(setError("Error desconocido"));
      }
    }
  };

export const loginUser =
  (loginData: LoginData) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, loginData);

      dispatch(setAuth({token: response.data.token, user: response.data.user}));

      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        dispatch(setError(error.response?.data || "Error al iniciar sesión"));
        throw new Error(error.response?.data || "Error al iniciar sesión");
      } else {
        dispatch(setError("Error desconocido"));
        throw new Error("Error desconocido");
      }
    }
  };
export const fetchUserData = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading());

  const token = localStorage.getItem("token"); // Obtener el token desde el almacenamiento local

  if (!token) {
    dispatch(setError("Token no encontrado"));
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/api/auth/user`, {
      headers: {
        Authorization: `Bearer ${token}`, // Pasar el token en la cabecera
      },
    });

    dispatch(setAuth({token, user: response.data})); // Suponiendo que la respuesta contiene los datos del usuario
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      dispatch(
        setError(
          error.response?.data || "Error al obtener los datos del usuario"
        )
      );
    } else {
      dispatch(setError("Error desconocido"));
    }
  }
};
