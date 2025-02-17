// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义一个带有多个状态的store
const useStore = create(
    persist(
        (set) => ({
            count: 0,
            img: '/logo.svg',
            increment: (amount: any) => set((state: any) => ({ count: state.count + amount })),

        }),
        {
            name: 'my-app-storage',
            partialize: (state: any) => ({ 
                img: state.img
            }),
        }
    )
);

export default useStore;