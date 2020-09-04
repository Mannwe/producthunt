const validarCrearProducto = (valores) => {
    let errores = {}

    // Validar el nombre del usuario
    if(!valores.nombre){
        errores.nombre = "El nombre es obligatorio"
    }

    // Validar la empresa
    if(!valores.empresa){
        errores.empresa = "La empresa es obligatoria"
    }

    // Validar la url
    if(!valores.url){
        errores.url = "La url del producto es obligatoria"
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = "La url del producto no es válida"
    }

    // Validar la descripción
    if(!valores.descripcion){
        errores.descripcion = "La descripcion es obligatoria"
    }

    return errores 
}

export default validarCrearProducto