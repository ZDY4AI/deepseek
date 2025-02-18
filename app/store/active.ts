// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 定义一个带有多个状态的store
const useStore = create(
    persist(
        (set) => ({
            count: 0,
            platform_img: '/deep-seek.png',
            company_img: '/新有梦.png',
            company_background: '/background.png',
            text: '欢迎！新建区政务服务数据管理局AI智能助手',
            increment: (amount: number) => set((state: any) => ({ count: state.count + amount })),

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