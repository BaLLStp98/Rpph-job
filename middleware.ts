import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // ตั้งค่า Cache-Control ป้องกันการแคชข้อมูลผู้ใช้ข้าม session
    const res = NextResponse.next({ request: req })
    res.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    res.headers.set('Pragma', 'no-cache')
    res.headers.set('Expires', '0')

    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // ตรวจสอบ API routes ที่ต้อง authentication
    if (pathname.startsWith('/api/prisma/') && !token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'กรุณาเข้าสู่ระบบก่อน' },
        { status: 401 }
      )
    }

    // ตรวจสอบ API routes ที่ต้อง authentication (เฉพาะบาง routes)
    const protectedApiRoutes = [
      '/api/profile',
      '/api/application-form',
      '/api/application-data',
      '/api/upload-image',
      '/api/profile-image'
    ]

    if (protectedApiRoutes.some(route => pathname.startsWith(route)) && !token) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'กรุณาเข้าสู่ระบบก่อน' },
        { status: 401 }
      )
    }

    // ตรวจสอบ admin routes
    if (pathname.startsWith('/admin') && !token) {
      return NextResponse.redirect(new URL('/auth/signin', req.url))
    }

    // ตรวจสอบ admin routes - ต้องมี admin role
    if (pathname.startsWith('/admin') && token) {
      // ตรวจสอบว่าเป็น admin หรือไม่ (สามารถปรับแต่งตามโครงสร้างข้อมูล)
      const isAdmin = token.role === 'admin' || token.isAdmin === true
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return res
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // หน้าที่ยังไม่ต้อง authentication
        const publicRoutes = [
          '/',
          '/auth/signin',
          '/auth/error',
          '/register',
          '/check-profile',
          '/contact',
          '/test-auth',
          '/test-pdf',
          '/simple-test'
        ]

        // หน้าสาธารณะไม่ต้อง authentication
        if (publicRoutes.includes(pathname)) {
          return true
        }

        // API routes ที่ไม่ต้อง authentication
        const publicApiRoutes = [
          '/api/auth',
          '/api/departments',
          '/api/hospital-departments',
          '/api/prisma/departments',
          '/api/register',
          '/api/upload-document',
          '/api/generate-pdf',
          '/api/contact'
        ]

        if (publicApiRoutes.some(route => pathname.startsWith(route))) {
          return true
        }

        // หน้าอื่นๆ ต้องมี token
        return !!token
      }
    }
  }
)

export const config = {
  matcher: [
    // ป้องกันหน้าต่างๆ
    '/application-data/:path*',
    '/application-form/:path*',
    '/profile/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    
    // ป้องกัน API routes
    '/api/prisma/:path*',
    '/api/profile/:path*',
    '/api/application-form/:path*',
    '/api/application-data/:path*',
    '/api/upload-image/:path*',
    '/api/profile-image/:path*',
    
    // ป้องกัน static files ที่สำคัญ
    '/uploads/:path*',
    '/documents/:path*'
  ]
}
