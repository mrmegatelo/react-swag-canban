import React, { ChangeEvent, KeyboardEvent, FC, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Draggable, DraggableProps } from 'react-beautiful-dnd';
import AutosizeTextarea from 'react-autosize-textarea';

const Wrapper = styled.div`
  user-select: none;
  background-color: #fff;
  padding: 16px;

  & + & {
    margin-top: 8px;
  }
`;

interface IEditable {
  isEditing: boolean;
}

const Text = styled.p<IEditable>`
  font-size: 12px;
  line-height: 16px;
  margin: 0;
  display: ${({ isEditing }) => (isEditing ? 'none' : 'block')};
`;

const Textarea = styled(AutosizeTextarea)<IEditable>`
  font-size: 12px;
  line-height: 16px;
  border: none;
  padding: 0;
  display: ${({ isEditing }) => (isEditing ? 'block' : 'none')};
  resize: none;
  &:focus {
    outline: none;
  }
`;

interface ITask extends Omit<DraggableProps, 'children'> {
  text: string;
  onTextChange: (text: string) => void;
}

const Task: FC<ITask> = ({ text, onTextChange, ...props }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const textareRef = useRef<HTMLTextAreaElement>(null);
  const toggleEditing = () => setIsEditing(prevState => !prevState);
  const handleBlur = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onTextChange(e.target.value);
    toggleEditing();
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      textareRef.current?.blur();
    }
  };

  useEffect(() => {
    if (isEditing) {
      textareRef.current?.focus();
      textareRef.current?.setSelectionRange(0, text.length);
    }
  }, [isEditing, text]);

  return (
    <Draggable {...props}>
      {provided => (
        <Wrapper ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          <Textarea
            isEditing={isEditing}
            ref={textareRef}
            onBlur={handleBlur}
            defaultValue={text}
            onKeyPress={handleKeyPress}
          />
          <Text isEditing={isEditing} onClick={toggleEditing}>
            {text}
          </Text>
        </Wrapper>
      )}
    </Draggable>
  );
};

export default Task;
