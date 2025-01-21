import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request) {
  const token = request.cookies.get('authToken')?.value;
  const loginUrl = new URL('/login', request.url);

  if (!token) {
    console.log('No token found. Redirecting to login...');
    return NextResponse.redirect(loginUrl);
  }

  const isValid = await isValidToken(token);
  if (!isValid) {
    console.log('Invalid token. Redirecting to login...');
    return NextResponse.redirect(loginUrl);
  }

  console.log('Token valid. Proceeding to dashboard...');
  return NextResponse.next();
}

async function isValidToken(token) {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'your-secret-key');

    const { payload } = await jwtVerify(token, secret);

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log('Token expired');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Token validation error:', error.message);
    return false;
  }
}


// Configure the matcher to apply middleware to specific routes
export const config = {
  matcher: ['/game-dashboard/:path*'],
};
