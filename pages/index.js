"use client";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Column = dynamic(() => import("../src/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};

export default function Home() {
  const [state, setState] = useState(initialData);

  const onDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = state.columns[source.droppableId];
    const destinationCol = state.columns[destination.droppableId];

    if (sourceCol.id === destinationCol.id) {
      const newColumn = reorderColumnList(
        sourceCol,
        source.index,
        destination.index
      );

      const newState = {
        ...state,
        columns: {
          ...state.columns,
          [newColumn.id]: newColumn,
        },
      };
      setState(newState);
      return;
    }
    const startTaskIds = Array.from(sourceCol.taskIds);
    const [removed] = startTaskIds.splice(source.index, 1);
    const newStartCol = {
      ...sourceCol,
      taskIds: startTaskIds,
    };

    const endTaskIds = Array.from(destinationCol.taskIds);
    endTaskIds.splice(destination.index, 0, removed);
    const newEndCol = {
      ...destinationCol,
      taskIds: endTaskIds,
    };

    const newState = {
      ...state,
      columns: {
        ...state.columns,
        [newStartCol.id]: newStartCol,
        [newEndCol.id]: newEndCol,
      },
    };

    setState(newState);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex flex-col bg-gray-900 min-h-screen w-full text-white py-16">
        <div className="px-16 flex justify-between ">
          {state.columnOrder.map((columnId) => {
            const column = state.columns[columnId];
            const tasks = column.taskIds.map((taskId) => state.tasks[taskId]);
            return (
              <Column
                key={column.id}
                column={column}
                tasks={tasks}
                columnId={columnId}
              />
            );
            // return (
            //   <div key={column.id} className="flex-1 px-4">
            //     <h2 className="text-lg font-bold mb-4">{column.title}</h2>
            //     <div className="bg-gray-800 p-4 rounded-lg">
            //       <Droppable droppableId={column.id}>
            //         {(provided) => (
            //           <div {...provided.droppableProps} ref={provided.innerRef}>
            //             {tasks.map((task, index) => (
            //               <Draggable
            //                 key={task.id}
            //                 draggableId={task.id.toString()}
            //                 index={index}
            //               >
            //                 {(provided) => (
            //                   <div
            //                     ref={provided.innerRef}
            //                     {...provided.draggableProps}
            //                     {...provided.dragHandleProps}
            //                     className="bg-gray-700 p-2 rounded-md mb-2"
            //                   >
            //                     {task.content}
            //                   </div>
            //                 )}
            //               </Draggable>
            //             ))}
            //             {provided.placeholder}
            //           </div>
            //         )}
            //       </Droppable>
            //     </div>
            //   </div>
            // );
          })}
        </div>
      </div>
    </DragDropContext>
  );
}

const initialData = {
  tasks: {
    1: { id: 1, content: "Configure Next.js application" },
    2: { id: 2, content: "Configure Next.js and tailwind " },
    3: { id: 3, content: "Create sidebar navigation menu" },
    4: { id: 4, content: "Create page footer" },
    5: { id: 5, content: "Create page navigation menu" },
    6: { id: 6, content: "Create page layout" },
  },
  columns: {
    "column-1": {
      id: "column-1",
      title: "TO-DO",
      taskIds: [1, 2, 3, 4, 5, 6],
    },
    "column-2": {
      id: "column-2",
      title: "IN-PROGRESS",
      taskIds: [],
    },
    "column-3": {
      id: "column-3",
      title: "COMPLETED",
      taskIds: [],
    },
  },
  columnOrder: ["column-1", "column-2", "column-3"],
};
