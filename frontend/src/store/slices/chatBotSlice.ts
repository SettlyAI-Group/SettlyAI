import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ChatBotState {
  intent: string;
}

const initialState: ChatBotState = {
  intent: 'start',
};

const chatBotSlice = createSlice({
  name: 'chatBot',
  initialState,
  reducers: {
    setIntent(state, action: PayloadAction<string>) {
      state.intent = action.payload;
    },
  },
});

export const { setIntent } = chatBotSlice.actions;
export default chatBotSlice.reducer;
