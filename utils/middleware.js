const morgan = require('morgan')
morgan.token('post', (request) => {
  if(request.method === 'POST' || request.method === 'PUT') {
    return JSON.stringify(request.body)
  }
})
const morganp = morgan(':method :url :status :res[content-length] - :response-time ms :post')

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if(error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error : 'malformatted id' })
  } else if(error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

const tokenExtractor = (request, response, next) => {
  const authorization =  request.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer')) {
    request.token = authorization.substring(7)
  }
  next()
}

module.exports = {
  morganp,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
}