'use client'
import React, { useEffect, useState, useRef, act } from 'react';
import './index.scss';
import { Spin, FloatButton, message, Rate, Image } from 'antd';
import { ChatMessage } from '../type';
import { OpenAIOutlined, LikeOutlined, DislikeOutlined, CopyOutlined, UpOutlined, DownOutlined } from '@ant-design/icons';
import dynamic from 'next/dynamic'
import { copyToClipboard } from '@/app/hook/copyToClipboard';
import KeyStore from '@/app/store/key';
import { Likemessage } from '@/app/api/agent-key/index'

const Markdown = dynamic(
    () => import('@/app/components/MarkDown/page'),
    { ssr: false }
)

// 定义一个函数，用于清理代码
function cleanCode(code: string | null) {
    const regex = /^(?:\w+\d+)?\d*\s*/gm;
    return code?.replace(regex, '');
}

interface ChatcontentProps {
    chatlist: ChatMessage[];
    setData?: (value: any) => void
}

export default function Chatcontent({ chatlist = [], setData }: ChatcontentProps) {
    const [Agentinfo, setAgentinfo] = useState<any>({});

    const key = KeyStore((state) => state.key)
    const user = KeyStore((state) => state.user)
    const [chatList, setchatList] = useState<any>([])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setAgentinfo(JSON.parse(localStorage.getItem('Agentinfo') || '{}'));
        }
        setchatList(chatlist)
    }, [chatlist]);


    const readtext = (text: string) => {
        let jsonPart: any = []
        let textPart = ''
        let chat = ''

        if (text.substring(0, 7) == '```json') {
            return { textPart: text, jsonPart: [], chat: '' }
        }
        const newtext: any = text.split('</details>')

        if (text.indexOf('</details>') === -1) {
            // 如果没有 '</details>' 标签，直接返回原始文本
            return { jsonPart, chat: newtext[0], textPart: '' };
        }

        // 分割文本
        const parts = text.split('</details>');

        if (parts.length === 1) {
            // 如果只有一个部分，说明 '</details>' 标签之前没有文本
            if (newtext[0] === undefined) return;
            return { jsonPart, chat: newtext[0], textPart: '' };
        } else if (parts.length === 2) {
            // 如果有两个部分，第一部分是 chat，第二部分是 textPart
            return { jsonPart, chat: newtext[0], textPart: parts[1] };
        } else {
            // 如果有多个 '</details>' 标签，只取第一个和最后一个
            return { jsonPart, chat: newtext[0], textPart: parts.slice(1).join('</details>') };
        }
    };


    const drop = (index: any, behavior: string) => {
        // const list = [...chatList]
        // const data = {
        //     rating: behavior,
        //     user: user,
        //     content: list[index].answer
        // }
        // Likemessage(list[index].id, data, key).then((res: any) => {
        //     if (res.result == 'success') {
        //         list[index].feedback = { rating: behavior }
        //         setchatList(list)
        //         if (behavior == 'like') {
        //             message.success('谢谢您的鼓励')
        //         } else {
        //             message.warning('我会继续努力的')
        //         }
        //     }
        // }).catch((err: any) => {
        //     message.error('操作失败')
        // })
    }

    const [web, setweb] = useState(1)

    return (
        <div className='chatcontent'>
            {
                chatList.map((item: any, index: number) => {
                    const { textPart, chat } = readtext(item.answer);
                    return <div key={item.id} className='allagent' >
                        <div className='agentContentItem agentright'>
                            <div className='agentContentTxt' style={{ backgroundColor: '#eff6ff' }}>
                                {/* <Markdown content={item.query} /> */}
                                {item.query}
                            </div>
                        </div>

                        <div className='agent_img'>
                            <Image.PreviewGroup >
                                {
                                    item['file_img_list'] && item['file_img_list'].map((item: any, index: number) => {
                                        return <div onClick={() => {
                                            console.log(item.thumbUrl)
                                        }}>
                                            {
                                                item.thumbUrl ? <Image width={150} src={item.thumbUrl} /> : <div className='word'>
                                                    {item.name}
                                                </div>
                                            }

                                        </div>
                                    })
                                }
                            </Image.PreviewGroup>
                        </div>

                        <div className='agentContentItem agentleft'>
                            <img src='/logo.svg' alt="" />
                            <div className='agentContentTxt'>
                                {item.answer == '' ? <Spin /> : <>
                                    <div className='reasoningbutton' onClick={(e) => {
                                        e.stopPropagation()
                                        if (item['flag'] == undefined) {
                                            item['flag'] = true
                                        } else {
                                            item['flag'] = !item['flag']
                                        }
                                        setweb(web + 1)
                                    }}><OpenAIOutlined />已深度思考
                                        {!item['flag'] ? <DownOutlined /> : <UpOutlined />}
                                    </div>

                                    {/* {
                                        item['flag'] == undefined && !item['flag'] && 
                                    } */}
                                    {
                                        item['flag'] == undefined ? <div className='reasoning'>
                                            {chat}
                                        </div> : item['flag'] ? <div className='reasoning'>
                                            {chat}
                                        </div> : ''
                                    }


                                    <Markdown content={textPart} />
                                </>}
                                {
                                    item.answer != '' && item.status == 'normal' && <div className='message_icon'>

                                        <LikeOutlined className="icon like" onClick={() => drop(index, 'like')} style={{ color: item.feedback == null ? '' : (item.feedback['rating'] == 'like' ? 'green' : '') }} />
                                        <DislikeOutlined className="icon dislike" onClick={() => drop(index, 'dislike')} style={{ color: item.feedback == null ? '' : (item.feedback['rating'] == 'dislike' ? 'red' : '') }} />

                                        <CopyOutlined onClick={() => {
                                            message.success('复制成功')
                                            copyToClipboard(cleanCode(textPart) || '')
                                        }} />

                                    </div>
                                }

                            </div>
                        </div>
                    </div>
                })}
            <FloatButton.BackTop />
        </div >
    );
}