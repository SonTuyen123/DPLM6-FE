import {createSlice} from "@reduxjs/toolkit";



const avatarSlice = createSlice({
  name: "image",
  initialState: {
    url : ''
  },
  reducers: {
  
    setUrlAvatar: (state, actions) => {
    console.log(actions.payload);
      state.data = actions.payload;
    },

  },
});
export const {setUrlAvatar} = avatarSlice.actions;
export default avatarSlice.reducer;