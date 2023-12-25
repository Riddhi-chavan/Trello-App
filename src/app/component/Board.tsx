"use client"
import React, { useEffect } from 'react'
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { useBoardStore } from '../../../store/BoardStore';
import Column from './Column';



function Board() {

  const [board, getBoard, setBoardState , upadateInDB] = useBoardStore((state) => [
    state.board,
    state.getBoard,
    state.setBoardState , 
    state.upadateInDB
  ]);

  useEffect(() => {
    getBoard();
  }, [getBoard])



  const handleOnDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (!destination) return;
    if (type === "column") {
      const entries = Array.from(board.columns.entries());
      const [removed] = entries.splice(source.index, 1)
      entries.splice(destination.index, 0, removed)
      const rearrangedCloumns = new Map(entries);
      setBoardState({
        ...board, columns: rearrangedCloumns,
      });
    }

    const column = Array.from(board.columns);
    console.log( "columsn",column)
    const startColIndex  = column[Number(source.droppableId)]
    const finishColIndex = column[Number(destination.droppableId)]

    if (!startColIndex || !finishColIndex) return;

    const StartCol: Column = {
      id: startColIndex[0],
      todos: startColIndex[1] ? startColIndex[1].todos : [],
    };
    
    const finisCol: Column = {
      id: finishColIndex[0],
      todos: finishColIndex[1] ? finishColIndex[1].todos : [],
    };



    if(!StartCol || !finisCol) return ;

    if(source.index === destination.index && StartCol === finisCol) return ;

    const newTodo = StartCol.todos;
    const [todoMoved] = newTodo.splice(source.index , 1);

    if(StartCol.id === finisCol.id){
         
      newTodo.splice(destination.index , 0  , todoMoved)
      const newCol = {
        id : StartCol.id ,
        todos : newTodo ,
      };

      const newColumns = new Map(board.columns)
      newColumns.set(StartCol.id , newCol);
      setBoardState({...board  , columns : newColumns});
    }else {
      const   finisTodo = Array.from(finisCol.todos)
    
      finisTodo.splice(destination.index, 0 , todoMoved );

      const newColumns = new Map(board.columns);
      const newCol = {
        id: StartCol.id ,
        todos : newTodo , 
      }

      newColumns.set(StartCol.id , newCol);
      newColumns.set(finisCol.id , {
        id: finisCol.id ,
        todos : finisTodo, 
      })

      upadateInDB(todoMoved , finisCol.id)

      setBoardState({...board , columns : newColumns})



    }

  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="column">

        {(provided) => (
          <div
            className='grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto'
            {...provided.droppableProps} ref={provided.innerRef}>


            {Array.from(board.columns.entries()).map(([id, column], index) => (
              <Column
                key={id}
                id={id}
                todos={column.todos}
                index={index}
              />
            ))

            }</div>)}

      </Droppable>
    </DragDropContext>
  )
}

export default Board

