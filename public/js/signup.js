// variables
const form = document.querySelector('.form');  //capturo el form.
const fname = document.querySelector('#fname')
const lname = document.querySelector('#lname')
const avatar = document.querySelector('#avatar')
const email = document.querySelector('#email')
const password = document.querySelector('#password')
const errorsList = document.querySelector(".errors-list")

const reEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
console.log(fname);
const rePassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/;

// funciones


// eventos
fname.addEventListener('input', (event) => {
    console.log(event.target.value);
})

// ejecuciones inmediatas 

//consignas
//-Apenas cargue le formulario, debemos posicionarnos o tner el foco en 'Titulo de la pelicula' de forma automatica.
// Si se trata de enviar el formulario (presionando el boton "Agregar") estando todos o algun campo vacio -o que no cumpla con los requerimientos-, no sera posible.


form.addEventListener('submit', async (e) => {
    e.preventDefault(); //evito que se envie el formulario y se refresque la pagina.

    console.log(form.elements);

    //capturo elementos.
    const errors = [];  //guardo los errores para despues mostrarlos en pantalla

    if (fname.value.trim() < 2) {  // ' carlos gimenez '.trim() => 'carlos gimenez'  //trim() elimina los espacios en blanco
        errors.push('El nombre tiene que tener al menos dos caracteres')          //is.valid{color:red, borde:2px solid red;}
        fname.classList.add('is-invalid')                  //is.valid {color: green border: 2px solid green}
    }
    else {
        fname.classList.remove('is-invalid')
        fname.classList.add('is-valid')
    }

    if (lname.value.trim() <2 ) {  //trim() elimina los espacios en blanco
        errors.push('El titiulo no puede estar vacio')          
        lname.classList.add('is-invalid')                 
    }
    else {
        lname.classList.remove('is-invalid')
        lname.classList.add('is-valid')
    }

    if (avatar.files[0].type.includes('.jpg') || avatar.files[0].type.includes('.png') || avatar.files[0].type.includes('.jpeg')) {
        errors.push('la extensión del archivo no es válida')          
        avatar.classList.add('is-invalid')                  
    }
    else {
        avatar.classList.remove('is-invalid')
        avatar.classList.add('is-valid')
    }

    if (email.value.trim() == '') {
        errors.push('El email no puede estar vacio')          
        email.classList.add('is-invalid')                  
    }
    else {
        email.classList.remove('is-invalid')
        email.classList.add('is-valid')
    }

    if(!reEmail.test(email.value.trim())){ 
        errors.push('El email no es valido')          
        email.classList.add('is-invalid')                  
    }
    else{
        email.classList.remove('is-invalid')
        email.classList.add('is-valid')
    }

    if (password.value.trim() < 8) {
        errors.push('El titiulo no puede estar vacio')          
        password.classList.add('is-invalid')                  
    }
    else {
        password.classList.remove('is-invalid')
        password.classList.add('is-valid')
    }

    if(!rePassword.test(password.value.trim())){
        errors.push('El password no es valido')          
        password.classList.add('is-invalid')                  
    }
    else{
        password.classList.remove('is-invalid')
        password.classList.add('is-valid')
    }

    errorsList.innerHTML =''
    if (errors.length>0){
        errorsList.classList.add('alert-warning')
        Swal.fire = ({
                icon:'error',
                title:'Oops...',
                text:'Algunos campos no son validos',
        })
        errors.forEach( error => errorsList.innerHTML += `<li> ${error} </li>`)
    }    
    else{
        //Cuando existen archivos en el cuerpo de la peticion, no se puede enviar como JSON, sino que se envian como FORM-DATA.
        const formdata = newFormData(form)
        formdata.append('role','user_role')
        formdata.append('avatar',avatar.file[0])
        formdata.append('fname', fname.value)
        formdata.append('fname', lname.value)
        formdata.append('password',password.value)
        formdata.append('email',password.value)

        //si es que no existen archivos en el cuerpo de la peticion, se puede enviar como JSON.
        // const data= {
        //     fname: fname.value,
        //     lname: lname.value,
        //     avatar: avatar.value,
        //     email: email.value,
        //     password: password.value,
        //     role: 'user_role'
        // }
        const response = await fetch('/auth/new',
            {
                method:'POST',
                header: {"Content-Type": "multipart/form-data"},
                body:formdata
            }
        );
        const data = await response.json() //espero la respuesta del servidor y la convierto a objeto literal
        console.log(data) // muestro la respuesta del servidor
        /*
            Si el servidor responde ok, entonces:
            {
                ok: true,
                data: {
                    fname: 'carlos',
                    lname: 'gimenez',
                    avatar: 'carlos.jpg',
                    ...
                }
            }
        */
       if(data.ok){
           //redirecciono al usuario a la pagina de login
           window.location.href = '/auth/login'
       }
         else{
            //si el servidor responde con error, entonces:
            /*
                {
                    ok: false,
                    error: 'El usuario ya existe'
                }
            */
           Swal.fire({
               icon: 'error',
               title: 'Oops...',
               text: data.error
           })
        }
    }

    // si no tengo errores entonces envio el formulario
    console.log('enviando formulario...')
})