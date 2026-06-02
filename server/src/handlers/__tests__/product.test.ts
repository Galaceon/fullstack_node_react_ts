import supertest from 'supertest'
import server, { connectDB } from '../../server'
import db from '../../config/db'

let request: ReturnType<typeof supertest>

beforeAll(async () => {
    await connectDB()
    request = supertest(server)
})

afterAll(async () => {
    await db.close()
    // Esperar un poco para que todos los handles se cierren
    await new Promise(resolve => setTimeout(resolve, 100))
})

describe('POST /api/products', () => {

    it('should display validation errors', async () => {
        const response = await request.post('/api/products').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(2)
    })


    it('should create a new product', async () => {
        const response = await request.post('/api/products').send({
            name : "Taza Gaming",
            price : 50
        })

        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('error')

        console.log(response.status)
    })


    it('should validate that the product is a number and price is greater than 0', async () => {
        const response = await request.post('/api/products').send({
            name: 'Monitor Curvo',
            price: "hola"
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)

        expect(response.status).not.toBe(404)
        expect(response.body.errors).not.toHaveLength(4)
    })
})

describe('GET /api/products', () => {

    it('should check if API products url exists', async () => {
        const response = await request.get('/api/products')
        expect(response.status).not.toBe(404)
    })


    it('GET a JSON response with products', async () => {
        const response = await request.get('/api/products')

        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)

        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {

    it('Should return a 404 response for a non-existent product', async() => {
        const productId= 2000
        const response = await request.get(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no Encontrado')
    })


    it('Should check a valid Id in the URL', async () => {
        const response = await request.get('/api/products/not-valid-url')

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })


    it('Get a JSON for a single Product', async () => {
        const response = await request.get('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {

    it('Should check a valid Id in the URL', async () => {
        const response = await request.put('/api/products/not-valid-url').send({
            name: "Monitor de 24 pulgaditas",
            availability: true,
            price: 300
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })


    it('should display validation error messages when updating a product', async () => {
        const response = await request.put('/api/products/1').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })


    it('should validate that the price is greater than 0', async () => {
        const response = await request.put('/api/products/1').send({
            name: "Monitor de 24 pulgaditas",
            availability: true,
            price: -200
        })

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe("Precio no valido")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })


    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000

        const response = await request.put(`/api/products/${productId}`).send({
            name: "Monitor de 24 pulgaditas",
            availability: true,
            price: 60
        })

        expect(response.status).toBe(404)
        expect(response.body.error).toBe("Producto no Encontrado")

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update an existing product with valid data', async () => {
        const productId = 1

        const response = await request.put(`/api/products/${productId}`).send({
            name: "Monitor de 24 pulgaditas - test",
            availability: true,
            price: 60
        })

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {
    it('should return a 404 response for a non-existing product', async () => {
        const productId= 2000
        const response = await request.patch(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no Encontrado')
        
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })

    it('should update the product availability', async () => {
        const response = await request.patch('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('error')
    })
})

describe('DELETE /api/products/:id', () => {
    it('Should check a valid ID', async () => {
        const response = await request.delete('/api/products/not-valid-url').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000

        const response = await request.delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
    })

    it('Should check a valid ID', async () => {
        const response = await request.delete('/api/products/not-valid-url').send({})

        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('should return a 404 response for a non-existent product', async () => {
        const productId = 2000

        const response = await request.delete(`/api/products/${productId}`)

        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto no Encontrado')

        expect(response.status).not.toBe(200)
    })

    it('should delete a product', async () => {
        const response = await request.delete('/api/products/1')

        expect(response.status).toBe(200)
        expect(response.body.data).toBe('producto eliminado')

        expect(response.status).not.toBe(400)
        expect(response.status).not.toBe(404)
    })
})

