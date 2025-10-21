import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // لو بتخزن التوكن في الكوكيز
  const { pathname } = req.nextUrl;

  // الصفحات العامة اللي مش محتاجة تسجيل دخول
  const publicPaths = ["/auth", "/login", "/register", "/forgot-password"];

  // لو المستخدم داخل على صفحة عامة وهو مسجل دخول بالفعل → نحوله للصفحة الرئيسية
  if (token && publicPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // لو المستخدم مش مسجل دخول وداخل على صفحة محمية → نرجعه إلى /auth
  if (!token && !publicPaths.includes(pathname)) {
    const loginUrl = new URL("/auth", req.url);
    loginUrl.searchParams.set("from", pathname); // لحفظ الصفحة الأصلية
    return NextResponse.redirect(loginUrl);
  }

  // في الحالات العادية نسمح بالمتابعة
  return NextResponse.next();
}

// تحديد الصفحات اللي الميدل وير هتشتغل عليها
export const config = {
  matcher: [
    /*
      🔐 كل المسارات عدا صفحات التسجيل والدخول
      - هتحمي كل الصفحات داخل /dashboard أو /admin أو /settings
    */
    "/((?!_next|static|favicon.ico|auth|login|register|api).*)",
  ],
};
