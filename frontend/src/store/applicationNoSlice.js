import { createSlice } from '@reduxjs/toolkit';

const applicationNoSlice = createSlice({
    name: 'applicationNo',
    initialState: {
        value: 1087,
        campsApplNo: null
    },
    reducers: {
        setApplicationNo : (state, action) => {
            state.value = action.payload
        },
        setCampsApplNo : (state, action) => {
            state.campsApplNo = action.payload
        }
    }
})

export const {setApplicationNo, setCampsApplNo} = applicationNoSlice.actions

export default applicationNoSlice.reducer;