// app/dashboard/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"

interface Transaction {
  id: string
  amount: number
  senderId: string
  receiverId: string
  createdAt: string
  sender: { username: string }
  receiver: { username: string }
}

export default function LogoutButton() {
  const { data: session } = useSession()
  const [recipientUsername, setRecipientUsername] = useState('')
  const [amount, setAmount] = useState('')
  const [showGetMoneyDialog, setShowGetMoneyDialog] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchTransactions()
  }, [])

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions')
      const data = await response.json()
      setTransactions(data)
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }

  const handleGetMoney = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/seed', {
        method: 'POST',
      })
      if (!response.ok) throw new Error('Failed to get money')
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMoney = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await fetch('/api/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientUsername,
          amount: parseFloat(amount)
        }),
      })
      if (!response.ok) throw new Error('Transfer failed')
      setRecipientUsername('')
      setAmount('')
      fetchTransactions()
      window.location.reload()
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Welcome, {session?.user?.username}</h1>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">Balance: ${session?.user?.balance}</p>
            {session?.user?.balance === 0 && (
              <Button onClick={() => setShowGetMoneyDialog(true)}>
                Get Money
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Send Money Form */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Send Money</h2>
            <form onSubmit={handleSendMoney} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Recipient Username
                </label>
                <Input
                  value={recipientUsername}
                  onChange={(e) => setRecipientUsername(e.target.value)}
                  placeholder="Enter username"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Sending...' : 'Send Money'}
              </Button>
            </form>
          </Card>

          {/* Transaction History */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="border-b pb-3 last:border-0"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {transaction.sender.username === session?.user?.username
                          ? `Sent to ${transaction.receiver.username}`
                          : `Received from ${transaction.sender.username}`}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p className={`font-semibold ${
                      transaction.sender.username === session?.user?.username
                        ? 'text-red-600'
                        : 'text-green-600'
                    }`}>
                      {transaction.sender.username === session?.user?.username ? '-' : '+'}
                      ${transaction.amount}
                    </p>
                  </div>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-center text-gray-500">No transactions yet</p>
              )}
            </div>
          </Card>
        </div>
      </main>

      <AlertDialog open={showGetMoneyDialog} onOpenChange={setShowGetMoneyDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Get Starting Balance</AlertDialogTitle>
            <AlertDialogDescription>
              Click confirm to receive $5000 in your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGetMoney} disabled={loading}>
              {loading ? 'Processing...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}