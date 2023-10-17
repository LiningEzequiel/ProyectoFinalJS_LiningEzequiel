
// defino un array vacio para el carrito de compras
let carrito = [];

//referenciamos al nodo padre ul donde listaremos los productos seleccionados
let listaCarrito = document.getElementById("listaCarrito");


let resultado=document.getElementById("resultado");

// definimos una variable para acceder al contenedor padre de los productos disponibles
let contenedorProductos = document.getElementById("contenedorProductos");




//creamos una funcion para cargar los productos en el HTML
async function cargarProductos() {
    
    try {
        await new Promise((resolve)=> setTimeout(resolve, 2000));

        const response = await fetch("./data/data.json");
        if (!response.ok){
            throw new Error("No se pudo cargar los productos");
        }

        const productos = await response.json();

        productos.forEach(producto => {
            let div = document.createElement("div");
            div.className = "boxProduct";
            div.innerHTML = `
                                    <div>
                                        <img class="imagenProducto" src="${producto.imagen}" alt="${producto.tipo}">
                                    </div>
                                    <div class="producto">
                                        <h3>${producto.tipo} de Pino Elliotis ${producto.espesor}" x ${producto.ancho}" x ${producto.largo}m</h3>
                                    </div>
    
                                    <div class="boxPosition">
                                        <p> Precio: </p>
                                        <h2 class="subtituloEnColor">$${producto.precio}</h2>
                                    </div>
                                    <div class="boxPosition">
                                    <p> Cantidad </p>
                                        <input id="c${producto.id}" class="inputCantidad" type="number" name="cantidad"
                                            placeholder="Cantidad" value="1" pattern="^[0-9]+" required>
                                        <button type="button" id="a${producto.id}" class="botonAgregar"> Agregar </button>
                                    </div>
                                    `
            contenedorProductos.append(div);
        })

        escucharBotonesAgregar(productos);

       
    } catch (error) {
        console.error(error);

    }


}


 // llamamos a la funcion cargar productos
 cargarProductos();

// definimos el evento para escuchar a los botones agregar 


function escucharBotonesAgregar(productos) {
    let botonesAgregar = document.querySelectorAll(".botonAgregar")
       console.log(botonesAgregar);
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", (e) => agregarAlCarrito(e, productos));
    })

}



//creamos una funcion para agregar productos al carrito

function agregarAlCarrito(e, productos) {

    let idBoton = e.currentTarget.id; //detectamos el boton agregar sobre el que se hizo click y capturamos su id
    console.log(idBoton);
    
    let productoSeleccionado = productos.find(producto => `a${producto.id}` === idBoton); // filtramos el producto seleccionado
    console.log(productoSeleccionado); //permite mostrar el producto seleccionado



    let inputCantidad = document.getElementsByClassName("inputCantidad"); // capturamos todos los elementos input con clase "inputCantidad"
    console.log(inputCantidad);  //permite mostrar la lista de inputs cantidad

    for (input of inputCantidad) {      // recorremos la lista de inputs y buscamos aquel que esta asociado al boton sobre el que se hizo click
        if (input.id === `c${productoSeleccionado.id}`) {
            inputActual = input.id //guardamos el id del input
        }
    }
    console.log(inputActual); //permite mostrar el id del input actual
    let inputC = document.getElementById(`${inputActual}`).value; // obtenemos el valor del input asociado al boton agregar sobre el q hicimos click


    console.log(inputC); //permite mostrar el valor del input

    
    carrito.push({           // pusheamos al carrito el producto filtrado agregando propiedades extra
        id: productoSeleccionado.id,
        tipo: productoSeleccionado.tipo,
        espesor: productoSeleccionado.espesor,
        ancho: productoSeleccionado.ancho,
        largo: productoSeleccionado.largo,
        precio: productoSeleccionado.precio,
        cantidad: parseInt(inputC),
        precioTotal: Number((inputC*productoSeleccionado.precio).toFixed(2))
         
    })

    console.log(carrito); //permite mostrar el contenido actual del carrito

    localStorage.setItem("carrito", JSON.stringify(carrito)); // lo mandamos al storage
 
    document.getElementById(`${inputActual}`).value = 1; //limpiamos los campos de las cantidades

    Toastify({
        text: "Producto añadido",
        duration: 1000,
        
        newWindow: true,
        close: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        
      }).showToast();

    mostrarCarrito(); //llamamos a la funcion que mostrara el carrito en el HTML
}



//creamos una funcion para mostrar productos en el carrito

function mostrarCarrito() {
    listaCarrito.innerHTML=""; // reseteamos el DOM para no repetir valores de productos

    let productosEnCarrito; // definimos una variable local para trabajar los datos que obtenemos del storage

    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));
   


// recorremos el array para mostrarlo en el DOM
    for (producto of productosEnCarrito) {
        let item = document.createElement("li");
        let divHijo = document.createElement("div");
        divHijo.className = "boxProductoElegido";
        divHijo.innerHTML = `
                                 
                                 <p>${producto.tipo} ${producto.espesor}" x ${producto.ancho}" x ${producto.largo}m</p>
                                 <p>${producto.cantidad}</p>
                                 <p>$${producto.precio}</p>
                                 <p>$${producto.precioTotal}</p>
                                 <button id="e${producto.id}" type="button" class="botonEliminar">Eliminar</button>
                                 `
item.append(divHijo);
listaCarrito.append(item);



    }

    carrito=productosEnCarrito; //reasignamos el valor actual del storage al carrito
    console.log(carrito);
    escucharBotonesEliminar(); //una vez creados los botones eliminar, activamos las escuchas 
    actualizarTotales(); //actualizamos el valor del contador del monto total de todos los productos existentes en el carrito
}



// escuchamos los botones eliminar
function escucharBotonesEliminar() {
    let botonesEliminar = document.querySelectorAll(".botonEliminar")
console.log(botonesEliminar);

    botonesEliminar.forEach(boton => {
        boton.addEventListener("click", eliminarProducto);


    })

}





// funcion para eliminar producto del carrito

function eliminarProducto(e){
    let idBotonEliminar = e.currentTarget.id;
    console.log(idBotonEliminar);
    
    let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")); // variable local para traer del storage el contenido del carrito
   
    console.log(productosEnCarrito);

    //recorremos el array temporal para encontrar el indice del producto que se desea eliminar
let index = productosEnCarrito.findIndex(producto => `e${producto.id}` === idBotonEliminar); 
console.log(index);
    // console.log(productosEnCarrito);
    productosEnCarrito.splice(index,1); // eliminamos el objeto ubicado en el indice donde el id del producto coincide con el id del boton eliminar
    console.log(carrito);

    
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito)); // una vez eliminado, volvemos a guardar en el storage el nuevo array
    
    
    Toastify({
        text: "Producto eliminado",
        duration: 1000,
        
        newWindow: true,
        close: true,
        gravity: "bottom", 
        position: "right", 
        stopOnFocus: true, 
        style: {
          background: "linear-gradient(to right, #00b09b, #96c93d)",
        },
        
      }).showToast();
   
   
   
    mostrarCarrito()



}

// escuchamos el boton vaciar
function escucharBotonVaciar() {
    let botonVaciar = document.getElementById("botonVaciar")
    botonVaciar.addEventListener("click", vaciarCarrito);

}
escucharBotonVaciar();

function vaciarCarrito() {
    let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")); // variable local para traer del storage el contenido del carrito
   
    if (productosEnCarrito.length==0){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay productos en el carrito!',
            
          })
       

    } else {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Carrito vacio',
            showConfirmButton: false,
            timer: 2000
          })




          productosEnCarrito.length=0;
              localStorage.setItem("carrito", JSON.stringify(productosEnCarrito)); // una vez eliminado, volvemos a guardar en el storage el nuevo array
        

    }

    console.log(carrito);
    console.log(productosEnCarrito);
    mostrarCarrito();

}


// funcion para actualizar totales

function actualizarTotales(){

    let productos = JSON.parse(localStorage.getItem("carrito"));
let total=0;
productos.forEach(producto => {
    total+=producto.precioTotal
    
})
resultado.innerText=`$${total}`;

}




function botonComprar() {
    let botonComprar = document.getElementById("botonComprar")
    botonComprar.addEventListener("click", comprarCarrito);
}

botonComprar();

// funcion para comprar
function comprarCarrito(){
    let productosEnCarrito = JSON.parse(localStorage.getItem("carrito")); // variable local para traer del storage el contenido del carrito
    
    if (productosEnCarrito.length==0){

        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No hay productos en el carrito!',
            
          })
       

    } else {
        Swal.fire({
            title: 'Debe Iniciar Sesión',
            html: `<input type="text" id="login" class="swal2-input" placeholder="Username">
            <input type="password" id="password" class="swal2-input" placeholder="Password">`,
            confirmButtonText: 'Acceder',
            focusConfirm: false,
            preConfirm: () => {
              const login = Swal.getPopup().querySelector('#usuario').value
              const password = Swal.getPopup().querySelector('#contraseña').value
              if (!login || !password) {
                Swal.showValidationMessage(`Por favor, ingrese su usuario y contraseña`)
              }
              return { login: login, password: password }
            }
          }).then((result) => {
            Swal.fire(`
              Login: ${result.value.login}
              Password: ${result.value.password}
            `.trim())
          })
    }
    
    
    
    
    
}