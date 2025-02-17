'use client'
import './page.scss'
import Cookies from 'js-cookie';

import type { FormProps } from 'antd';
import { Button, Form, Input, message, Flex } from 'antd';
import { Login } from '@/app/api/agent/index'
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import Image from 'next/image';
import keyStore from '../store/key';


export default function page() {
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };

    const router = useRouter();
    const { setUser } = keyStore()

    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        console.log(values);

        const data = {
            email: "guomou0016@163.com",
            language: "zh-Hans",
            password: "gj030928.",
            remember_me: true
        }
        // const data: any = {
        //     email: values.username,
        //     language: "zh-Hans",
        //     password: values.password,
        //     remember_me: true
        // }

        Login(data).then((res: any) => {
            if ('status' in res) {
                message.error('账号或密码错误');
            } else {
                setUser(values.username)
                Cookies.set('access_token', res.data.access_token, { path: '/' })
                localStorage.setItem('access_token', res.data.access_token)
                localStorage.setItem('refresh_token', res.data.refresh_token)
                message.success('登录成功');
                router.push('/view/home');
            }
        }).catch(err => {
            message.error('账号或密码错误')
        })

    };

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
                    <div className='nopassword'>
                        <span>新用户注册</span>
                        <span>忘记密码？</span>
                    </div>
                    <Form.Item label={null}>
                        <Button block type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}
