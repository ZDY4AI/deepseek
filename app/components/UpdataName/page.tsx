'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Input, message, Button } from 'antd';
import { updateConversations } from '@/app/api/agent-key/index'
import Active from '@/app/store/active'
import KeyStore from '@/app/store/key';

interface UpdataNameProps {
    visible: boolean;
    setData: (value: boolean) => void;
    info: any;
}

export default function UpdataName({ visible, setData, info }: UpdataNameProps) {
    const [value, setValue] = useState<string>('')
    const { increment } = Active()
    const key = KeyStore((state) => state.key)
    const user = KeyStore((state) => state.user)
    useEffect(() => {
        setValue(info.name)
    }, [info])

    const onOk = () => {

        const data = {
            name: value,
            auto_generate: false,
            user: user
        }
        if (info.id == '') {
            const id = localStorage.getItem('conversation_id')
            info.id = id
        }
        updateConversations(info.id, data, key).then((res: any) => {
            message.success('修改成功')
            localStorage.setItem('Talk', JSON.stringify(res))
            setData(false)
            increment(1)
        }).catch(err => {
            message.error('修改失败')
        })
    }
    return (
        <>
            <Modal
                title="会话"
                open={visible}
                onCancel={() => setData(false)}
                footer={
                    [
                        <>
                            <Button onClick={onOk} type="primary" >确定</Button>
                            <Button onClick={() => setData(false)}>取消</Button>
                        </>
                    ]
                }
            >
                <Input type="text" value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    let val = e.target.value
                    setValue(val)
                }} />
            </Modal>
        </>
    );
}