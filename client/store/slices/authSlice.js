
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    user: undefined,
    islogIn: false,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setlogin: (state, action) => {
            state.user = action.payload;
            state.islogIn = true;
        },
        setlogout: (state) => {
            state.user = undefined;
            state.islogIn = false;
        }
    },
});

// A small helper of user state for `useSelector` function.
export const getUser = (state) => state.auth.user;
export const getIsLogIn = (state) => state.auth.islogIn;

// Exports all actions
export const {
    setlogin,
    setlogout,
} = authSlice.actions;

export default authSlice.reducer;