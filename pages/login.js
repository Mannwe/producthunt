import React, {useState} from 'react'
import Layout from '../components/layouts/Layout'
import {Formulario, Campo, InputSubmit, Error} from '../components/ui/formulario'
import {css} from '@emotion/core'
import Router from 'next/router'

import firebase from '../firebase'

// Validaciones
import useValidacion from '../hooks/useValidacion'
import validarIniciarSesion from '../validacion/validarIniciarSesion'

const STATE_INICIAL = {
    nombre: '',
    email: ''
}

const Login = () => {
    const [error, guardarError] = useState(false)
    const {valores, errores, submitForm, handleSubmit, handleChange, handleBlur } = 
        useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion)

    const { email, password } = valores
        
    async function iniciarSesion(){
        try {
            await firebase.login(email, password)
            Router.push('/')
        } catch (error) {
            console.log('Se ha producido un error al autenticar el usuario: ' + error.message)
            guardarError(error.message)
        }
        console.log('Iniciando sesión...')
    }

    return (
        <Layout>
            <h1
                css={css`
                    text-align: center;
                    margin-top: 5rem;
                `}
            >Iniciar Sesión</h1>
            <Formulario
                onSubmit={handleSubmit}
                noValidate
            >
                <Campo>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder='Tu email'
                        name='email'
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.email && <Error>{errores.email}</Error>}

                <Campo>
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        placeholder='Tu password'
                        name='password'
                        value={password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>

                {errores.password && <Error>{errores.password}</Error>}

                <InputSubmit 
                    type="submit" 
                    value="Iniciar Sesión"
                />
                {error && <Error>{error}</Error>}

            </Formulario>
        </Layout>
    );
}

export default Login