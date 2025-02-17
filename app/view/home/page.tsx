'use client'
import React from 'react'
import ChatInput from '@/app/components/ChatInput/page'
import './index.scss'
import Image from 'next/image'
import '@/app/globals.css'
import { useRouter } from 'next/navigation';
import agentStore from '@/app/store/agent'
import KeyStore from '@/app/store/key';

export default function page() {
    const router = useRouter();
    const setUserInput = agentStore((state) => state.setUserInput);
    const setAskdirectly = agentStore((state) => state.setAskdirectly)
    const setFileObj = agentStore((state) => state.setFileObj)
    const setconversation_id = KeyStore((state) => state.setconversation_id)
    return (
        <div className='home'>
            <div className='content'>
                <div className='top'>
                    <Image src='/logo.svg' alt='' width={50} height={50}></Image>我是DeepSeek，很高兴见到你！
                </div>
                <div className='text'>
                    我可以帮你写代码、读文件、写作各种创意内容，请把你的任务交给我吧~
                </div>
                <ChatInput disabled={false} setData={(data) => {
                    localStorage.setItem('Talk', JSON.stringify({
                        created_at: 0,
                        id: "",
                        inputs: {},
                        introduction: null,
                        name: "新对话",
                        status: "0",
                        updated_at: 0,
                    }))
                    setconversation_id('')

                    let file_list = []
                    if (data.fileList.length != 0) {
                        file_list = data.fileList.map((item: any) => {
                            const obj = {
                                type: 'image',
                                transfer_method: 'local_file',
                                upload_file_id: item.response.id
                            }
                            return obj
                        }
                        )
                        const file_img_list = data.fileList.map((item: any) => item.thumbUrl)
                        setFileObj({ file_list, file_img_list })
                    }
                    setAskdirectly(true)
                    setUserInput(data.value)
                    router.push(`/view/agent/1`)
                }} />
            </div>

        </div>
    )
}
