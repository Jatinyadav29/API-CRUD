import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as authApi from "@/features/auth/api/auth.api";
import normalizeApiError from "@/shared/utils/normalizeApiError";

export const bootstrapSession = createAsyncThunk(
  "auth/bootstrapSession",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const { accessToken } = await authApi.refresh();
      dispatch(setAccessToken(accessToken));
      const user = await authApi.getMe();
      return { user, accessToken };
    } catch {
      return rejectWithValue(null);
    }
  },
);

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.login(payload);
      return data;
    } catch (err) {
      return rejectWithValue(normalizeApiError(err));
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const data = await authApi.register(payload);
      return data;
    } catch (err) {
      return rejectWithValue(normalizeApiError(err));
    }
  },
);

export const logout = createAsyncThunk("auth/logout", async () => {
  try {
    await authApi.logout();
  } catch {}
});

const initialState = {
  user: null,
  accessToken: null,
  status: "idle",
  error: null,
  isInitializing: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload;
    },
    clearSession(state) {
      state.user = null;
      state.accessToken = null;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapSession.pending, (state) => {
        state.isInitializing = true;
      })
      .addCase(bootstrapSession.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = "idle";
        state.error = null;
        state.isInitializing = false;
      })
      .addCase(bootstrapSession.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
        state.status = "idle";
        state.isInitializing = false;
      });

    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = "idle";
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.status = "idle";
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(logout.pending, (state) => {
        state.status = "loading";
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
        state.status = "idle";
      })
      .addCase(logout.rejected, (state) => {
        state.user = null;
        state.accessToken = null;
        state.error = null;
        state.status = "idle";
      });
  },
});

export const { setAccessToken, clearSession } = authSlice.actions;

export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => Boolean(state.auth.accessToken);
export const selectIsSeller = (state) => state.auth.user?.role === "seller";
export const selectIsInitializing = (state) => state.auth.isInitializing;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;
