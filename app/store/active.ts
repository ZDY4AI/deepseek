// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            count: 0,
            theme: 'light',
            user: null,
        }),
        {
            name: 'active',
            partialize: (state: any) => ({
                count: state.count,
                theme: state.theme,
                user: state.user,
            }),
        }
    )
);

export default useStore;