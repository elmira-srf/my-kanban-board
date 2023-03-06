import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

interface Task {
  id: string;
  content: string;
}

const tasks: Task[] = [
  { id: 'task-1', content: 'Task 1' },
  { id: 'task-2', content: 'Task 2' },
  { id: 'task-3', content: 'Task 3' },
  { id: 'task-4', content: 'Task 4' },
];

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

const columns: Column[] = [
  {
    id: 'column-1',
    title: 'To do',
    taskIds: ['task-1', 'task-2', 'task-3', 'task-4'],
  },
  {
    id: 'column-2',
    title: 'In progress',
    taskIds: [],
  },
  {
    id: 'column-3',
    title: 'Done',
    taskIds: [],
  },
];

const Board = () => {
const [state, setState] = useState<{ tasks: Task[]; columns: Column[] }>({ tasks, columns });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    const sourceColumn = state.columns.find((col) => col.id === source.droppableId);
    const destinationColumn = state.columns.find((col) => col.id === destination.droppableId);

    if (!sourceColumn || !destinationColumn) {
      return;
    }

    const sourceTaskIds = [...sourceColumn.taskIds];
    const destinationTaskIds = [...destinationColumn.taskIds];

    sourceTaskIds.splice(source.index, 1);
    destinationTaskIds.splice(destination.index, 0, draggableId);

    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };

    const newColumns = state.columns.map((col) => {
      if (col.id === newSourceColumn.id) {
        return newSourceColumn;
      } else if (col.id === newDestinationColumn.id) {
        return newDestinationColumn;
      } else {
        return col;
      }
    });

    const newState = {
      tasks: state.tasks,
      columns: newColumns,
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {state.columns.map((column) => (
        <div key={column.id} className="column">
          <h3>{column.title}</h3>
          <Droppable droppableId={column.id}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
              >
                {column.taskIds.map((taskId, index) => {
                  const task = state.tasks.find((t) => t.id === taskId);

                  return (
                    <Draggable key={task?.id} draggableId={task?.id ?? 'unknown'} index={index}>

                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task ${snapshot.isDragging ? 'dragging' : ''}`}
                        >
                          {task?.content}
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      ))}
    </DragDropContext>
  );
};

export default Board;

