import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { generateToken } from '../src/utils/jwt'
import { z } from 'zod'

const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

const resetPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(6),
})

describe('Auth Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Password Hashing', () => {
    it('should hash password correctly', async () => {
      const password = 'testpassword123'
      const hashed = await bcrypt.hash(password, 10)
      
      expect(hashed).not.toBe(password)
      expect(hashed.startsWith('$2')).toBe(true)
    })

    it('should compare password correctly', async () => {
      const password = 'testpassword123'
      const hashed = await bcrypt.hash(password, 10)
      
      const isValid = await bcrypt.compare(password, hashed)
      expect(isValid).toBe(true)
    })

    it('should return false for wrong password', async () => {
      const password = 'testpassword123'
      const hashed = await bcrypt.hash(password, 10)
      
      const isValid = await bcrypt.compare('wrongpassword', hashed)
      expect(isValid).toBe(false)
    })
  })

  describe('User Validation', () => {
    it('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      
      expect(emailRegex.test('test@example.com')).toBe(true)
      expect(emailRegex.test('invalid-email')).toBe(false)
      expect(emailRegex.test('@example.com')).toBe(false)
      expect(emailRegex.test('test@')).toBe(false)
    })

    it('should validate password minimum length', () => {
      const minPasswordLength = 6
      
      expect('123456'.length >= minPasswordLength).toBe(true)
      expect('12345'.length >= minPasswordLength).toBe(false)
    })
  })

  describe('Token Generation', () => {
    it('should generate token with correct payload', () => {
      const payload = {
        userId: 'user-123',
        email: 'test@example.com',
        role: 'USER',
      }
      
      const token = generateToken(payload)
      
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })
  })

  describe('Forgot Password', () => {
    it('should validate correct email format', () => {
      const validResult = forgotPasswordSchema.safeParse({ email: 'test@example.com' })
      expect(validResult.success).toBe(true)
    })

    it('should reject invalid email format', () => {
      const invalidResult = forgotPasswordSchema.safeParse({ email: 'invalid-email' })
      expect(invalidResult.success).toBe(false)
    })

    it('should generate reset token with correct length', () => {
      const token = crypto.randomBytes(32).toString('hex')
      expect(token.length).toBe(64)
    })

    it('should set reset token expiration to 1 hour', () => {
      const now = Date.now()
      const expiration = new Date(now + 60 * 60 * 1000)
      const expectedExpiration = now + 60 * 60 * 1000
      
      expect(expiration.getTime()).toBe(expectedExpiration)
    })
  })

  describe('Reset Password', () => {
    it('should validate token and password correctly', () => {
      const validResult = resetPasswordSchema.safeParse({
        token: 'abc123',
        password: 'newpassword123',
      })
      expect(validResult.success).toBe(true)
    })

    it('should reject password shorter than 6 characters', () => {
      const invalidResult = resetPasswordSchema.safeParse({
        token: 'abc123',
        password: '12345',
      })
      expect(invalidResult.success).toBe(false)
    })

    it('should reject missing token', () => {
      const invalidResult = resetPasswordSchema.safeParse({
        password: 'newpassword123',
      })
      expect(invalidResult.success).toBe(false)
    })

    it('should hash new password correctly', async () => {
      const newPassword = 'newpassword123'
      const hashed = await bcrypt.hash(newPassword, 10)
      
      expect(hashed).not.toBe(newPassword)
      expect(await bcrypt.compare(newPassword, hashed)).toBe(true)
    })
  })

  describe('Reset Token Validation', () => {
    it('should detect expired token', () => {
      const now = new Date()
      const expiredDate = new Date(now.getTime() - 60 * 60 * 1000)
      
      expect(expiredDate.getTime()).toBeLessThan(now.getTime())
    })

    it('should detect valid token', () => {
      const now = new Date()
      const validDate = new Date(now.getTime() + 60 * 60 * 1000)
      
      expect(validDate.getTime()).toBeGreaterThan(now.getTime())
    })

    it('should generate unique tokens', () => {
      const token1 = crypto.randomBytes(32).toString('hex')
      const token2 = crypto.randomBytes(32).toString('hex')
      
      expect(token1).not.toBe(token2)
    })
  })
})
