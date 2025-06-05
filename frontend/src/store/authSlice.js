import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        token: null,
        user_id: null,
        username: null,
        role: null,
        exp: null,
        name: null,
    },
    reducers: {
        setAuth : (state, action) => {
            state.token = action.payload.token
            state.user_id = action.payload.user_id
            state.username = action.payload.username
            state.role = action.payload.role
            state.exp = action.payload.exp
            state.name = action.payload.name || null
        }
    }
})

export const {setAuth} = authSlice.actions

export default authSlice.reducer;