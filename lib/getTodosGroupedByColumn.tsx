// import React from 'react'
// import { database } from '../appwriter'

// export const getTodosGroupedByColumn = async () => {
//     const data = await database.listDocuments(
//         process.env.NEXT_PUBLIC_DATABASE_ID!,
//         process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
//     );
//     const todos = data.documents;
//     const column = todos.reduce((acc, todo) => {
//         if (!acc.get(todo.status)) {
//             acc.set(todo.status, {
//                 id: todo.status,
//                 todos : []
//             })
//         }
//         acc.get(todo.status)!.todos.push({
//             $id: todo.$id,
//             $createdAt: todo.$createdAt,
//             title: todo.title,
//             status: todo.status,
//             ...(todo.image && { image: JSON.parse(todo.image) })
//         });
//         return acc;
//     }, new Map<TypedColumn, Column>)

//     const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];
//     for (const columnType of columnTypes) {
//         if (!column.get(columnType)) {
//             column.set(columnType, {
//                 id: columnType,
//                 todos: [],
//             })
//         }
//     }

//     console.log("this is colum", column);


//     const sortedColumn = new Map(
//         Array.from(column.entries()).sort(
//             (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
//         )
//     );
//     const board: Board = {
//         columns: sortedColumn
//     }

//     return board;
// }


import React from 'react';
import { database } from '../appwriter';

export const getTodosGroupedByColumn = async () => {
  const data = await database.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE_ID!,
    process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!
  );
  const todos = data.documents;
  

  // Create a map to store columns
  const columns = new Map<TypedColumn, Column>();

  // Group todos by status
  todos.forEach((todo) => {
    const { status } = todo;

    const validStatuses: TypedColumn[] = ['todo', 'inprogress', 'done'];
    if (!validStatuses.includes(status)) {
      console.warn(`Unexpected status value found: ${status}`);
      return; // Skip this todo
    }

    // Create a column if it doesn't exist
    if (!columns.has(status)) {
      columns.set(status, {
        id: status,
        todos: [],
      });
    }

    // Add the todo to the corresponding column
    columns.get(status)!.todos.push({
      $id: todo.$id,
      $createdAt: todo.$createdAt,
      title: todo.title,
      status: todo.status,
      ...(todo.image && { image: JSON.parse(todo.image) }),
    });
  });

 

  // Ensure all column types exist, even if empty
  const columnTypes: TypedColumn[] = ['todo', 'inprogress', 'done'];
  columnTypes.forEach((columnType) => {
    if (!columns.has(columnType)) {
      columns.set(columnType, {
        id: columnType,
        todos: [],
      });
    }
  });

  // Sort columns based on predefined order
  const sortedColumns = new Map(
    Array.from(columns.entries()).sort(
      (a, b) => columnTypes.indexOf(a[0]) - columnTypes.indexOf(b[0])
    )
  );

  const board: Board = {
    columns: sortedColumns,
  };

  console.log( "board",board)


  return board;
};
