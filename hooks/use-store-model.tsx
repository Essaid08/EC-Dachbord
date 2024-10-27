import { create } from "zustand";

interface useStoreModelStore {
    isOpen : boolean ;
    onOpen : () => void ;
    onClose : () => void
}

export const useStoreModel = create<useStoreModelStore>((set) => ({
    isOpen : false ,
    onOpen : () => set({isOpen : true}) ,
    onClose : () => set({isOpen : false}),
}))