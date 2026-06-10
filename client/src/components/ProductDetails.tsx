import type { Product } from "../types"
import { formatCurrency } from "../utils"
import { Form, useNavigate, type ActionFunctionArgs, redirect } from 'react-router-dom'

type ProductDetailsProps = {
    product: Product
}

export async function action({params} : ActionFunctionArgs) {
    console.log(params.id)

    return redirect('/')
}

export default function ProductDetails({product} : ProductDetailsProps) {

    const navigate = useNavigate()

    const isAvailable = product.availability

    return (
        <tr className="border-b">
            <td className="p-3 text-lg text-gray-800">
                {product.name}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {formatCurrency(product.price)}
            </td>
            <td className="p-3 text-lg text-gray-800">
                {isAvailable ? 'Disponible' : 'No disponible'}
            </td>
            <td className="p-3 text-lg text-gray-800 ">
                <div className="flex gap-2 items-center">
                    <button 
                        onClick={() => navigate(`/productos/${product.id}/editar`)}
                        className="bg-indigo-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center cursor-pointer"
                    >Editar</button>

                    <Form 
                        className="w-full" 
                        method="POST"
                        action={`productos/${product.id}/eliminar`}
                    >
                        <input 
                            type="submit"
                            value='Eliminar'
                            className="bg-red-600 text-white rounded-lg w-full p-2 uppercase font-bold text-xs text-center cursor-pointer"
                        />
                    </Form>
                </div>
            </td>
        </tr> 
    )
}
