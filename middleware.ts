// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // 获取 Cookie 中的 access_token
  const token = request.cookies.get('access_token');

  // 定义不需要鉴权的公开路径
  const publicPaths = ['/login'];

  // 如果路径是公开路径或用户已登录，则允许访问
  if (publicPaths.includes(path) || token) {
    return NextResponse.next();
  }

  // 如果用户未登录且访问的是受保护的页面，则重定向到登录页面
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    // 匹配所有路径，但排除 Next.js 内部路径和静态资源
    '/((?!_next|_vercel|favicon.ico|manifest.json|robots.txt).*)'
  ]
};