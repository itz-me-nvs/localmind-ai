import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";


interface counterSliceModel {
    value: number,
    status: "idle" | "pending" | "error"
}

const counterInitialState: counterSliceModel = {
    status: 'idle',
    value: 0
}


export const CounterSlice = createSlice({
    name: 'counter',
    initialState: counterInitialState,
    reducers: {
        increment: (state)=> {
            state.value +=1;
        },
        decrement: (state)=> {
            state.value -=1;
        }
    },
    extraReducers: (builder)=> {
        builder.addCase(incrementAsync.pending, ()=> {
            console.log("pending")
        })
    }
})

const incrementAsync = createAsyncThunk(
    "counter/incrementAsync",
    async (value: number)=> {
        await new Promise((resolve)=> setTimeout(resolve, 1000))
        return value;
    }
)