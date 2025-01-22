import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {AppDispatch} from "../store/store";

const API_URL = import.meta.env.VITE_API_URL;

// Define your state types
interface Friend {
  id: number;
  friend_id: number;
  username: string;
  profileImage: string;
}

interface FriendsState {
  friends: Friend[];
  pendingRequests: Friend[];
  sentRequests: number[];
  searchResults: Friend[];
  query: string;
  loading: boolean;
  error: string | null;
  friendChatId: number;
  status: boolean;
}

// Initial state
const initialState: FriendsState = {
  friends: [],
  pendingRequests: [],
  sentRequests: [],
  searchResults: [],
  loading: false,
  error: null,
  query: "",
  friendChatId: 0,
  status: false,
};

// Create slice
const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    setLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    setFriends: (state, action: PayloadAction<Friend[]>) => {
      state.loading = false;
      state.friends = action.payload;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      state.loading = false;
      state.friends.push(action.payload);
    },
    setPendingRequests: (state, action: PayloadAction<Friend[]>) => {
      state.loading = false;
      state.pendingRequests = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<Friend[]>) => {
      state.loading = false;
      state.searchResults = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setQuery: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.query = action.payload;
    },
    setFriendChatId: (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.friendChatId = action.payload;
    },
    updatePendingRequests: (state, action: PayloadAction<number>) => {
      state.pendingRequests = state.pendingRequests.filter(
        (reject: Friend) => reject.id !== action.payload
      );
    },
    setStatus: (state, action: PayloadAction<boolean>) => {
      state.loading = false;
      state.status = action.payload;
    },
    addSendFriendRequest: (state, action: PayloadAction<number>) => {
      state.sentRequests.push(action.payload);
    },
  },
});

export const {
  setLoading,
  setFriends,
  setPendingRequests,
  setSearchResults,
  setError,
  setQuery,
  setFriendChatId,
  setStatus,
  updatePendingRequests,
  addSendFriendRequest,
  addFriend,
} = friendsSlice.actions;

export const fetchFriends =
  (userId: number | unknown) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.get(`${API_URL}/api/friends/list/${userId}`);
      dispatch(setFriends(response.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(error.response?.data || "Error al obtener lista de amigos")
        );
      } else {
        dispatch(setError("Error desconocido"));
      }
    }
  };

export const sendFriendRequest =
  (userId: number | unknown, friendId: number) =>
  async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.post(`${API_URL}/api/friends/send`, {
        user_id: userId,
        friend_id: friendId,
      });
      console.log(response);
      dispatch(setError(""));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(
            error.response?.data || "Error al enviar solicitud de amistad"
          )
        );
      } else {
        dispatch(setError("Error desconocido"));
      }
    }
  };

export const acceptFriendRequest =
  (requestId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.put(
        `${API_URL}/api/friends/accept/${requestId}`
      );
      console.log(response);
      dispatch(setError(""));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Aquí verificamos si el error es de tipo AxiosError
        dispatch(
          setError(
            error.response?.data || "Error al aceptar solictud de amistad"
          )
        );
      } else {
        dispatch(setError("Error desconocido"));
      }
    }
  };

export const rejectFriendRequest =
  (requestId: number) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.put(
        `${API_URL}/api/friends/reject/${requestId}`
      );
      console.log(response);
      dispatch(setError(""));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(
            error.response?.data || "Error al rechazar solicitud de amistad"
          )
        );
      } else {
        dispatch(setError("Error desconocido"));
      }
    }
  };

export const searchUsers = (query: string) => async (dispatch: AppDispatch) => {
  dispatch(setLoading());
  try {
    const response = await axios.get(`${API_URL}/api/friends/search`, {
      params: {query},
    });
    dispatch(setSearchResults(response.data));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Aquí verificamos si el error es de tipo AxiosError
      dispatch(setError(error.response?.data || "Error al conseguir usuario"));
    } else {
      // En caso de que no sea un error de Axios
      dispatch(setError("Error desconocido"));
    }
  }
};

export const fetchPendingRequests =
  (userId: number | unknown) => async (dispatch: AppDispatch) => {
    dispatch(setLoading());
    try {
      const response = await axios.get(
        `${API_URL}/api/friends/pending/${userId}`
      );
      dispatch(setPendingRequests(response.data));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(
          setError(
            error.response?.data || "Error al obtener solicitudes pendientes"
          )
        );
      } else {
        dispatch(setError("Error desconocido"));
      }
    }
  };

export default friendsSlice.reducer;
