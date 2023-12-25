import {create } from "zustand"

interface ModelState  {

    isOpen : boolean;
    openModel:  ()  => void ;
    closeModel : () =>  void ;
}

export const useModelStore = create<ModelState>()((set) => ({

    isOpen : false ,
    openModel: () =>set({isOpen : true }),
    closeModel : () => set({isOpen : false})
}))