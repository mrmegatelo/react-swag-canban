import { configureStore } from '@reduxjs/toolkit';
import { tasksReducer } from './entities/Task';
import { tasksListsReducer } from './entities/TasksList';

const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    tasksLists: tasksListsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
