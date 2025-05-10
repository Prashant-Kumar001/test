import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    user: null,
    isFetching: true,
    error: false
}
export const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        loginSuccess: (state, action) => {
            state.isFetching = false;
            state.user = action.payload;
        },
        loginFailure: (state) => {
            state.isFetching = false;
            state.error = true;
        },
        logout: (state) => {
            state.user = null;
            state.isFetching = false;
            state.error = false;
        }
    }
})
export default userSlice.reducer
export const { loginSuccess, loginFailure, logout } = userSlice.actions;
