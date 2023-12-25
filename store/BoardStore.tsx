import { create } from 'zustand'
import { getTodosGroupedByColumn } from '../lib/getTodosGroupedByColumn';
import { ID, database, storage } from '../appwriter';
import uploadImage from '../lib/uploadImage';

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  upadateInDB: (todo: Todo, columnId: TypedColumn) => void;
  newTaskInput: string;
  searchString: string;
  setNewTaskInput: (input: string) => void;
  setSearchString: (searchString: string) => void;
  addTask: (todo: string, columnId: TypedColumn, image?: File | null) => void;
  deleteTask: (taskIndex: number, todoId: Todo, id: TypedColumn) => void;
  newTaskType: TypedColumn;
  setNewTaskType: (columnId: TypedColumn) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumn, Column>()
  },
  searchString: "",
  newTaskInput: "",
  newTaskType: "todo",
  setImage: (image: File | null) => set((currentState: BoardState) => {
    return { ...currentState, image: image };
  }),
  image: null,
  setSearchString: (searchString) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),
  setNewTaskInput: (input: string) => set({ newTaskInput: input }),
  setNewTaskType: (columnId: TypedColumn) => set({ newTaskType: columnId }),
 

  deleteTask: async (taskIndex: number, todo: Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)

    newColumns.get(id)?.todos.splice(taskIndex, 1)

    set({ board: { columns: newColumns } })

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId)


    }

    await database.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    );

  },
  upadateInDB: async (todo, columnId) => {
    await database.updateDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id,
      {
        title: todo.title,
        status: columnId,

      }

    );
  },

  addTask: async (todo: string, columnId: TypedColumn, image?: File | null) => {
    let file: Image | undefined;
    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
           bucketId :fileUploaded.bucketId ,
           fileId : fileUploaded.$id , 
        }
      }
    }

     const {$id } = await database.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title : todo ,
         status : columnId ,
          ...(file && {image : JSON.stringify(file)}),
      }
    );

    set({newTaskInput : ""});

    set((state) => {  
      const newColumns  =  new Map(state.board.columns);

      const newTodo : Todo = {    
        $id,
        $createdAt : new Date().toISOString(),
        title :todo ,
        status : columnId ,
        ...(file && {image : file }),
      };
      const column =  newColumns.get(columnId);

      if(!column){
        newColumns.set(columnId , {
          id : columnId ,   
          todos : [newTodo],
        })
      }else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }
      return {
        board :{
          columns :   newColumns ,
        }
      }
    })


  }
  


}))

export { useBoardStore };

