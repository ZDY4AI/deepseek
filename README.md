This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

readerRef是一个React引用（ref），它用于存储流式请求的ReadableStreamDefaultReader对象。这样做的目的是为了能够在组件的其他部分（例如终止播放的函数中）访问和控制这个流式请求。具体来说，readerRef绑定给了从响应体（response.body）中获取的读取器（reader），以便后续可以调用reader.cancel()来终止流式请求。

## 中间件

middleware.ts

在路由之前运行：中间件在缓存内容和路由匹配之前运行，可以重写、重定向、修改请求或响应头，或直接响应

## 静态资源

在nextjs中使用静态资源 将静态资源放置到public文件夹中

next本身自带了图片标签 如果使用原生的html中img的标签的话可能会导致第一次静态资源无法渲染

```js
import Image from 'next/image'   
<Image src="/zdy.png" alt="" width='40' height='50' />
```

