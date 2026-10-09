import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type NotificationState = { unreadCount: number };

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { unreadCount: 0 } as NotificationState,
  reducers: {
    setUnreadCount: (state, action: PayloadAction<number>) => {
      state.unreadCount = Math.max(0, action.payload);
    },
    incrementUnreadCount: (state, action: PayloadAction<number | undefined>) => {
      state.unreadCount += action.payload ?? 1;
    },
    clearUnreadCount: (state) => {
      state.unreadCount = 0;
    },
  },
});

export const { clearUnreadCount, incrementUnreadCount, setUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
