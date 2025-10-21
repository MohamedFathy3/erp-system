export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const finalOptions: RequestInit = {
    ...options,
    credentials: 'include', // لضمان إرسال الكوكيز مع الطلب
  };

  try {
    console.log("🛰️ Sending request to:", url);
    console.log("📦 Options:", finalOptions);

    const res = await fetch(url, finalOptions);
    const contentType = res.headers.get("content-type");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    if (contentType?.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    console.log("📊 Parsed response data:", data);

    // 🔴 لو فيه خطأ من السيرفر
    if (!res.ok) {
      const message =
        data?.message || data?.error || res.statusText || "Unknown API error";

      console.error("❌ API returned an error:", message);

      // ✅ لو الخطأ خاص بالـ login أو انتهاء الجلسة
      if (
        res.status === 401 ||
        message.toLowerCase().includes("unauthenticated") ||
        message.toLowerCase().includes("token expired") ||
        message.toLowerCase().includes("unauthorized")
      ) {
        console.warn("🚨 Session expired or unauthorized!");

        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          // ❗ منع التحويل لو المستخدم بالفعل في صفحة /auth أو /login
          if (!["/auth", "/login"].includes(currentPath)) {
            console.warn("➡️ Redirecting to /auth...");
            window.location.href = "/auth";
          } else {
            console.log("⚠️ Already on auth page, skipping redirect.");
          }
        }
      }

      throw new Error(message);
    }

    return data;
  } catch (error: unknown) {
    console.group("🚨 API Request failed");
    console.error("Error object:", error);

    if (error instanceof Error) {
      console.error("Message:", error.message);

      if (
        error.message.toLowerCase().includes("unauthenticated") ||
        error.message.toLowerCase().includes("unauthorized") ||
        error.message.toLowerCase().includes("token expired")
      ) {
        if (typeof window !== "undefined") {
          const currentPath = window.location.pathname;
          if (!["/auth", "/login"].includes(currentPath)) {
            console.warn("⚠️ Redirecting to /auth due to authentication error...");
            window.location.href = "/auth";
          } else {
            console.log("⚠️ Already on auth page, no redirect needed.");
          }
        }
      }
    }

    console.groupEnd();

    throw new Error(
      error instanceof Error
        ? `Request failed: ${error.message}`
        : "Request failed: Unknown error"
    );
  }
}
