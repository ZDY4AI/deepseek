'use client'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useRef, HTMLAttributes } from 'react';
import ReactMarkdown from 'react-markdown';
import RehypeKatex from 'rehype-katex';
import RemarkBreaks from 'remark-breaks';
import RemarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import { copyToClipboard } from '@/app/hook/copyToClipboard';
import { Button, message, Image } from 'antd';
import React from 'react';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';

import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import '@/app/assets/style/github-markdown-dark-gpt.css'
import '@/app/assets/style/github-markdown-light.css'
import { CopyOutlined } from '@ant-design/icons';

function cleanCode(code: string | null) {
    const regex = /^(?:\w+\d+)?\d*\s*/gm;
    if (code) {
        return code?.replace(regex, '');
    }

    return code
}

export const PreCode: React.FC<HTMLAttributes<HTMLPreElement>> = props => {
    const ref = useRef<HTMLPreElement>(null);

    return (
        <pre ref={ref} className='mdCopy'>
            <Button
                title="复制"
                onClick={() => {
                    if (ref.current) {
                        const code = ref.current.textContent;
                        copyToClipboard(cleanCode(code) || '');
                        message.success('已复制到剪贴板');
                    }
                }}
            >
                <CopyOutlined />
            </Button>
            {props.children}
        </pre>
    );
};

export default React.memo(function Markdown(props: { content: string }) {

    const preprocessContent = (content: any) => {
        if (content) {
            return content.replace(/!\(([^)]+)\)/g, '![]($1)');
        }
        return content
    };
    return (
        <div className='gptmarkdown with-scrollbar'>
            <ReactMarkdown
                className="markdown-body"
                // children={props.content}
                children={preprocessContent(props.content)}
                remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
                rehypePlugins={[rehypeRaw, RehypeKatex]}
                // components={{ pre: PreCode }}
                components={{
                    code({ inline, className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <>
                                <span className="language">{match[1]}</span>
                                <SyntaxHighlighter
                                    children={String(children).replace(/\n$/, '')}
                                    style={prism}
                                    language={match[1]}
                                    PreTag="div"
                                    showLineNumbers={true}
                                    wrapLongLines={true}
                                    {...props}
                                />
                            </>
                        ) : (
                            <code className={className} {...props} children={children} />
                        );
                    },
                    img: ({ src, alt, title }) => {
                        if (!src.startsWith('http')) {
                            return null; // 或者处理非HTTP链接
                        }
                        // <img src={src} alt={alt} title={title} style={{
                        //     width: '200px',
                        //     height: '200px'
                        // }} />
                        return <Image width={180} src={src} />;
                    },
                    inlineCode({ value }: { value: unknown }) {
                        return (
                            <SyntaxHighlighter
                                style={prism}
                                language="plaintext"
                                children={value as any}
                                customStyle={{ display: 'inline', padding: '0.2em' }}
                            />
                        );
                    },
                }}
            ></ReactMarkdown>
        </div>
    );
})