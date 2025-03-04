import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface counterSliceModel {
    value: number,
    status: "idle" | "pending" | "error"
}

const counterInitialState: counterSliceModel = {
    status: 'idle',
    value: Number(localStorage.getItem('theme')) || 0
}


export const CounterSlice = createSlice({
    name: 'counter',
    initialState: counterInitialState,
    reducers: {
        increment: (state)=> {
            state.value = 1;
            localStorage.setItem('theme', '1')
        },
        decrement: (state)=> {
            state.value = 0;
            localStorage.setItem('theme', '0')
        }
    },
    extraReducers: (builder)=> {
        builder.addCase(incrementAsync.pending, ()=> {
            console.log("pending")
        })
        .addCase(incrementAsync.fulfilled, (state)=> {
            state.value += 1
        })
        .addCase(incrementAsync.rejected, ()=> {
            console.log("error")
        })
    }
})

export const incrementAsync = createAsyncThunk(
    "counter/incrementAsync",
    async (value: number)=> {
        await new Promise((resolve)=> setTimeout(resolve, 2000))
        return value;
    }
)


export const {increment, decrement,} = CounterSlice.actions;

export default CounterSlice.reducer;