const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const disconnect = async () => {
  await prisma.$disconnect()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
}


const getAll = async (req, res) => {
  
  const users = await prisma.user.findFirst()
    .then((result) => {
      res.json(result)
      console.log(result)
    })
    .catch((err) => {
      console.log('Erro: ' + err);
    });
}

const addOne = async (req, res) => {
  console.log(req.body)
  const users = await prisma.user.update(req.body)
  res.sendStatus(200)
  disconnect();
}

module.exports = {
  getAll, addOne
}