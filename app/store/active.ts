// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义一个带有多个状态的store
const useStore = create(
    persist(
        (set) => ({
            count: 0,
            theme: 'light',
            user: null,
            img: '/logo.svg',
            increment: (amount: any) => set((state: any) => ({ count: state.count + amount })),
            setTheme: (theme: any) => set({ theme }),
            setUser: (user: any) => set({ user }),
        }),
        {
            name: 'my-app-storage',
            partialize: (state: any) => ({
                count: state.count,
                theme: state.theme,
                user: state.user,
            }),
        }
    )
);

export default useStore;