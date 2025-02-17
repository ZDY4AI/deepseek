'use client'
import React, { useEffect, useState, useRef, act } from 'react';
import './index.scss';
import { Spin, FloatButton, message, Rate, Image } from 'antd';
import { ChatMessage } from '../type';
import { PlayCircleOutlined, PauseCircleOutlined, LikeOutlined, DislikeOutlined, CopyOutlined } from '@ant-design/icons';
import agentStore from '@/app/store/agent';
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
        let textPart

        if (text.substring(0, 7) == '```json') {
            return { textPart: text, jsonPart: [] }
        }
        const startBracketIndex = text.indexOf('[');
        const endBracketIndex = text.lastIndexOf(']');

        if (startBracketIndex === -1 || endBracketIndex === -1) {
            return { textPart: text, jsonPart: [] };
        }

        jsonPart = text.substring(startBracketIndex, endBracketIndex + 1);
        textPart = text.substring(0, startBracketIndex).trim() + text.substring(endBracketIndex + 1).trim();

        try {
            const jsonArray = JSON.parse(jsonPart);
            jsonPart = jsonArray

        } catch (e) {
        }

        return { jsonPart, textPart }
    };


    const drop = (index: any, behavior: string) => {
        const list = [...chatList]
        const data = {
            rating: behavior,
            user: user,
            content: list[index].answer
        }
        Likemessage(list[index].id, data, key).then((res: any) => {
            if (res.result == 'success') {
                list[index].feedback = { rating: behavior }
                setchatList(list)
                if (behavior == 'like') {
                    message.success('谢谢您的鼓励')
                } else {
                    message.warning('我会继续努力的')
                }
            }
        }).catch((err: any) => {
            message.error('操作失败')
        })
    }

    return (
        <div className='chatcontent'>
            {
                chatList.map((item: any, index: number) => {
                    const { jsonPart, textPart } = readtext(item.answer);
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
                                        return <div>
                                            <Image width={150} src={item} />
                                        </div>
                                    })
                                }
                            </Image.PreviewGroup>
                        </div>

                        <div className='agentContentItem agentleft'>
                            <img src='/logo.svg' alt="" />
                            <div className='agentContentTxt'>
                                {item.answer == '' ? <Spin /> : <Markdown content={textPart} />}
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