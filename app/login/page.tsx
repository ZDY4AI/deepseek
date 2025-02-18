'use client'
import './page.scss'
import Cookies from 'js-cookie';

import type { FormProps } from 'antd';
import { Button, Form, Input, message, Flex } from 'antd';
import { Login } from '@/app/api/agent/index'
import { useRouter } from 'next/navigation';
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import keyStore from '@/app/store/key';
import Active from '@/app/store/active'


export default function page() {
    type FieldType = {
        username?: string;
        password?: string;
        remember?: string;
    };

    const router = useRouter();
    const { setUser } = keyStore()
    const { platform_img, company_img, company_background, text } = Active()

    const loginlist = [
        {
            name: "林佳",
            phone: "13707913080"
        },
        {
            name: "万仁文",
            phone: "13807002580"
        },
        {
            name: "戴鑫",
            phone: "13507090209"
        },
        {
            name: "邓海涛",
            phone: "13361710693"
        },
        {
            name: "裘木金",
            phone: "15270818768"
        }
    ];
    const onFinish: FormProps<FieldType>['onFinish'] = async (values: any) => {
        console.log(values);

        const data = {
            email: "guomou0016@163.com",
            language: "zh-Hans",
            password: "gj030928.",
            remember_me: true
        }

        const index = loginlist.findIndex((item: any) => item.phone === values.username)
        if (index != -1) {
            if (loginlist[index].name == values.password) {
                setUser(values.username)
                Cookies.set('access_token', values.password, { path: '/' })
                localStorage.setItem('access_token', values.password)
                localStorage.setItem('refresh_token', values.password)
                message.success('登录成功');
                router.push('/view/home');

            } else {
                message.error('密码错误');
            }
        } else {
            message.error('账号不存在');
        }



    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    };

    return (
        <div className="login">
            <div className='logindiv'>
                <div className='login_logo'>
                    <div>
                        <img src={company_img} alt="" />
                        {/* 桑智 */}
                    </div>
                    <span>+</span>
                    <div style={{ width: '150px' }}>
                        <img src={platform_img} alt="" />
                    </div>
                </div>
                <div className='logo_text'>
                    {text}
                </div>
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
