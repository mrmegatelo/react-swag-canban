import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ITask {
  id: string;
  text: string;
  reactions?: string[];
}

const tasksAdapter = createEntityAdapter<ITask>();

const tasksInitialState = [
  {
    id: 'first',
    text: 'Сделать тестовое задание',
  },
  {
    id: 'second',
    text: 'Пройти интервью',
  },
  {
    id: 'third',
    text: '????',
  },
  {
    id: 'fourth',
    text: 'PROFIT',
  },
];

const emptyInitialState = tasksAdapter.getInitialState();
const filledState = tasksAdapter.upsertMany(emptyInitialState, tasksInitialState);

interface ITaskUpdatedAction {
  id: string;
  text: string;
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState: tasksAdapter.getInitialState(filledState),
  reducers: {
    taskUpdated(state, action: PayloadAction<ITaskUpdatedAction>) {
      const { id, text } = action.payload;
      tasksAdapter.updateOne(state, { id, changes: { text } });
    },
  },
});

export const tasksReducer = tasksSlice.reducer;
export const tasksActions = tasksSlice.actions;
export const taskSelectors = tasksAdapter.getSelectors<RootState>(state => state.tasks);
