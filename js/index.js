
// defino un array de 9 productos con sus caracteristicas dimensionales y su precio unitario
// const productos = [
//     {
//         id: 1,
//         imagen: "./image/prod_tabla.jpg",
//         tipo: "Tabla",
//         espesor: 1,
//         ancho: 6,
//         largo: 3,
//         precio: 738.18
//     },
//     {
//         id: 2,
//         imagen: "./image/prod_tabla.jpg",
//         tipo: "Tabla",
//         espesor: 1,
//         ancho: 6,
//         largo: 4,
//         precio: 984.24
//     },
//     {
//         id: 3,
//         imagen: "./image/prod_tabla.jpg",
//         tipo: "Tabla",
//         espesor: 1,
//         ancho: 6,
//         largo: 5,
//         precio: 1230.30
//     },
//     {
//         id: 4,
//         imagen: "./image/prod_tirante.jpg",
//         tipo: "Tirante",
//         espesor: 2,
//         ancho: 4,
//         largo: 3,
//         precio: 1181.10
//     },
//     {
//         id: 5,
//         imagen: "./image/prod_tirante.jpg",
//         tipo: "Tirante",
//         espesor: 2,
//         ancho: 4,
//         largo: 4,
//         precio: 1574.78
//     },
//     {
//         id: 6,
//         imagen: "./image/prod_tirante.jpg",
//         tipo: "Tirante",
//         espesor: 2,
//         ancho: 4,
//         largo: 5,
//         precio: 1968.48
//     },
//     {
//         id: 7,
//         imagen: "./image/prod_viga.jpg",
//         tipo: "Viga",
//         espesor: 3,
//         ancho: 6,
//         largo: 3,
//         precio: 2952.72
//     },
//     {
//         id: 8,
//         imagen: "./image/prod_viga.jpg",
//         tipo: "Viga",
//         espesor: 3,
//         ancho: 6,
//         largo: 4,
//         precio: 3936.96
//     },
//     {
//         id: 9,
//         imagen: "./image/prod_viga.jpg",
//         tipo: "Viga",
//         espesor: 3,
//         ancho: 6,
//         largo: 5,
//         precio: 4921.20
//     },

// ];




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
        // await new Promise((resolve)=> setTimeout(resolve, 2000));

        const response = await fetch("./data/data.json");
        // if (!response.ok){
        //     throw new Error("No se pudo cargar los productos");
        // }

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
    
                                    <div>
                                        <h2 class="subtituloEnColor">$${producto.precio}</h2>
                                    </div>
                                    <div class="boxPosition">
                                        <input id="c${producto.id}" class="inputCantidad" type="number" name="cantidad"
                                            placeholder="Cantidad" value="1" pattern="^[0-9]+" required>
                                        <button type="button" id="a${producto.id}" class="botonAgregar"> Agregar </button>
                                    </div>
                                    `
            contenedorProductos.append(div);
    
            
    
        })

       
    } catch (error) {
        console.error(error);

    }


}


 // llamamos a la funcion cargar productos
 cargarProductos();

// definimos el evento para escuchar a los botones agregar 



function escucharBotonesAgregar() {
    let botonesAgregar = document.querySelectorAll(".botonAgregar")
       console.log(botonesAgregar);
    botonesAgregar.forEach(boton => {
        boton.addEventListener("click", agregarAlCarrito);
    })

}
escucharBotonesAgregar();


//creamos una funcion para agregar productos al carrito

function agregarAlCarrito(e) {

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

    mostrarCarrito(); //llamamos a la funcion que mostrara el carrito en el HTML
}



//creamos una funcion para mostrar productos en el carrito

function mostrarCarrito() {
    listaCarrito.innerHTML=""; // reseteamos el DOM para no repetir valores de productos

    let productosEnCarrito; // definimos una variable local para trabajar los datos que obtenemos del storage

// let carrito=JSON.parse(localStorage.getItem("carrito")) || [] ;
    // console.log(carrito);


    productosEnCarrito = JSON.parse(localStorage.getItem("carrito"));
    // console.log(productosEnCarrito);


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
   

    console.log(carrito);
    console.log(productosEnCarrito);

    //recorremos el array temporal para encontrar el indice del producto que se desea eliminar
let index = productosEnCarrito.findIndex(producto => `e${producto.id}` === idBotonEliminar); 
console.log(index);
    // console.log(productosEnCarrito);
    productosEnCarrito.splice(index,1); // eliminamos el objeto ubicado en el indice donde el id del producto coincide con el id del boton eliminar
    console.log(carrito);

    
    localStorage.setItem("carrito", JSON.stringify(productosEnCarrito)); // una vez eliminado, volvemos a guardar en el storage el nuevo array
    mostrarCarrito()

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