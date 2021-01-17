import React, { FC } from 'react';
import styled from 'styled-components';
import { Droppable, DroppableProps } from 'react-beautiful-dnd';

const Wrapper = styled.div`
  border-radius: 2px;
  background-color: #ebecf0;
`;

const Title = styled.h4`
  margin: 0;
  padding: 8px 8px 0;
  font-size: 16px;
  line-height: 20px;
  font-weight: 600;
  user-select: none;
`;

const Body = styled.div<{ isDraggingOver: boolean }>`
  padding: 8px;
  background-color: ${({ isDraggingOver }) => (isDraggingOver ? 'lightblue' : '#ebecf0')};
`;

interface IColumn extends Omit<DroppableProps, 'children'> {
  title: string;
}

const Column: FC<IColumn> = ({ title, children, ...props }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Droppable {...props}>
        {(provided, snapshot) => (
          <Body ref={provided.innerRef} isDraggingOver={snapshot.isDraggingOver}>
            {children}
            {provided.placeholder}
          </Body>
        )}
      </Droppable>
    </Wrapper>
  );
};

export default Column;
