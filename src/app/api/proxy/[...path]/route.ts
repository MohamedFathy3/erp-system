import { NextRequest, NextResponse } from 'next/server';

const baseUrl = process.env.TARGET_API || 'https://api.pyramidsfreight.com/api';

async function proxyRequest(
  method: string,
  endpoint: string,
  body?: Record<string, string | number>,
  cookies?: string
) {
  const url = `${baseUrl}/${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Extract token from cookies and set it as Authorization header
  if (cookies) {
    const decodedCookies = decodeURIComponent(cookies);
    const tokenMatch = decodedCookies.match(/token=([^;]+)/);
    
    if (tokenMatch) {
      const token = tokenMatch[1];
      // Set Authorization header instead of Cookie header
      headers['Authorization'] = `Bearer ${token}`;
      
      console.log('Token found, setting Authorization header:', headers['Authorization']);
    }
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
  };

  if (body && ['POST', 'PUT', 'PATCH','DELETE'].includes(method)) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);
  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const data = isJson ? await response.json() : await response.text();

  return { response, data };
}



// PATCH
export async function PATCH(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();
  const cookies = request.headers.get('cookie') || '';

  const { response, data } = await proxyRequest('PATCH', endpoint, body, cookies);
  return NextResponse.json(data, { status: response.status });
}

// GET
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const cookies = request.headers.get('cookie') || '';

  const { response, data } = await proxyRequest('GET', endpoint, undefined, cookies);
  return NextResponse.json(data, { status: response.status });
}

// POST
export async function POST(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();
  const cookies = request.headers.get('cookie') || '';

  const { response, data } = await proxyRequest('POST', endpoint, body, cookies);

  const res = NextResponse.json(data, { status: response.status });

  if (endpoint === 'login' && response.ok && typeof data === 'object' && 'token' in data) {
    console.log('Login Successful. Setting Token in Cookies:', data.token); 
    res.cookies.set('token', data.token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, 
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }

  return res;
}

// PUT
export async function PUT(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const body = await request.json();
  const cookies = request.headers.get('cookie') || '';

  const { response, data } = await proxyRequest('PUT', endpoint, body, cookies);
  return NextResponse.json(data, { status: response.status });
}

// DELETE
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const path = url.pathname.split('/api/proxy/')[1].split('/');
  
  const endpoint = path.join('/');
  const cookies = request.headers.get('cookie') || '';

  let body = undefined;
  try {
    body = await request.json();
  } catch (err) {
    console.log('No body in DELETE request (may be fine)');
  }

  const { response, data } = await proxyRequest('DELETE', endpoint, body, cookies);

  console.log('🗑️ DELETE Request to:', endpoint, 'Body:', body);
  console.log('🧾 DELETE Response:', data);

  return NextResponse.json(data, { status: response.status });
}
