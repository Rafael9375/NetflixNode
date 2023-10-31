const { PrismaClient } = require('@prisma/client')
const jwt = require('jsonwebtoken')
const jwt_decode = require('jwt-decode');

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
  
  const users = await prisma.verificationToken.findFirst
    .then((result) => {
      res.json(result)
      console.log(result)
    })
    .catch((err) => {
      console.log('Erro: ' + err);
    });
}

const addOne = async (req, res) => {
  const users = await prisma.verificationToken.create(req.body)
  disconnect();
  if(res != null){
    res.sendStatus(200)
  }
}

const checkRefreshToken = async (req, res) => {
  console.log('print do jwt decodificado (recebido da requisição)')
  let check = null;
  try{
    var decoded = jwt_decode(req.body.token)
    // if(Date.now() >= (1000 * decoded.exp)){
    //   console.log('asdasdas222222')
    //   res.status(401)
    //   console.log(decoded)
    // }
    // else{

    // }
    console.log(decoded)
    
    check = jwt.verify(req.body.token, process.env.MY_SECRET)
    console.log('resultado do método verify')
    const _check = await JSON.stringify(check)
    console.log(_check)
    const user = await prisma.user.findFirst({where: {id:check.id}})
    
    let dataAtual = new Date(Date.now()).getTime()
    let dataNova = new Date()
    dataNova.setTime(dataAtual + (5 * 60 * 60 * 1000))
    const refreshToken = jwt.sign(user, process.env.MY_SECRET, {expiresIn: dataNova.getTime()})
    console.log('novo tok criadi')
    console.log(refreshToken)
    console.log('tentando add novo token na base')
    try{
      
      const newtoken = await prisma.verificationToken.create({data: { token: refreshToken}})
      console.log('preenchendo retorno')
      const {password, ...excluding} = user
      excluding.token = newtoken.token;
      console.log('antes de send')
      console.log(res.body)
      console.log('deu certo')
      console.log(excluding)
      res.json(excluding)
    }
    catch (err){
      console.log('já que nao deu certo o try, faço o catch')
      console.log('esse foi o erro')
      console.log(err)
      delete decoded.password
      decoded.refreshToken = req.body.token
      res.json(decoded)
    }
    
    res.status(200)
  }
  catch (err){
    console.log('já que nao deu certo o try, faço o catch')
    console.log('esse foi o erro')
    console.log(err)
    res.status(401)
  }

  console.log('cheguei até aqui')
  res.send()
}

const createRefreshToken = async (req, res) => {
  const email = req.body.email;
  const user = await prisma.user.findUnique({where: {email: email}})
  if(user != null){
    const refreshToken = jwt.sign(user, process.env.MY_SECRET, {expiresIn: "5h"})
    const newToken = await prisma.verificationToken.create({data: { token: refreshToken}})
    res.json({token: newToken})
    res.status(200)
    disconnect();
  }
}

module.exports = {
  getAll, addOne, checkRefreshToken, createRefreshToken
}