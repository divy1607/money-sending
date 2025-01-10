// /app/api/seed/route.ts

import { prisma } from '../../../lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json(
        { error: 'Missing username' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: username },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.balance.toNumber() === 0.0) {
      const updatedUser = await prisma.user.update({
        where: { username },
        data: { balance: 5000.0 },
      });
      return NextResponse.json(
        {
          user: updatedUser,
          message: 'Amount seeded successfully',
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: 'User already has a positive balance' },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
