'use client'
import React, { useState, useEffect } from 'react';
import './index.scss';
import { LeftSquareOutlined, PlusCircleOutlined, RightSquareOutlined } from '@ant-design/icons';
import { Button, Image, Popover, message } from 'antd'
import { useRouter } from 'next/navigation';
import UpdataName from "@/app/components/UpdataName/page";
import KeyStore from '@/app/store/key';
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
    const { count, platform_img, company_img } = Active()
    const router = useRouter();
    const [pathid, setpathid] = useState('')
    const [active, setactive] = useState(-1)

    useEffect(() => {
        getmessagelist()

    }, [count, user])

    const getmessagelist = () => {
        if (user == '') return
        getConversation(user, '', 20, key).then((res) => {
            if (res.data.length != 0) {
                setmessagelist(res.data)
            } else {
                setmessagelist([])
            }
            if (typeof window !== 'undefined') {
                setpathid(window.location.pathname.split('/view/agent/')[1])
            }
        })
    }

    const userDom = () => {
        return <div style={{ cursor: 'pointer', fontSize: '13px' }}>
            <div onClick={() => {
                setactive(-1)
                setpathid('-1')
                Cookies.remove('access_token', { path: '/' });
                router.push('/login')
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    localStorage.removeItem('key-store')
                }
                message.success('退出成功')
            }}>
                退出登录
            </div>
        </div>
    }

    const setMove = () => {
        const innerwidth = width == '240px' ? '80px' : '240px'
        setDate(innerwidth)
    }


    return (
        <div className='sider' style={{ width }}>
            {
                width == '240px' ? <>
                    <div className='sider_top'>
                        <div className='title'>
                            <span className='sider_logo'>
                                <img src={company_img} alt="" width={50} height={50} style={{ borderRadius: '15px' }} />
                                桑智
                            </span>
                            <LeftSquareOutlined onClick={() => { setMove() }} />
                        </div>
                        <Button className='button' type="text" icon={<PlusCircleOutlined />} onClick={() => {
                            setactive(-1)
                            setpathid('-1')
                            router.push('/view/home')
                        }}>
                            开启新对话
                        </Button>
                        <div className='messagelist'>
                            {
                                messagelist.map((item: any, index) => {
                                    return <div
                                        className={`messageitem ${active === index ? 'active' : pathid == item.id ? 'active' : pathid == '1' && index == 0 ? 'active' : ''}`}
                                        key={item.id}
                                        onClick={() => {
                                            setactive(index)
                                            setpathid('-1')
                                            localStorage.setItem('Talk', JSON.stringify(item))
                                            router.push('/view/agent/' + item.id)
                                        }}>
                                        <span className='txt'>{item.name}</span>
                                        <div className='drop'>
                                            <Popover placement="right" trigger="click" content={<>
                                                <div onClick={(e) => {
                                                    e?.stopPropagation()
                                                }} style={{ cursor: 'pointer', fontSize: '13px' }}>
                                                    <div onClick={(e) => {
                                                        console.log(user, '1234679')
                                                        e.stopPropagation();
                                                        setvisible(true)
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
                        <Button onClick={() => {
                            setactive(-1)
                            setpathid('-1')
                            Cookies.remove('access_token', { path: '/' });
                            router.push('/login')
                            if (typeof window !== 'undefined') {
                                localStorage.removeItem('access_token');
                                localStorage.removeItem('refresh_token');
                                localStorage.removeItem('key-store')
                            }
                            message.success('退出成功')
                        }}>退出登录</Button>
                    </div>
                </> :
                    <>
                        <div className='minsider'>
                            <div className='minsider_top'>
                                <div style={{ width: '30px', height: '30px', borderRadius: '50%', overflow: 'hidden' }}
                                    onClick={() => setMove()}  >
                                    <img src={company_img} alt="" style={{borderRadius: '50%'}}/>
                                </div>


                                {/* <span style={{ fontSize: '15px' }}>桑智</span> */}
                                <RightSquareOutlined
                                    onClick={() => setMove()} />
                                <PlusCircleOutlined onClick={() => {
                                    setactive(-1)
                                    setpathid('-1')
                                    router.push('/view/home')
                                }} />
                            </div>
                            {/* <div className='minsider_buttom'>
                                <Popover className='userinfo' placement="top" content={userDom}>
                                    <img src={company_img} alt="" />
                                </Popover>
                            </div> */}

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