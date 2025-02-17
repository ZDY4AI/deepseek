'use client'
import React from 'react';

// 使用 React.PropsWithChildren 类型
const MemoizedComponent = React.memo(function MyComponent(props: React.PropsWithChildren<{}>) {
    /* 使用 props 渲染 */
    return <div>{props.children}</div>;
});

export default MemoizedComponent;