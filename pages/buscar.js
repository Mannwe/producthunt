import React, {useState, useEffect} from 'react'
import Layout from '../components/layouts/Layout'
import {useRouter} from 'next/router'
import DetallesProducto from '../components/layouts/DetallesProducto'
import useProductos from '../hooks/useProductos'

const Buscar = () => {

    const router = useRouter()
    const { query: {q}} = router
    
    // Todos los productos
    const {productos} = useProductos('creado')
    const [resultado, guardarResultado] = useState([])

    useEffect(() => {
        if(!q) return

        console.log(q)
        
        const busqueda = q.toLowerCase()
        const filtro = productos.filter(producto => {
            return(
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })
        guardarResultado(filtro)
        
    }, [q, productos])
    
    console.log(resultado)
    
    return (
        <Layout>
            <div className="listado-productos">
                <div className="contenedor">
                    <ul className="bg-white">
                        {resultado.map(producto => (
                            <DetallesProducto
                                key={producto.id}
                                producto={producto}
                            />
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default Buscar