export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '/api/proxy';
  const url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;

  const finalOptions: RequestInit = {
    ...options,
    credentials: 'include', // This ensures cookies are sent with the request
  };

  try {
    console.log("🛰️ Sending request to:", url);
    console.log("📦 Options:", finalOptions);

    const res = await fetch(url, finalOptions);

    console.log("📥 Raw response:", res);

    const contentType = res.headers.get("content-type");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    if (contentType?.includes("application/json")) {
      data = await res.json().catch(() => null);
    } else {
      data = await res.text().catch(() => null);
    }

    console.log("📊 Parsed response data:", data);

    if (!res.ok) {
      const message =
        data?.message || data?.error || res.statusText || "Unknown API error";
      console.error("❌ API returned an error:", message);
      throw new Error(message);
    }

    return data;
  } catch (error: unknown) {
    console.group("🚨 API Request failed");
    console.error("Error object:", error);
    if (error instanceof Error) {
      console.error("Message:", error.message);
    }
    console.groupEnd();

    throw new Error(
      error instanceof Error
        ? `Request failed: ${error.message}`
        : "Request failed: Unknown error"
    );
  }
}
