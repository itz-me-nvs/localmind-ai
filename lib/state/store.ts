import { combineSlices, configureStore } from "@reduxjs/toolkit"
import { ThemeSlice } from "./features/theme/themeSlice"
import { UserSlice } from "./features/user/userSlice"

const rootReducer = combineSlices(ThemeSlice, UserSlice)

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