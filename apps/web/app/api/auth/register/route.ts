// app/api/auth/register/route.ts
import { prisma } from '../../../../lib/prisma'
import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
    try {
      const body = await req.json()
      console.log('1. Request received:', body)
  
      const { username, password } = body
      console.log('2. Parsed data:', { username: !!username, password: !!password })
  
      if (!username || !password) {
        console.log('3. Validation failed - missing fields')
        return NextResponse.json(
          { error: 'Missing username or password' },
          { status: 400 }
        )
      }
  
      try {
        const existingUser = await prisma.user.findUnique({
          where: { username }
        })
        console.log('4. Existing user check:', !!existingUser)
  
        if (existingUser) {
          console.log('5. User already exists')
          return NextResponse.json(
            { error: 'Username already taken' },
            { status: 400 }
          )
        }
  
        const hashedPassword = await bcrypt.hash(password, 10)
        console.log('6. Password hashed')
  
        console.log('7. Attempting to create user with data:', {
          username,
          hashedPasswordLength: hashedPassword.length,
        })
  
        const user = await prisma.user.create({
          data: {
            username,
            password: hashedPassword,
            balance: 0
          }
        })
        
        console.log('8. User created successfully:', {
          id: user.id,
          username: user.username
        })
  
        return NextResponse.json({ 
          message: 'User registered successfully',
          user: {
            id: user.id,
            username: user.username,
            balance: user.balance
          }
        })
  
      } catch (dbError) {
        console.error('Database operation failed:', dbError)
        throw dbError
      }
  
    } catch (error) {
      console.error('Registration error:', error)
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }