'use client'
import './page.scss'
import Cookies from 'js-cookie';

import type { FormProps } from 'antd';
import { Button, Form, Input, message, Flex } from 'antd';
import { Login, Register } from '@/app/api/Deepseek/index'
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useState } from 'react';


export default function page() {
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
        newpassword?: string;
    };

    const router = useRouter();
    const [register, setregister] = useState(false)

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        if (register) {
            onRegister(values)
            return
        }
        Login(values).then((res: any) => {
            if (res.code == 200) {
                message.success(res.msg)
                Cookies.set('access_token', res.access_token, { path: '/' })
                localStorage.setItem('access_token', res.access_token)
                localStorage.setItem('refresh_token', res.refresh_token)
                router.push('/view/home');
            } else {
                message.error(res.msg)
            }
        })
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

                    {
                        register && <Form.Item<FieldType>
                            label="再次输入密码"
                            name="newpassword"
                            rules={[{ required: true, message: '请输入密码!' }]}
                        >
                            <Input.Password prefix={<LockOutlined />} />
                        </Form.Item>
                    }

                    <div className='nopassword'>
                        <span onClick={() => { setregister(!register) }}>新用户注册</span>
                        <span>忘记密码？</span>
                    </div>
                    <Form.Item label={null}>
                        {!register && <Button block type="primary" htmlType="submit">登录</Button>}
                        {register && <Button block type="primary" htmlType="submit">注册</Button>}
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
