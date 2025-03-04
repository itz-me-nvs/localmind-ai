import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { CounterSlice } from "./features/counter/counterSlice"
import { ThemeSlice } from "./features/theme/themeSlice"

const rootReducer = combineSlices(CounterSlice, ThemeSlice)

export const makeStore = ()=> {
    return configureStore({
        reducer: rootReducer
    })
}


// Infer the return type of store
export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
export type RootState = ReturnType<typeof rootReducer>
// export type StoreState = ReturnType<AppStore['getState']>