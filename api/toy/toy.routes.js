import express from 'express'
// import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
// import { log } from '../../middlewares/logger.middleware.js'
import {
  getToys,
  getToyById,
  addToy,
  updateToy,
  removeToy,
  // addToyMsg,
  // removeToyMsg,
} from './toy.controller.js'

export const toyRoutes = express.Router()

// middleware that is specific to this router
// router.use(requireAuth)

toyRoutes.get('/', getToys) //Todo: add log middleware
toyRoutes.get('/:id', getToyById)
toyRoutes.post('/', addToy) //Todo: add requireAuth middleware
toyRoutes.put('/:id', updateToy) //Todo: add requireAuth middleware
toyRoutes.delete('/:id', removeToy) //Todo: add requireAuth middleware
// router.delete('/:id', requireAuth, requireAdmin, removeToy) 

// toyRoutes.post('/:id/msg', addToyMsg) //Todo: add requireAuth middleware
// toyRoutes.delete('/:id/msg/:msgId', removeToyMsg) //Todo: add requireAuth middleware
