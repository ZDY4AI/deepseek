'use client'
import React, { useState, useMemo, useEffect } from "react";
import { Input, ConfigProvider, Tooltip, Button, message, Upload } from 'antd';
import { LinkOutlined, SendOutlined, OpenAIOutlined, ChromeOutlined } from '@ant-design/icons'
import type { UploadProps, UploadFile } from 'antd';
import KeyStore from '@/app/store/key' 
import './index.scss'
const { TextArea } = Input;


interface ChatInputProps {
    setData: (data: { value: string; fileList: any, flag?: boolean }) => void;
    disabled: boolean
}

const ChatInput = React.memo(function ({ setData, disabled }: ChatInputProps) {


    const [agentContent, setagentContent] = useState<HTMLElement>()
    const [value, setValue] = useState<string>('');
    const [fileList, setFileList] = useState<UploadFile[]>([])
    const user = KeyStore((state) => state.user)
    const key = KeyStore((state) => state.key)

    const [think, setthink] = useState<boolean>(true)
    const [networking, setnetworking] = useState<boolean>(false)


    useEffect(() => {
        const agentContent = document.querySelector('.agentContent') as HTMLElement
        setagentContent(agentContent)
        try {

        } catch (error) {
            console.log(error)
        }


    }, [agentContent])

    const [flag, setflag] = useState(false)

    const isflag = useMemo(() => {
        return value.trim() == ''
    }, [value])

    const obtain = async () => {
        let flag = false
        setData({ value, fileList, flag })
        setValue(value)
        setValue('')
        setFileList([])
        if (agentContent) { agentContent.style.maxHeight = '700px'; }
    }


    // curl - X POST 'http://183.201.231.29:2580/v1/files/upload' \
    //     --header 'Authorization: Bearer {api_key}' \
    //     --form 'file=@localfile;type=image/[png|jpeg|jpg|webp|gif] \
    // --form 'user = abc - 123'
    const props: UploadProps = {
        name: 'file',
        action: '/api/files/upload',
        headers: {
            authorization: `Bearer ${key}`,
        },
        method: 'POST',
        listType: "picture",
        fileList: fileList,
        onChange({ file, fileList }) {

            if (file.type?.startsWith('image/')) {
                setflag(!flag)
                setFileList(fileList);
                if (file.status === 'done') {
                    message.success(`${file.name} 上传成功`);
                    if (agentContent) {
                        if (fileList.length == 0) {
                            agentContent.style.maxHeight = '600px';
                        } else {
                            agentContent.style.maxHeight = '500px';
                        }
                    }
                } else if (file.status === 'error') {
                    message.error(`${file.name} 上传失败.`);
                }
            }
        },
        data: () => ({
            user: user, // 这里设置您希望添加的额外字段
        }),
        beforeUpload(file, fileList) {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error('只能上传图片!');
                setFileList([])
                return false; // 阻止上传
            }
            return true;
        },
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            obtain()
        }
    };
    return (
        <div className="chatinput">
            <div className='chatinputbox'>
                <ConfigProvider
                    theme={{ components: { Input: { activeBorderColor: '#cecece', activeBg: '#fff', hoverBorderColor: '#cecece' } } }} >
                    <TextArea value={value}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value)}
                        placeholder='给 DeepSeek 发送消息'
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        onKeyDown={handleKeyPress}
                    />
                </ConfigProvider>
                <div className="chatbutton">
                    <div className="chatbuttonleft">

                        <Button icon={<OpenAIOutlined />} className={think ? 'active' : ''}
                            onClick={() => { setthink(!think) }}>深度思考</Button>
                        <Button icon={<ChromeOutlined />} className={networking ? 'active' : ''}
                            onClick={() => { setnetworking(!networking) }}>联网搜索</Button>

                    </div>
                    <div className="chatbuttonright">
                        <Tooltip placement="top" title='支持上传文件(最多50个，每个100 MB)接受 pdfdoc、xsx、ppt、txt、图片等' >
                            <Upload {...props}><LinkOutlined /></Upload>
                        </Tooltip>

                        <Tooltip placement="top" title='向AI进行提问' >
                            <Button type="primary" icon={<SendOutlined />} onClick={() => {
                                obtain()
                            }} disabled={isflag} />
                        </Tooltip>

                    </div>
                </div>
                {
                    fileList.length != 0 &&
                    <div className="chatupload">
                    </div>
                }
            </div>

            <p>内容由 AI 大模型生成，请仔细甄别</p>

        </div>
    )
})

export default ChatInput