import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {

  const user = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@email.com",
      password: "123456"
    }
  })

  console.log(user)

}

main()