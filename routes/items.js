const express = require('express')
const router = express.Router()
const ExpressError = require('../expressError')
const items = require('../fakeDb')

router.get('/', (req, res) => {
  res.json({ items })
})

router.post('/', (req, res, next) => {
  try {
    if (!req.body.name) throw new ExpressError('Need Name', 400)
    const newItem = { name: req.body.name, price: req.body.price }
    items.push(newItem)
    return res.status(201).json({ item: newItem })
  } catch (e) {
    return next(e)
  }
})

router.get('/:name', (req, res) => {
  const itemFound = items.find((item) => item.name === req.params.name)
  if (itemFound === undefined) {
    throw new ExpressError('Item Not Found', 404)
  }
  res.json({ item: itemFound })
})

router.patch('/:name', (req, res) => {
  const itemFound = items.find((item) => item.name === req.params.name)
  if (itemFound === undefined) {
    throw new ExpressError('Item Not Found', 404)
  }
  itemFound.name = req.body.name
  res.json({ item: itemFound })
})

router.delete('/:name', (req, res) => {
  const itemFound = items.findIndex((item) => item.name === req.params.name)
  if (itemFound === -1) {
    throw new ExpressError('Item Not Found', 404)
  }
  items.splice(itemFound, 1)
  res.json({ message: 'Deleted!' })
})

module.exports = router
