process.env.NODE_ENV = 'test'

const request = require('supertest')

const app = require('../app')
let items = require('../fakeDb')

let chips = { name: 'Chips', price: 3.5 }

beforeEach(() => {
  items.push(chips)
})

afterEach(() => {
  items.length = 0
})

describe('GET /items', () => {
  test('Get all items', async () => {
    const res = await request(app).get('/items')
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ items: [chips] })
    expect(items).toHaveLength(1)
  })
})

describe('GET /item/:name', () => {
  test('get one single item', async () => {
    const res = await request(app).get(`/items/${chips.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: chips })
  })
  test('404 for invalid item', async () => {
    const res = await request(app).get(`/items/gabagool`)
    expect(res.statusCode).toBe(404)
  })
})

describe('POST /items', () => {
  test('Creating new item', async () => {
    const res = await request(app)
      .post(`/items`)
      .send({ name: 'chocolate', price: 5.5 })
    expect(res.statusCode).toBe(201)
    expect(res.body.item).toHaveProperty('name')
    expect(res.body.item).toHaveProperty('price')
    expect(res.body.item.name).toEqual('chocolate')
    expect(res.body.item.price).toEqual(5.5)
  })
})

describe('PATCH /items/:name', () => {
  test('Updating a new item', async () => {
    const res = await request(app)
      .patch(`/items/${chips.name}`)
      .send({ name: 'gushers' })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ item: { name: 'gushers', price: 3.5 } })
    expect(res.body.item).toEqual({ name: 'gushers', price: 3.5 })
    expect(res.body.item.name).toEqual('gushers')
  })
  test('404 if cant find item', async () => {
    const res = await request(app)
      .patch('/items/calzone')
      .send({ name: 'Monster' })
    expect(res.statusCode).toBe(404)
  })
})

describe('DELETE /items/:name', () => {
  test('deleting an item with name', async () => {
    const res = await request(app).delete(`/items/${chips.name}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ message: 'Deleted!' })
    expect(items).toHaveLength(0)
  })
  test('404 for deleting an item that is not there', async () => {
    const res = await request(app).delete('/items/bugsbunny')
    expect(res.statusCode).toBe(404)
  })
})
