import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    // Validate username
    if (!username) {
      return NextResponse.json(
        { message: 'Username is required' },
        { status: 400 }
      );
    }

    // Fetch user
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch transactions
    const [moneySent, moneyReceived] = await Promise.all([
      prisma.transaction.findMany({
        where: { senderId: user.id },
      }),
      prisma.transaction.findMany({
        where: { receiverId: user.id },
      }),
    ]);

    // Combine and return transactions
    const transactions = [
      ...moneySent.map((txn) => ({ ...txn, type: 'sent' })),
      ...moneyReceived.map((txn) => ({ ...txn, type: 'received' })),
    ];

    return NextResponse.json({
      transactions,
      message: 'These are the transactions',
    });
  } catch (e) {
    console.error('An error occurred: ', e);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
