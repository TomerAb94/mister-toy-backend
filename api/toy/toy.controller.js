import { toyService } from './toy.service.js'
import { logger } from '../../services/logger.service.js'

export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || '',
      maxPrice: +req.query.price || Infinity,
      inStock:
        req.query.inStock === 'true'
          ? true
          : req.query.inStock === 'false'
          ? false
          : '',
      labels: Array.isArray(req.query.labels)
        ? req.query.labels
        : typeof req.query.labels === 'string'
        ? req.query.labels
            .replace(/[\[\]'"]+/g, '')
            .split(',')
            .filter((l) => l)
        : [],
    }
    const sortBy = {
      sortField: req.query.sortField || '',
      sortDir: +req.query.sortDir || 1,
    }

    const toys = await toyService.query(filterBy, sortBy)
    res.json(toys)
  } catch (err) {
    logger.error('Failed to get toys', err)
    res.status(500).send({ err: 'Failed to get toys' })
  }
}

export async function getToyById(req, res) {
  try {
    const toyId = req.params.id
    const toy = await toyService.getById(toyId)
    res.json(toy)
  } catch (err) {
    logger.error('Failed to get toy', err)
    res.status(500).send({ err: 'Failed to get toy' })
  }
}

export async function addToy(req, res) {
  // const { loggedinUser } = req //Todo: add user logic

  try {
    const toy = req.body
    // toy.owner = loggedinUser //Todo: add user logic
    const addedToy = await toyService.add(toy)
    res.json(addedToy)
  } catch (err) {
    logger.error('Failed to add toy', err)
    res.status(500).send({ err: 'Failed to add toy' })
  }
}

export async function updateToy(req, res) {
  try {
    const toy = { ...req.body, _id: req.params.id }
    const updatedToy = await toyService.update(toy)
    res.json(updatedToy)
  } catch (err) {
    logger.error('Failed to update toy', err)
    res.status(500).send({ err: 'Failed to update toy' })
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.id
    const deletedCount = await toyService.remove(toyId)
    res.send(`${deletedCount} toys removed`)
  } catch (err) {
    logger.error('Failed to remove toy', err)
    res.status(500).send({ err: 'Failed to remove toy' })
  }
}

export async function addToyMsg(req, res) {
  const { loggedinUser } = req

  try {
    const { toyId } = req.params
    const { txt } = req.body
    const { _id, fullname } = loggedinUser
    const msg = {
      txt,
      by: { _id, fullname },
    }
    const addedMsg = await toyService.addMsg(toyId, msg)
    res.send(addedMsg)
  } catch (error) {
    loggerService.error('Cannot add message to toy', error)
    res.status(500).send('Cannot add message to toy')
  }
}

export async function removeToyMsg(req, res) {
  try {
    const { toyId, msgId } = req.params
    await toyService.removeMsg(toyId, msgId)
    res.send(msgId)
  } catch (error) {
    loggerService.error('Cannot delete message from toy', error)
    res.status(500).send('Cannot delete message from toy')
  }
}