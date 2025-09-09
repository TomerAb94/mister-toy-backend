import { ObjectId } from 'mongodb'

import { dbService } from '../../services/db.service.js'
import { logger } from '../../services/logger.service.js'
import { utilService } from '../../services/util.service.js'

export const toyService = {
  query,
  getById,
  remove,
  add,
  update,
  // addToyMsg,
  // removeToyMsg,
}

async function query(filterBy = { txt: '' }, sortBy = {}) {
  try {
    const criteria = {
      name: { $regex: filterBy.txt, $options: 'i' },
      price: { $lte: filterBy.maxPrice },
    }

    if (filterBy.inStock !== '') {
      criteria.inStock = { $eq: filterBy.inStock }
    }

    if (filterBy.labels?.length > 0) {
      criteria.labels = { $in: filterBy.labels }
    }
    console.log(filterBy)
    console.log(sortBy)

    const sort = sortBy.sortField ? { [sortBy.sortField]: sortBy.sortDir } : {}

    const collection = await dbService.getCollection('toy')
    var toys = await collection.find(criteria).sort(sort).toArray()
    return toys
  } catch (err) {
    logger.error('cannot find toys', err)
    throw err
  }
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    const toy = await collection.findOne({
      _id: ObjectId.createFromHexString(toyId),
    })
    toy.createdAt = toy._id.getTimestamp()
    return toy
  } catch (err) {
    logger.error(`while finding toy ${toyId}`, err)
    throw err
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection('toy')
    const { deletedCount } = await collection.deleteOne({
      _id: ObjectId.createFromHexString(toyId),
    })
    return deletedCount
  } catch (err) {
    logger.error(`cannot remove toy ${toyId}`, err)
    throw err
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection('toy')
    await collection.insertOne(toy)
    return toy
  } catch (err) {
    logger.error('cannot insert toy', err)
    throw err
  }
}

async function update(toy) {
  try {
    const toyToSave = {
      name: toy.name,
      price: toy.price,
      labels: toy.labels,
      inStock: toy.inStock,
      img: toy.imgUrl,
    }
    const collection = await dbService.getCollection('toy')
    await collection.updateOne(
      { _id: ObjectId.createFromHexString(toy._id) },
      { $set: toyToSave }
    )
    return toy
  } catch (err) {
    logger.error(`cannot update toy ${toy._id}`, err)
    throw err
  }
}
// async function addToyMsg(toyId, msg) {
// 	try {
// 		msg.id = utilService.makeId()

// 		const collection = await dbService.getCollection('toy')
// 		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $push: { msgs: msg } })
// 		return msg
// 	} catch (err) {
// 		logger.error(`cannot add toy msg ${toyId}`, err)
// 		throw err
// 	}
// }

// async function removeToyMsg(toyId, msgId) {
// 	try {
// 		const collection = await dbService.getCollection('toy')
// 		await collection.updateOne({ _id: ObjectId.createFromHexString(toyId) }, { $pull: { msgs: { id: msgId }}})
// 		return msgId
// 	} catch (err) {
// 		logger.error(`cannot add toy msg ${toyId}`, err)
// 		throw err
// 	}
// }
