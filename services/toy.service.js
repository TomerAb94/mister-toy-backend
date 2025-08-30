import fs from 'fs'
import { utilService } from './util.service.js'
import { loggerService } from './logger.service.js'

export const toyService = {
  query,
  getById,
  remove,
  save,
}

// const PAGE_SIZE = 5
const toys = utilService.readJsonFile('data/toy.json')

function query(filterBy = { txt: '' }) {
  console.log(toys)
  if (!toys || !toys.length) return Promise.resolve([])
  let toysToShow = toys

  //* Filter

  if (filterBy.txt) {
    const regex = new RegExp(filterBy.txt, 'i')
    toysToShow = toysToShow.filter((toy) => regex.test(toy.name))
  }

  if (filterBy.maxPrice) {
    toysToShow = toysToShow.filter((toy) => toy.price <= filterBy.maxPrice)
  }

  if (filterBy.inStock) {
    toysToShow = toysToShow.filter((toy) => toy.inStock)
  }

  if (filterBy.labels && filterBy.labels.length) {
    toysToShow = toysToShow.filter((toy) =>
      filterBy.labels.every((label) => toy.labels.includes(label))
    )
  }

  //* Sort
  if (filterBy.sortBy) {
    if (filterBy.sortBy === 'name') {
      toysToShow = toysToShow.sort((a, b) => a.name.localeCompare(b.name))
    } else if (filterBy.sortBy === 'price') {
      toysToShow = toysToShow.sort((a, b) => a.price - b.price)
    } else if (filterBy.sortBy === 'createdAt') {
      toysToShow = toysToShow.sort((a, b) => b.createdAt - a.createdAt)
    }
  }

  // if (filterBy.pageIdx !== undefined) {
  //     const startIdx = filterBy.pageIdx * PAGE_SIZE
  //     toysToShow = toysToShow.slice(startIdx, startIdx + PAGE_SIZE)
  // }
  return Promise.resolve(toysToShow)
}

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId, loggedinUser) {
  const idx = toys.findIndex((toy) => toy._id === toyId)
  if (idx === -1) return Promise.reject('No Such Toy')

  //   const toy = toys[idx]
  //   if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser._id) {
  //     return Promise.reject('Not your toy')
  //   }
  toys.splice(idx, 1)
  return _saveToysToFile()
}

function save(toy, loggedinUser) {
  if (toy._id) {
    const toyToUpdate = toys.find((currToy) => currToy._id === toy._id)
    // if (!loggedinUser.isAdmin && toyToUpdate.owner._id !== loggedinUser._id) {
    //   return Promise.reject('Not your toy')
    // }
    toyToUpdate.name = toy.name
    toyToUpdate.price = toy.price
    toyToUpdate.imgUrl = toy.imgUrl
    toyToUpdate.labels = toy.labels
    toyToUpdate.inStock = toy.inStock

    toy = toyToUpdate
  } else {
    toy = {
      _id: utilService.makeId(),
      name: toy.name || '',
      price: toy.price || 0,
      imgUrl:
        toy.imgUrl ||
        'https://purepng.com/public/uploads/large/minion-toy-vbr.png',
      labels: toy.labels || [],
      inStock: toy.inStock || false,
      createdAt: toy.createdAt || Date.now(),
      ...toy, // This ensures any provided values override the defaults
    }
    // toy.owner = loggedinUser
    toys.push(toy)
  }
  //   delete toy.owner.score
  return _saveToysToFile().then(() => toy)
}

function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 2)
    fs.writeFile('data/toy.json', data, (err) => {
      if (err) {
        loggerService.error('Cannot write to toys file', err)
        return reject(err)
      }
      resolve()
    })
  })
}
