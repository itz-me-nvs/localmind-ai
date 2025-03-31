import { PayloadAction } from "@reduxjs/toolkit";
import { createAppSlice } from "../../createAppSlice";

interface userSliceModel {
    model: string,
    status: "idle" | "pending" | "error",
}

const userSliceInitialState: userSliceModel = {
    status: "idle",
    model: typeof window !== "undefined" ? localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!).model : 'qwen2.5:0.5b' : 'qwen2.5:0.5b'
}


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
            let updatedVal = JSON.parse(userStored);
            updatedVal.model = actions.payload;
            localStorage.setItem('user', JSON.stringify(updatedVal));
         }
         else {
            localStorage.setItem('user', JSON.stringify({
                model: actions.payload
            }));
         }

        })
    }),
    selectors: {
        selectModel: (selector) => {
            console.log("selector", selector);
            return selector.model
        }
    }
})

export const {setModel} = UserSlice.actions;
export const {selectModel} = UserSlice.selectors;

export default UserSlice.reducer;