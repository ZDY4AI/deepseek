// import { create } from 'zustand';

// interface KeyStore {
//     key: string;
//     user: string,
//     conversation_id: string,
//     setKey: (key: string) => void;
//     setconversation_id: (conversation_id: string) => void;
// }
// const isClient = typeof window !== 'undefined';

// const KeyStore = create<KeyStore>((set) => ({

//     user: 'asd-123',
//     key: 'app-ITODRUYMH6o5jcdTH16AEpZ7',
//     // key: isClient ? localStorage.getItem('key') || '' : '',
//     conversation_id: isClient ? localStorage.getItem('conversation_id') || '' : '',
//     // conversation_id: 'e68c0a1e-d4d5-4f17-959c-9fa4f1b60d28',
//     setKey: (key) => {
//         set({ key });
//         localStorage.setItem('key', key);
//     },
//     setconversation_id: (conversation_id) => {
//         set({ conversation_id })
//         localStorage.setItem('conversation_id', conversation_id);
//     }
// }));

// export default KeyStore;    

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface KeyStore {
    key: string;
    user: string;
    conversation_id: string;
    loginlist: Array<any>;
    setKey: (key: string) => void;
    setconversation_id: (conversation_id: string) => void;
    setUser: (user: string) => void
}

const keyStore = create<KeyStore>()(
    persist(
        (set) => ({
            user: '',
            key: 'app-rqctoq3CVVXS4NJq0NZp2Fke',
            conversation_id: '',
            loginlist: [
                { username: 'admin', password: '123' },
                { username: 'user', password: '123' }
            ],
            setKey: (key) => {
                set({ key });
                localStorage.setItem('key', key);
            },
            setconversation_id: (conversation_id) => {
                set({ conversation_id });
                localStorage.setItem('conversation_id', conversation_id);
            },
            setUser: (user) => {
                set({ user })
            }
        }),
        {
            name: 'key-store', // 持久化存储的名称
            partialize: (state) => ({
                user: state.user,
                key: state.key,
                conversation_id: state.conversation_id,
            }),
        }
    )
);

export default keyStore;