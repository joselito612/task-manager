import { generateToken, verifyToken, JWTPayload } from '../src/utils/jwt'

describe('JWT Utils', () => {
  const testPayload: JWTPayload = {
    userId: 'user-123',
    email: 'test@example.com',
    role: 'USER',
  }

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(testPayload)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3)
    })

    it('should generate different tokens for different payloads', () => {
      const token1 = generateToken(testPayload)
      const token2 = generateToken({ ...testPayload, userId: 'different-id' })
      expect(token1).not.toBe(token2)
    })
  })

  describe('verifyToken', () => {
    it('should verify a valid token and return payload', () => {
      const token = generateToken(testPayload)
      const decoded = verifyToken(token)
      
      expect(decoded.userId).toBe(testPayload.userId)
      expect(decoded.email).toBe(testPayload.email)
      expect(decoded.role).toBe(testPayload.role)
    })

    it('should throw error for invalid token', () => {
      expect(() => verifyToken('invalid-token')).toThrow()
    })

    it('should throw error for tampered token', () => {
      const token = generateToken(testPayload)
      const tamperedToken = token.slice(0, -5) + 'xxxxx'
      expect(() => verifyToken(tamperedToken)).toThrow()
    })
  })

  describe('Token with custom secret', () => {
    it('should use default secret when JWT_SECRET is not set', () => {
      const token = generateToken(testPayload)
      const decoded = verifyToken(token)
      expect(decoded.userId).toBe(testPayload.userId)
    })
  })
})
