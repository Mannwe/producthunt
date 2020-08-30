import React, {useState, useEffect} from 'react'
import firebase from '../firebase'

const useAutenticacion = () => {
    const [usuarioAutenticado, guardarUsuarioAutenticado] = useState(null)

    useEffect(() => {
        const unsubscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario){
                guardarUsuarioAutenticado(usuario)
            }else{
                guardarUsuarioAutenticado(null)
            }
        })
        return () => unsubscribe()
    }, [])

    return usuarioAutenticado
}

export default useAutenticacion