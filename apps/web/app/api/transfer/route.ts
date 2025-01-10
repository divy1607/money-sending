import { prisma } from '../../../lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { sender, receiver, amount } = await req.json();

    // Input validation
    if (!sender || !receiver || !amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { message: 'Invalid input data' },
        { status: 400 }
      );
    }

    // Fetch sender
    const sendingParty = await prisma.user.findUnique({
      where: { username: sender },
    });

    if (!sendingParty) {
      return NextResponse.json(
        { message: 'Sender not found' },
        { status: 404 }
      );
    }

    const senderBalance = sendingParty.balance.toNumber(); // Convert Decimal to number

    if (senderBalance < amount) {
      return NextResponse.json(
        { message: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Fetch receiver
    const receivingParty = await prisma.user.findUnique({
      where: { username: receiver },
    });

    if (!receivingParty) {
      return NextResponse.json(
        { message: 'Receiver not found' },
        { status: 404 }
      );
    }

    // Perform transfer with a transaction
    const [updatedSender, updatedReceiver, transaction] = await prisma.$transaction([
      // Deduct amount from sender's balance
      prisma.user.update({
        where: { id: sendingParty.id }, // Use sender's id
        data: { balance: { decrement: amount } },
      }),

      // Add amount to receiver's balance
      prisma.user.update({
        where: { id: receivingParty.id }, // Use receiver's id
        data: { balance: { increment: amount } },
      }),

      // Record the transaction
      prisma.transaction.create({
        data: {
          amount: amount,
          senderId: sendingParty.id, // Use sender's id
          receiverId: receivingParty.id, // Use receiver's id
        },
      }),
    ]);

    // Respond with success
    return NextResponse.json({
      sender: updatedSender,
      receiver: updatedReceiver,
      transaction: transaction,
      message: 'Amount sent successfully',
    });
  } catch (error) {
    console.error('An error occurred:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
