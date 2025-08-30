import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { toyService } from './services/toy.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

const corsOptions = {
  origin: [
    'http://127.0.0.1:8080',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
  ],
  credentials: true,
}

// Express Config:
app.use(express.static('public'))
app.use(cors(corsOptions))
app.use(cookieParser())
app.use(express.json())
app.set('query parser', 'extended')

//* REST API for "toys"
app.get('/api/toy', (req, res) => {
  const filterBy = {
    txt: req.query.txt || '',
    maxPrice: req.query.maxPrice || Infinity,
    inStock: req.query.inStock || '',
    labels: Array.isArray(req.query.labels)
      ? req.query.labels
      : typeof req.query.labels === 'string'
      ? req.query.labels
          .replace(/[\[\]'"]+/g, '')
          .split(',')
          .filter((l) => l)
      : [],
    sortBy: req.query.sortBy || '',
  }
  toyService
    .query(filterBy)
    .then((toys) => res.send(toys))
    .catch((err) => {
      loggerService.error('Cannot get toys', err)
      res.status(400).send('cannot get toys')
    })
})

app.get('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .getById(toyId)
    .then((toy) => res.send(toy))
    .catch((err) => {
      loggerService.error(`Cannot get toy ${toyId}`, err)
      res.status(400).send(`cannot get toy ${toyId}`)
    })
})

app.post('/api/toy', (req, res) => {
  const toy = req.body
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => {
      loggerService.error(`Cannot save toy`, err)
      res.status(400).send(`Cannot save toy`)
    })
})

app.put('/api/toy/:toyId', (req, res) => {
  const toy = req.body
  toyService
    .save(toy)
    .then((savedToy) => res.send(savedToy))
    .catch((err) => {
      loggerService.error(`Cannot save toy`, err)
      res.status(400).send(`Cannot save toy`)
    })
})

app.delete('/api/toy/:toyId', (req, res) => {
  const { toyId } = req.params
  toyService
    .remove(toyId)
    .then(() => res.send('Deleted successfully'))
    .catch((err) => {
      loggerService.error(`Cannot remove toy ${toyId}`, err)
      res.status(400).send(`Cannot remove toy ${toyId}`)
    })
})

// Fallback route
app.get('/*all', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const PORT = process.env.PORT || 3030
app.listen(PORT, () =>
  loggerService.info(`Server listening on port http://127.0.0.1:${PORT}/`)
)
