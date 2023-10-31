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


const getSkip = async (req, res) => {
    const skip = parseInt(req.query.skip)
    const take = parseInt(req.query.take)
    const movies = await prisma.movie.findMany({skip: skip, take: take})
      .then((result) => {
        res.json(result)
        console.log(result)
      })
      .catch((err) => {
        console.log('Erro: ' + err);
      });
}

const getListById = async (req, res) => {
  console.log('testando')
  const listId = req.body.listId;
  console.log(listId)
  const list = await prisma.movie.findMany({
    where: {
      id:{
        in: listId
      }
    }
  })
  console.log(list)
  console.log(parseInt(listId))
  console.log(listId)
  res.json(list)
}


const getAll = (req, res) => {
  console.log('entrei aqui')
  const movies = prisma.movie.findMany()
    .then((result) => {
      console.log('retornando ', result)
      
      res.json(result)
      })
    .catch((err) => {
      console.log('Erro: ' + err);
    });
}

const getById = async (req, res) => {
  console.log('req.query', req.query)
  const movies = await prisma.movie.findUnique({where: {id:  parseInt(req.query.id)}})
    .then((result) => {
      res.json(result)
      console.log(result)
    })
    .catch((err) => {
      console.log('Erro: ' + err);
    });
}

const getCount = async (req, res) => {
    const movies = await prisma.movie.findMany()
      .then((result) => {
        res.json(result.length)
        console.log(result)
    })
      .catch((err) => {
        console.log('Erro: ' + err);
    });
}

const addToFavorite = async (req, res) => {
  const par = req.body;
  const movies = await prisma.user.update({
    where: {
      id: par.userId
    }, 
    data: {
      favoriteIds:{
        push: par.movieId
      }
    }
  })
  res.sendStatus(200)
}

const updateFavorite = async (req, res) => {
  console.log('req', req.body)
  const par = req.body;
  const movies = await prisma.user.update({
    where: {
      id: par.userId
    }, 
    data: {
      favoriteIds: par.favoriteIds
    }
  })
  console.log('movies', movies)
  res.sendStatus(200)
}

const getFavoritList = (req, res) => {
  const userId = req.body.userId
  const list = prisma.user.findUnique({where:{id:userId}}).then((item) => { res.json(item.favoriteIds)})
  
}

const getFavorites = async (req, res) => {
  console.log(req.body)
  const idUser = req.body.idUser;
  const user = await prisma.user.findUnique({where:{id:idUser}})
  if(user){
    let list = []
    user.favoriteIds.forEach(idMovie => {
      let movie
      list.push({id: parseInt(idMovie)})
    })
    let movies = await prisma.movie.findMany({where: {OR: list}})
    res.json(movies)
  }
  else{
    res.sendStatus(204)
  }
  
}

const addOne = async (req, res) => {
  console.log(req.body)
  const movies = await prisma.movies.create({data: req.body});
  res.sendStatus(200)
  disconnect();
}

const addRange = async (req, res) => {
    console.log(req.body)
    const movies = await prisma.movie.createMany({data: req.body});
    res.sendStatus(200)
    disconnect();
  }

module.exports = {
  getAll, addOne, addRange, getCount, getSkip, getById, addToFavorite, updateFavorite, getListById, getFavorites, getFavoritList
}