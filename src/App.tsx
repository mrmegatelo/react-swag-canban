import React, { FC, useCallback } from 'react';
import styled from 'styled-components';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import Column from './components/Column';
import Task from './components/Task';
import { useDispatch, useSelector } from 'react-redux';
import { tasksListsActions, tasksListsSelectors } from './store/entities/TasksList';
import { tasksActions, taskSelectors } from './store/entities/Task';

const Main = styled.main`
  padding: 64px 32px;
  display: grid;
  grid-template-columns: repeat(5, minmax(300px, 1fr));
  grid-column-gap: 32px;
  grid-row-gap: 32px;
`;

const App: FC = () => {
  const dispatch = useDispatch();
  const tasksLists = useSelector(tasksListsSelectors.selectAll);
  const tasksById = useSelector(taskSelectors.selectEntities);

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      const { source, destination } = result;

      if (!destination) {
        return;
      }

      if (source.droppableId === destination.droppableId) {
        dispatch(
          tasksListsActions.tasksReordered({
            listId: source.droppableId,
            startIndex: source.index,
            endIndex: destination.index,
          })
        );
      } else {
        dispatch(
          tasksListsActions.taskMoved({
            sourceListId: source.droppableId,
            destinationListId: destination.droppableId,
            startIndex: source.index,
            endIndex: destination.index,
          })
        );
      }
    },
    [dispatch]
  );

  const handleTextChange = useCallback(
    id => (text: string) => {
      dispatch(tasksActions.taskUpdated({ id, text }));
    },
    [dispatch]
  );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Main>
        {tasksLists.map(({ taskIds, title, id }) => (
          <Column key={id} droppableId={id} title={title}>
            {taskIds.map((taskId, idx) => (
              <Task
                key={taskId}
                draggableId={taskId}
                index={idx}
                text={tasksById[taskId]?.text || ''}
                onTextChange={handleTextChange(taskId)}
              />
            ))}
          </Column>
        ))}
      </Main>
    </DragDropContext>
  );
};

export default App;
