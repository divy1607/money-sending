// app/api/transactions/[transactionId]/route.ts

import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request, { params }: { params: { transactionId: string } }) {
  try {
    const { transactionId } = params

    // Fetch transaction details by transactionId
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: {
        sender: true, // Include sender details
        receiver: true, // Include receiver details
      },
    })

    // If transaction is not found, return a 404 error
    if (!transaction) {
      return NextResponse.json(
        { message: 'Transaction not found' },
        { status: 404 }
      )
    }

    // Return transaction details
    return NextResponse.json(transaction)
  } catch (e) {
    console.error('An error occurred: ', e)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
