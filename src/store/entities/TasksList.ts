import { createEntityAdapter, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ITasksList {
  id: string;
  title: string;
  taskIds: string[];
}

const tasksListsAdapter = createEntityAdapter<ITasksList>();

const tasksListsInitialState = [
  {
    id: 'todo',
    title: 'To Do',
    taskIds: ['third', 'fourth'],
  },
  {
    id: 'inProgress',
    title: 'In Progress',
    taskIds: ['second'],
  },
  {
    id: 'done',
    title: 'Done',
    taskIds: ['first'],
  },
];

const emptyInitialState = tasksListsAdapter.getInitialState();
const filledState = tasksListsAdapter.upsertMany(emptyInitialState, tasksListsInitialState);

interface ITaskReorderedAction {
  listId: string;
  startIndex: number;
  endIndex: number;
}

interface ITaskMovedAction {
  sourceListId: string;
  destinationListId: string;
  startIndex: number;
  endIndex: number;
}

const tasksListsSlice = createSlice({
  name: 'taskLists',
  initialState: tasksListsAdapter.getInitialState(filledState),
  reducers: {
    taskMoved(state, action: PayloadAction<ITaskMovedAction>) {
      const { sourceListId, destinationListId, startIndex, endIndex } = action.payload;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const sourceClone = Array.from(state.entities[sourceListId].taskIds);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const destClone = Array.from(state.entities[destinationListId].taskIds);
      const [removed] = sourceClone.splice(startIndex, 1);

      destClone.splice(endIndex, 0, removed);

      tasksListsAdapter.updateMany(state, [
        { id: sourceListId, changes: { taskIds: sourceClone } },
        { id: destinationListId, changes: { taskIds: destClone } },
      ]);
    },
    tasksReordered(state, action: PayloadAction<ITaskReorderedAction>) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const result = Array.from(state.entities[action.payload.listId].taskIds);
      const [removed] = result.splice(action.payload.startIndex, 1);
      result.splice(action.payload.endIndex, 0, removed);

      tasksListsAdapter.updateOne(state, { id: action.payload.listId, changes: { taskIds: result } });
    },
  },
});

export const tasksListsReducer = tasksListsSlice.reducer;
export const tasksListsActions = tasksListsSlice.actions;
export const tasksListsSelectors = tasksListsAdapter.getSelectors<RootState>(state => state.tasksLists);
