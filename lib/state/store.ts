import { configureStore } from "@reduxjs/toolkit"

export const makeStore = ()=> {
    return configureStore({
        reducer: {}
    })
}


// Infer the return type of store
export type AppStore = ReturnType<typeof makeStore>