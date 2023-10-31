const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const validationToken = require('../controllers/verificationTokenController.js')

const prisma = new PrismaClient()

const disconnect = async () => {
  await prisma.$disconnect()
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
}

const signup = async (req, res) => {
  const newUser = req.body;
  const user = prisma.user.create({ data: { newUser } })
  res.sendStatus(200)
}

const signinProvider = async (req, res) => {
  const email = req.body.email;
  const userFounded = getByEmail({ body: email })
  if(userFounded != null){
    let dataAtual = new Date(Date.now()).getTime()
    let dataNova = new Date()
    dataNova.setTime(dataAtual + (5 * 60 * 1000))
    const token = jwt.sign(user, process.env.MY_SECRET, {expiresIn: dataNova.getTime()})
    dataNova.setTime(dataAtual + (5 * 60 * 60 * 1000))
    const refreshToken = jwt.sign(user, process.env.MY_SECRET, {expiresIn: dataNova.getTime()})
  }
  else{
    const newUser = req.body;
    const createUser = signup(
      {
        email: newUser.email,
        image: newUser.picture,
        name: newUser.name
      }
    )
  }
}

const signin = async (req, res) => {
  const userPar = req.body;
  console.log(userPar)
  const user = await prisma.user.findUnique({ where: { email: userPar.email } } );
  if(user != null){
    if(user.password == userPar.password){
      console.log("achei")
      let dataAtual = new Date(Date.now()).getTime()
      let dataNova = new Date()
      dataNova.setTime(dataAtual + (5 * 60 * 1000))
      const token = jwt.sign(user, process.env.MY_SECRET, {expiresIn: dataNova.getTime()})
      dataNova.setTime(dataAtual + (5 * 60 * 60 * 1000))
      const refreshToken = jwt.sign(user, process.env.MY_SECRET, {expiresIn: dataNova.getTime()})
      const objToken = {body: { data: { token: refreshToken } } }
      validationToken.addOne(objToken)
      res.setHeader('token', token)
      user.refreshToken = refreshToken;
      delete user.password
      res.send(user)
      //res.send({token: objToken, refreshToken: refreshToken})
    }
    else{
      console.log("senha errada")
      res.sendStatus(401)
    }
  }
  else{
    console.log("não achei")
    res.sendStatus(404)
  }
  
}

const getByEmail = async (req, res) => {
  const email = req.body;
  console.log('procurar por ', email)
  const lookUpUser = await prisma.user.findUnique({ where: email })
  if(lookUpUser != null){
    res.send(lookUpUser)
  }
  else{
    res.sendStatus(204)
  }

}

const getAll = async (req, res) => {

  const users = await prisma.user.findUnique()
    .then((result) => {
      const token = jwt.sign(result, process.env.MY_SECRET, {expiresIn: "1h"})
      console.log('segue o token')
      console.log(token)
      // res.json(result)
      // console.log(result)
    })
    .catch((err) => {
      console.log('Erro: ' + err);
    });
}

const addOne = async (req, res) => {
  console.log(req.body)
  const newUser = req.body
  
  const userExists = prisma.user.findFirst({where:{email:newUser.email}})
    .then((resp) => 
    {
      if(resp){
        //  ret.message = 'This email is already in use. Please choose another one.'
        res.json({ message:'This email is already in use. Please choose another one.', id: null })
      }
      else{
        const userCreated = prisma.user.create({data:newUser})
        .then((created) => {res.json({id: created.id})})
      }
    })
  
  disconnect();
}

module.exports = {
  getAll, 
  addOne, 
  signin,
  signinProvider,
  getByEmail
}