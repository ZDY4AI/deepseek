'use client'
import React from 'react'
import ChatInput from '@/app/components/ChatInput/page'
import './index.scss'
import Image from 'next/image'
import '@/app/globals.css'
import { useRouter } from 'next/navigation';
import agentStore from '@/app/store/agent'
import KeyStore from '@/app/store/key';
import Active from '@/app/store/active'

export default function page() {
    const router = useRouter();
    const setUserInput = agentStore((state) => state.setUserInput);
    const setAskdirectly = agentStore((state) => state.setAskdirectly)
    const setFileObj = agentStore((state) => state.setFileObj)
    const setconversation_id = KeyStore((state) => state.setconversation_id)

    const { platform_img, company_img, company_background, text } = Active()
    return (
        <div className='home'>
            <div className='content'>
                <div className='login_logo'>
                    {/* <div>
                        桑智
                    </div> */}
                    {/* <div>
                        <img src={company_img} alt="" />
                    </div> */}
                    {/* <div> */}
                    <div style={{ fontSize: '25px' }}>我是</div>
                    <div className='private'>
                        <div className='privateimg'>
                            <img src={company_img} alt="" style={{borderRadius:'15px'}}/>
                        </div>
                        <div className='private_name'>桑智</div>
                    </div>
                    <span>+</span>
                    <div style={{ width: '150px' }}>
                        <img src={platform_img} alt="" />
                    </div>
                    <div style={{ fontSize: '25px' }}>很高兴见到你</div>
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
                                type: 'document',
                                transfer_method: 'local_file',
                                upload_file_id: item.id
                            }
                            return obj
                        }
                        )
                        const file_img_list = data.fileList
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
