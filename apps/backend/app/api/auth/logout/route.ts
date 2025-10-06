import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();

    if (!refreshToken) return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });

    const result = await db.refreshToken.updateMany({
      where: { token: refreshToken, revoked: false },
      data: { revoked: true },
    });

    if (result.count === 0) {
      return NextResponse.json({ message: 'Already logged out or invalid token' });
    }

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
