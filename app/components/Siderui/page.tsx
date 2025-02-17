'use client'
import React, { useState, useEffect } from 'react';
import './index.scss';
import { LeftSquareOutlined, PlusCircleOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Button, Image, Popover, message } from 'antd'
import { useRouter } from 'next/navigation';


import UpdataName from "@/app/components/UpdataName/page";
import KeyStore from '@/app/store/key';
import AgentStore from '@/app/store/agent';
import Active from '@/app/store/active'
import { getConversation, DeleteConversations } from '@/app/api/agent-key/index'
import Cookies from 'js-cookie';

interface SideruiProps {
    width: any,
    setDate: (width: string) => void;
}

export default function Siderui({ width, setDate }: SideruiProps) {

    const key = KeyStore((state) => state.key)
    const user = KeyStore((state) => state.user)
    const [messagelist, setmessagelist] = useState([])
    const [visible, setvisible] = useState(false)
    const [info, setInfo] = useState({})
    const agentActive = Active((state) => state.theme)

    const Askdirectly = AgentStore((state) => state.Askdirectly);

    useEffect(() => {
        getmessagelist()
        console.log(agentActive, 'agentActive----agentActive---')
    }, [Askdirectly])

    const getmessagelist = () => {
        getConversation(user, '', 20, key).then((res) => {
            console.log(res.data);
            setmessagelist(res.data)
        })
    }

    const userDom = () => {
        return <div style={{ cursor: 'pointer', fontSize: '13px' }}>
            <div onClick={() => {
                Cookies.remove('access_token', { path: '/' });
                router.push('/login')
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                }
                message.success('退出成功')
            }}>
                退出登录
            </div>
        </div>
    }

    const router = useRouter();
    return (
        <div className='sider' style={{ width }}>
            {
                width == '240px' ? <>
                    <div className='sider_top'>
                        <div className='title'>
                            <span>DeepSeek</span>
                            <LeftSquareOutlined onClick={() => {
                                const innerwidth = width == '240px' ? '80px' : '240px'
                                setDate(innerwidth)
                            }} />
                        </div>
                        <Button className='button' type="text" icon={<PlusCircleOutlined />} onClick={() => { router.push('/view/home') }}>
                            开启新对话
                        </Button>
                        <div className='messagelist'>
                            {
                                messagelist.map((item: any, index) => {
                                    return <div className='messageitem' onClick={() => {
                                        localStorage.setItem('Talk', JSON.stringify(item))
                                        router.push('/view/agent/' + item.id)
                                    }}>
                                        {item.name}
                                        <div className='drop'>
                                            <Popover placement="right" trigger="click" content={<>
                                                <div onClick={(e) => {
                                                    e?.stopPropagation()
                                                }} style={{ cursor: 'pointer', fontSize: '13px' }}>
                                                    <div onClick={(e) => {
                                                        e.stopPropagation();
                                                        setvisible(true)
                                                        item['key'] = key
                                                        item['user'] = user
                                                        console.log(item);
                                                        setInfo(item)
                                                    }}>重命名</div>
                                                    <div onClick={(e) => {
                                                        console.log(item);
                                                        DeleteConversations(item.id, { user }, key).then((res: any) => {
                                                            message.success('删除成功')
                                                            router.push('/view/home')
                                                            getmessagelist()
                                                        }).catch(err => {
                                                            message.error('删除失败')
                                                        })
                                                    }}>删除</div>
                                                </div>
                                            </>}>...</Popover>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className='sider_buttom'>
                        <Popover className='userinfo' placement="top" trigger="click" content={userDom}>
                            <div>
                                <Image
                                    preview={false}
                                    width={30}
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </div>
                            <span>个人信息</span>
                        </Popover>

                    </div>
                </> :
                    <>
                        <div className='minsider'>
                            <div className='minsider_top'>
                                <Image src='/logo.svg' alt='' width={50} height={50} preview={false} ></Image>
                                <RightSquareOutlined onClick={() => {
                                    const innerwidth = width == '240px' ? '80px' : '240px'
                                    setDate(innerwidth)
                                }} />
                                <PlusCircleOutlined onClick={() => { router.push('/view/home') }} />
                            </div>
                            <div className='minsider_buttom'>
                                <Popover className='userinfo' placement="top" trigger="click" content={userDom}>
                                    <Image
                                        preview={false}
                                        width={30}
                                        src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                    />
                                </Popover>
                            </div>
                        </div>
                    </>
            }
            <UpdataName info={info} visible={visible} setData={(value) => {
                setvisible(value)
                getmessagelist()
            }} />
        </div>
    );
}

// 