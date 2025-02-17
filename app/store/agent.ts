// store.ts
import { create } from 'zustand';


interface AgentStore {
    firstAgentid: string
    Userinput: string;
    Askdirectly: boolean;
    Userimg: string;
    Dialogue: boolean;
    FileObj: {
        file_img_list: any[];
        file_list: any[]
    }, 
    setUserInput: (input: string) => void;
    setAskdirectly: (askdirectly: boolean) => void;
    setfirstAgentid: (firstAgentid: string) => void;
    setUserimg: (userimg: string) => void;
    setDialogue: (dialogue: boolean) => void;
    setFileObj: (FileObj: Object) => void;

}

const agentStore = create<AgentStore>(set => ({
    firstAgentid: '',
    Userinput: '',
    Askdirectly: false,
    Userimg: 'https://img2.baidu.com/it/u=3555476592,523348809&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500&quot;,&quot;cs&quot;:&quot;1920175946,1711960319&quot;,&quot;strategy&quot;:&quot;2221941889_546523_0_0&quot',
    Dialogue: false,
    FileObj: {
        file_img_list: [],
        file_list: []
    }, 
    setUserInput: (input) => set(() => ({ Userinput: input })),
    setAskdirectly: (askdirectly) => set(() => ({ Askdirectly: askdirectly })),
    setfirstAgentid: (firstAgentid) => set(() => ({ firstAgentid: firstAgentid })),
    setUserimg: (userimg) => set(() => ({ Userimg: userimg })),
    setDialogue: (dialogue) => set(() => ({ Dialogue: dialogue })),
    setFileObj: (fileobj: any) => set(() => ({ FileObj: fileobj }))
}));

export default agentStore;