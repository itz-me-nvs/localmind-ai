import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../createAppSlice";

interface userSliceModel {
    model: string,
    status: "idle" | "pending" | "error",
    keepMemory: boolean
}

const userSliceInitialState: userSliceModel = {
    status: "idle",
    model: typeof window !== "undefined" ? localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).model : 'qwen2.5:0.5b' : 'qwen2.5:0.5b',
    keepMemory: typeof window !== "undefined" ? localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).keepMemory : true : true
}

// typeof window !== "undefined" ? localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).keepMemory || true : true : true

console.log("userSliceInitialState", userSliceInitialState);



export const UserSlice = createAppSlice({
    name: "user",
    initialState: userSliceInitialState,
    reducers: (create)=> ({
        setModel: create.reducer((state, actions: PayloadAction<string>) => {
            console.log("actions", actions);
            
         state.model = actions.payload;

         // update localStorage of model
         const userStored = localStorage.getItem('user');
         if (userStored) {
            const updatedVal = JSON.parse(userStored);
            updatedVal.model = actions.payload;
            localStorage.setItem('user', JSON.stringify(updatedVal));
         }
         else {
            localStorage.setItem('user', JSON.stringify({
                model: actions.payload
            }));
         }

        }),
        setKeepChatMemory: create.reducer((state, actions: PayloadAction<boolean>) => {
            state.keepMemory = actions.payload;

            const userStored = localStorage.getItem('user');
            if (userStored) {
               let updatedVal = JSON.parse(userStored);
               updatedVal.keepMemory = actions.payload;
               localStorage.setItem('user', JSON.stringify(updatedVal));
            }
            else {
               localStorage.setItem('user', JSON.stringify({
                   keepMemory: actions.payload
               }));
            }
        })
    }),
    selectors: {
        selectModel: (selector) => selector.model,
        selectKeepChatMemory: (selector) => selector.keepMemory
    }
})

export const {setModel, setKeepChatMemory} = UserSlice.actions;
export const {selectModel, selectKeepChatMemory} = UserSlice.selectors;

export default UserSlice.reducer;