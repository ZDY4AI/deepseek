'use client'
import "./globals.css";
import MemoizedChildren from '@/app/components/MemoizedComponent'
import Siderui from "./components/Siderui/page";
import { Flex, Layout } from 'antd';
const { Sider, Content } = Layout;
import React, { useState, useEffect } from 'react'
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [width, setwidth] = useState('240px')

  const contentStyle: React.CSSProperties = {
    height: '100vh',
    backgroundColor: '#ffffff',
  };

  const siderStyle: React.CSSProperties = {
    backgroundColor: '#f9fbff',
  };


  const layoutStyle = {
    borderRadius: 8,
    overflow: 'hidden',
    width: '100%',
  };


  return (
    <html lang="en">
      <head>
        <title>DeepSeek</title>
        <link rel="icon" href="/logo.svg" />
      </head>
      <body>
        <div>
          <div className='main'>
            <Flex gap="middle" wrap>
              <Layout style={layoutStyle}>
                <Sider style={siderStyle} width={width}>
                  <Siderui width={width} setDate={(innerwidth) => {
                    setwidth(innerwidth)
                  }} />
                </Sider>
                <Layout>
                  <Content style={contentStyle}>
                    <MemoizedChildren> {children}</MemoizedChildren>
                  </Content>
                </Layout>
              </Layout>
            </Flex>
          </div>
        </div>
      </body>
    </html >
  );
}


