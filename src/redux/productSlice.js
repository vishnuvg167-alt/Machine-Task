import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = "http://localhost:3000/products";


export const fetPro = createAsyncThunk(
  "products/fetch",
  async () => {
    const res = await axios.get(API);
    return res.data;
  }
);

export const addPro = createAsyncThunk(
  "products/add",
  async (product) => {
    const res = await axios.post(API, product);
    return res.data;
  }
);

export const upPro = createAsyncThunk(
  "products/update",
  async (product) => {
    const res = await axios.put(`${API}/${product.id}`, product);
    return res.data;
  }
);

export const delPro = createAsyncThunk(
  "products/delete",
  async (id) => {
    await axios.delete(`${API}/${id}`);
    return id;
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetPro.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetPro.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetPro.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addPro.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(upPro.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(delPro.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (p) => p.id !== action.payload
        );
      });
  },
});

export default productSlice.reducer;