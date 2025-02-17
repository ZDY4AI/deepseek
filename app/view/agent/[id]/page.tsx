'use client'
import './index.scss'
import { useEffect, useState, useRef } from "react"
import ChatInput from '@/app/components/ChatInput/page'
import UpdataName from '@/app/components/UpdataName/page'
import dynamic from 'next/dynamic';
import agentStore from '@/app/store/agent'
import KeyStore from '@/app/store/key'
import { GetMessages, Stopmessage, getConversation } from '@/app/api/agent-key/index'
import { Button, Spin, message } from 'antd';
import { PoweroffOutlined } from '@ant-design/icons'
import Active from '@/app/store/active'

const Chatcontent = dynamic(
    () => import('@/app/components/Chatcontent/page'),
    { ssr: false }
);


export default function Agent({ params }: { params: { id: string } }) {

    const { increment } = Active()
    const [Talk, setTalk] = useState<any>({})
    const [messageList, setMessageList] = useState<any[]>([])
    const [flag, setFlag] = useState(true)
    const [visible, setVisible] = useState(false)
    const userinput = agentStore((state) => state.Userinput);
    const Askdirectly = agentStore((state) => state.Askdirectly);

    const setAskdirectly = agentStore((state) => state.setAskdirectly);
    let askDirectlyHandled = true
    const bottomRef = useRef<HTMLDivElement>(null);
    let newlist: any[] = []

    const key = KeyStore((state) => state.key)
    const user = KeyStore((state) => state.user)
    const conversation_id = KeyStore((state) => state.conversation_id)
    const setconversation_id = KeyStore((state) => state.setconversation_id)

    const FileObj = agentStore((state: any) => state.FileObj);

    const [task_id, settask_id] = useState<string>('')
    const [taskFlag, settaskFlag] = useState<boolean>(false)

    useEffect(() => {
        setTalk(JSON.parse(localStorage.getItem('Talk') || '{}'))

    }, [visible])

    useEffect(() => {
        try {
            if (params.id != '1') {
                GetMessages(user, params.id, key).then((res: any) => {
                    setconversation_id(params.id)
                    setMessageList(res.data)
                    scrollBottom()
                }).catch((err) => { })
            }


            setFlag(false)
            // 用户直接从首页提问
            if (Askdirectly && askDirectlyHandled) {
                newlist = [...messageList]
                newlist.push(chatobj(userinput, FileObj.file_img_list))
                setMessageList(newlist)
                settaskFlag(true)
                Getresponse(userinput, FileObj.file_list)
                setAskdirectly(false)
                askDirectlyHandled = false
            }
        } catch { }
    }, [user])

    const chatobj = (val: string, file_img_list = []) => {
        return {
            agent_thoughts: [],
            answer: "",
            conversation_id: conversation_id,
            created_at: 1734402270,
            error: null,
            feedback: null,
            id: new Date().getTime(),
            inputs: {},
            message_files: [],
            parent_message_id: null,
            query: val,
            retriever_resources: [],
            status: "start",
            file_img_list: file_img_list,
        }
    }


    async function scrollBottom() {
        await new Promise(resolve => setTimeout(resolve, 100)); // 延迟100ms
        bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }

    async function Getresponse(value: string, fileList = []) {
        if (params.id == '1') {
            increment(1)
        }
        scrollBottom()
        const resp = await fetch(`${process.env.NEXT_PUBLIC_API_URL_ALIAS}/chat-messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + key
            },
            body: JSON.stringify({
                inputs: {},
                query: value,
                response_mode: "streaming",
                conversation_id: conversation_id,
                user: user,
                files: fileList,
            })
        });

        let completeAnswer = ''; // 用于累积所有的answer字段值
        let currentData = ''; // 用于累积数据 片段 
        let message_replace = '' // code
        let audioData = '' // 积累音频片段

        if (resp.body) {
            const reader = resp.body.pipeThrough(new TextDecoderStream()).getReader();
            while (true) {
                const { done, value: readValue } = await reader.read();
                if (done) break;
                currentData += readValue;
                // 尝试从累积的数据中提取完整的JSON对象
                while (currentData.includes('data: ')) {
                    const startIndex = currentData.indexOf('data: ') + 6; // 跳过 'data: '
                    const endIndex = currentData.indexOf('\n\n', startIndex);
                    let jsonStr;
                    if (endIndex === -1) {
                        // 如果没有找到结束标记，继续累积数据
                        jsonStr = currentData.substring(startIndex);
                        currentData = ''; // 重置currentData以等待更多数据
                    } else {
                        jsonStr = currentData.substring(startIndex, endIndex + 2); // 包括 '\n\n'
                        currentData = currentData.substring(endIndex + 2); // 移除已处理的部分
                    }
                    try {
                        const data = JSON.parse(jsonStr);
                        if (data.event === 'message' && data.answer) {
                            // 直接追加answer，不替换换行符
                            completeAnswer += data.answer;
                        }
                        if (conversation_id == '') {
                            const talk = { ...Talk }

                            setconversation_id(data.conversation_id)
                            talk.id = data.conversation_id
                            setTalk(talk)
                        }
                        if (task_id == '') {
                            settask_id(data.task_id)
                        }

                        if (data.event === 'tts_message') {
                            audioData += data.audio
                        }

                        if (data.event === 'node_finished') {
                            const code = data.data['outputs']['code'];
                            newlist[newlist.length - 1]['code'] = JSON.parse(code)
                        }
                        if (data.event == 'message_replace') {
                            message_replace = data.answer
                            console.log(data.answer, '----message_replace-----');
                        }
                        if (data.event == 'node_finished') {
                            settaskFlag(false)
                        }
                        if (data.event == 'message_end') {
                            settaskFlag(false)
                        }

                    } catch (err) {
                        if (endIndex === -1) {
                            currentData = jsonStr;
                        }
                    }
                    scrollBottom()
                }
                newlist[newlist.length - 1].answer = completeAnswer
                setMessageList([...newlist])

            }
            if (message_replace != '') {
                newlist[newlist.length - 1].answer = message_replace
                setMessageList([...newlist])
                settaskFlag(false)
            }


        }

    }

    const stopMessage = () => {
        Stopmessage(task_id, { user }, key).then((res: any) => {
            if (res.result == 'success') {
                settaskFlag(false)
                message.success('终止成功')
            } else {
                message.error('终止失败')
            }
        })
    }

    return (
        <div className="agentinfo">
            {flag ? <div className='spin'>
                <Spin size="large" />
            </div> : null}

            <div className="agentTop" onClick={() => {
                if (conversation_id == '' || Object.keys(Talk).length == 0) return
                setVisible(true)
            }}>
                {Talk.name || ''}
            </div>

            <div className='agentContent'>
                <Chatcontent chatlist={messageList} setData={(value) => {
                    newlist = [...messageList]
                    newlist.push(chatobj(value))
                    setMessageList(newlist)
                    Getresponse(value)
                }} />
                <div ref={bottomRef} style={{ width: '100px', height: '50px' }}></div>
            </div>

            {
                taskFlag && <div className='close'>
                    <Button icon={<PoweroffOutlined />} onClick={() => { stopMessage() }}>终止响应</Button>
                </div>
            }

            <div className='agentInput'>
                <ChatInput disabled={taskFlag} setData={(data) => {
                    let file_list = []
                    console.log(data, 'data');

                    if (data.fileList.length != 0) {
                        file_list = data.fileList.map((item: any) => {
                            const obj = {
                                type: item.type,
                                transfer_method: 'local_file',
                                upload_file_id: item.response.id
                            }
                            return obj
                        })
                    }

                    newlist = [...messageList]
                    newlist.push(chatobj(data.value, data.fileList))
                    setMessageList(newlist)
                    settaskFlag(true)
                    Getresponse(data.value, file_list)


                }}></ChatInput>
            </div>
            <UpdataName visible={visible} setData={(value) => {
                setVisible(value)
            }} info={Talk} />
        </div >
    )
}

