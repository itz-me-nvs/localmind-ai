
// `buildCreateSlice` allows us to create a slice with async thunks.

import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit";

export const createAppSlice = buildCreateSlice({
    creators: {asyncThunk: asyncThunkCreator }
})