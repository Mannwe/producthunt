import React, {useEffect, useContext, useState} from 'react'
import {useRouter} from 'next/router'
import {FirebaseContext} from '../../firebase'
import Error404 from '../../components/layouts/404'
import Layout from '../../components/layouts/Layout'
import styled from '@emotion/styled'
import {css} from '@emotion/core'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'
import {Campo, InputSubmit} from '../../components/ui/formulario'
import Boton from '../../components/ui/Boton'

const ContenedorProducto = styled.div`
    @media(min-width: 768px){
        display: grid;
        grid-template-columns: 2fr 1fr;
        column-gap: 2rem;
    }

    img{
        width: 100%;
    }
`

const CreadorProducto = styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    color: #fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align: center;
`

const Producto = () => {

    // state del componente
    const [producto, guardarProducto] = useState({})
    const [error, guardarError] = useState(false)
    const [comentario, guardarComentario] = useState({})
    const [consultarDB, guardarConsultarDB] = useState(true)

    // Routing para obtener el id actual
    const router = useRouter()
    const { query : { id } } = router

    // Context de firebase
    const {firebase, usuario} = useContext(FirebaseContext)

    useEffect(() => {
        if(id && consultarDB){
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('productos').doc(id)
                const producto = await productoQuery.get()
                if(producto.exists){
                    guardarProducto(producto.data())
                }else{
                    guardarError(true)
                }
                guardarConsultarDB(false)
            }
            obtenerProducto()
        }
    }, [id])

    if(Object.keys(producto).length === 0 && !error) return 'Cargando...'

    const {comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado} = producto

    // Administrar y validar los votos
    const votarProducto = () => {
        if(!usuario){
            router.push('/login')
        }

        // Verificar si el usuario actual ha votado
        if(haVotado.includes(usuario.uid)) return

        // Guardar el id del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid]

        // Obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1
        
        // Actualizar en la BBDD
        firebase.db.collection('productos').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // Actualizr el state
        guardarProducto({
            ...producto,
            votos: nuevoTotal
        })

        guardarConsultarDB(true) // Hay un voto, por lo tanto consultar a la bbdd
    }

    // Funciones para crear comentarios
    const comentarioChange = e => {
        guardarComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    // Identifica si el comentario es del creador del producto
    const esCreador = id => {
        return creador.id === id
    }

    const agregarComentario = e => {
        e.preventDefault()

        if(!usuario){
            router.push('/login')
        }

        // Información extra al comentario
        comentario.usuarioId = usuario.uid
        comentario.usuarioNombre = usuario.displayName

        // Tomar copia de comentarios y agregar al arreglo
        const nuevosComentarios = [...comentarios, comentario]

        // Actualizar la BBDD
        firebase.db.collection('productos').doc(id).update({
            comentarios: nuevosComentarios
        })

        // Actualizar el state
        guardarProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        guardarConsultarDB(true) // Hay un comentario, por lo tanto consultar a la bbdd
    }

    // Función que revisa que el creador del producto sea el mismo que el autenticado
    const puedeBorrar = () => {
        if(!usuario){
            return false
        }
        return creador.id === usuario.uid
    }

    // Elimina el producto de la base de datos
    const eliminarProducto = async () => {
        if(!usuario){
            router.push('/login')
        }

        if(creador.id !== usuario.uid){
            router.push('/')
        }

        try {
            await firebase.db.collection('productos').doc(id).delete()
            router.push('/')
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Layout>
            <>
                {error ? <Error404 /> 
                :
                (<div className="contenedor">
                    <h1
                        css={css`
                            text-align: center;
                            margin-top: 5rem;
                        `}
                    >
                        {nombre}
                    </h1>
                    <ContenedorProducto>
                        <div>
                            <p>Publicado hace {formatDistanceToNow(new Date(creado), {locale: es})} </p>
                            <p>por {creador.nombre} de {empresa}</p>
                            <img src={urlImagen} />
                            <p>{descripcion}</p>

                            {usuario && 
                                <>
                                    <h2>Agrega tu comentario</h2>
                                    <form
                                        onSubmit={agregarComentario}
                                    >
                                        <Campo>
                                            <input 
                                                type="text"
                                                name='mensaje'
                                                onChange={comentarioChange}
                                            />
                                        </Campo>
                                        <InputSubmit
                                            type='submit'    
                                            value='Agregar comentario'
                                        />
                                    </form>
                                </>}

                            <h2
                                css={css`
                                    margin: 2rem 0;
                                `}
                            >Comentarios</h2>
                            {comentarios.length === 0 ? 'Aún no hay comentarios'
                            :
                            <ul>
                                {comentarios.map((comentario, i) => (
                                    <li
                                        key={`${comentario.usuarioId}-${i}`}
                                        css={css`
                                            border: 1px solid #e1e1e1;
                                            padding: 2rem;
                                        `}
                                    >
                                        <p>{comentario.mensaje}</p>
                                        <p>Escrito por: 
                                            <span
                                                css={css`
                                                    font-weight: bold;
                                                `}      
                                            > {comentario.usuarioNombre}</span>
                                        </p>
                                        {esCreador(comentario.usuarioId) && <CreadorProducto>Es creador</CreadorProducto>}
                                    </li>
                                ))}
                            </ul>
                            }
                        </div>
                        <aside>
                            <Boton
                                target='_blank'
                                bgColor='true'
                                href={url}
                            >Viistar URL</Boton>
                            <div
                                css={css`
                                    margin-top: 5rem;
                                `}
                            >
                                <p
                                css={css`
                                    text-align: center;
                                `}
                                >{votos} votos</p>
                                {usuario && 
                                    <Boton onClick={votarProducto}
                                    >Votar</Boton>
                                }
                            </div>
                        </aside>
                    </ContenedorProducto>

                    {puedeBorrar() && 
                        <Boton
                            onClick={eliminarProducto}
                        >Eliminar Producto</Boton>
                    }
                </div>)
                }
            </>
        </Layout>
    )
}
 
export default Producto