import { create } from "zustand"

type LoaderType = {
    loader: boolean,
    setLoader: (value:boolean) => void
}

export const useLoadingState = create<LoaderType>((set) => ({
    loader: false,
    setLoader: (value) => set({loader: value})
}))