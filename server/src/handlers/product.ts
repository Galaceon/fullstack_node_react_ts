import { Request, Response } from 'express'
import Product from '../models/Product.model'

// GET
export const getProducts = async (req: Request, res: Response) => {
    const products = await Product.findAll({
        order: [
            ['id', 'DESC']
        ],
        attributes: {exclude: ['createdAt', 'updatedAt']}
    })
    res.json({data: products})
}

// GET by Id
export const getProductById = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error:'Producto no Encontrado'
        })
    }

    res.json({data:product})
}

// POST
export const createProduct = async (req : Request, res: Response) => {
    const product = await Product.create(req.body)
    res.status(201).json({data: product})
}

// PUT
export const updateProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error:'Producto no Encontrado'
        })
    }

    // Actualizar
    await product.update(req.body)
    await product.save()

    res.json({data: product})
}

// PATCH
export const updateAvailability = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error:'Producto no Encontrado'
        })
    }

    // Actualizar
    product.availability = !product.dataValues.availability
    await product.save()

    res.json({data: product})
}

// DELETE
export const deleteProduct = async (req: Request, res: Response) => {
    const id = Number(req.params.id)
    const product = await Product.findByPk(id)

    if(!product) {
        return res.status(404).json({
            error:'Producto no Encontrado'
        })
    }

    await product.destroy()
    res.json({data: 'producto eliminado'})

}