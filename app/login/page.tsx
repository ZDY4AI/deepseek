'use client'
import './page.scss'
import Cookies from 'js-cookie';

import type { FormProps } from 'antd';
import { Button, Form, Input, message, Flex } from 'antd';
import { Login, Register } from '@/app/api/Deepseek/index'
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react';
import keyStore from '@/app/store/key';


export default function page() {
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
        newpassword?: string;
    };

    const router = useRouter();
    const [register, setregister] = useState(false)
    const { loginlist, setUser } = keyStore()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        console.log(loginlist, '122');

        const index = loginlist.findIndex((item: any) => item.username == values.username)
        if (index != -1) {
            if (loginlist[index].password == values.password) {
                message.success('登录成功')
                setUser(loginlist[index].username)
                Cookies.set('access_token', loginlist[0].username, { path: '/' })
                router.push('/view/home')
            } else {
                message.error('密码错误')
            }
        } else {
            message.error('用户不存在')
        }
        // if (register) {
        //     onRegister(values)
        //     return
        // }
        // Login(values).then((res: any) => {
        //     if (res.code == 200) {
        //         message.success(res.msg)
        //         Cookies.set('access_token', res.access_token, { path: '/' })
        //         localStorage.setItem('access_token', res.access_token)
        //         localStorage.setItem('refresh_token', res.refresh_token)
        //         router.push('/view/home');
        //     } else {
        //         message.error(res.msg)
        //     }
        // })

    };

    const onRegister = (values: FieldType) => {
        if (values.password == values.newpassword) {
            Register(values).then((res: any) => {
                if (res.code == 200) {
                    message.success(res.msg)
                    setregister(false)
                } else {
                    message.error(res.msg)
                }
            })
        } else {
            message.error('两次密码不一致')
        }

        console.log(values, '注册')
    }

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    };

    return (
        <div className="login">
            <div className='logindiv'>
                <Form
                    name="basic"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input prefix={<UserOutlined />} />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password prefix={<LockOutlined />} />
                    </Form.Item>

                    {/* {
                        register && <Form.Item<FieldType>
                            label="再次输入密码"
                            name="newpassword"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                    } */}

                    <div className='nopassword'>
                        {/* <span onClick={() => { setregister(!register) }}>新用户注册</span> */}
                        <span>新用户注册</span>
                        <span>忘记密码？</span>
                    </div>
                    <Form.Item label={null}>
                        <Button block type="primary" htmlType="submit">登录</Button>
                        {/* {register && <Button block type="primary" htmlType="submit">注册</Button>} */}
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
