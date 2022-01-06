let carritoDeCompras = []
let stockProductos = []

const contenedorProductos = document.getElementById("contenedor-productos");
const contenedorCarrito= document.getElementById("carrito-contenedor");

const contadorCarrito= document.getElementById("contadorCarrito");
const precioTotal = document.getElementById("precioTotal");
const vaciarCarrito= document.getElementById("vaciar")

const selecTalles = document.getElementById("selecTalles")

const finalizarCompra = document.getElementById("fiNal")


selecTalles.addEventListener("change", () => {
    if(selecTalles.value == "all")
    mostrarProductos(stockProductos)
    else{
        mostrarProductos(stockProductos.filter(elemento => elemento.talle == selecTalles.value))
    }
})

$.getJSON("productos.json", function(articulos){
  articulos.forEach(elemento => {
    stockProductos.push(elemento)
    
  })

  mostrarProductos(stockProductos)
})


function mostrarProductos(array){
  $("#contenedor-productos").empty()
  for(let producto of array){
    let div=document.createElement("div")
    div.classList.add("card")
    div.innerHTML += `<div class="card" style="width: 21rem;">
    <img src=${producto.img} class="card-img-top" alt="...">
    <div class="card-body">
    <p class="card-text">${producto.nombre}</p>
    <p>${producto.desc}</p>
    <p> Talle ${producto.talle}
    <br>
    <p>$${producto.precio}</p>
    <button class="btn btn-success" id="agregar${producto.id}" href="#">Agregar al carrito</button>
    </div>
    </div>
                      `

    contenedorProductos.appendChild(div)

    let boton= document.getElementById(`agregar${producto.id}`)
          
    boton.addEventListener("click", () => {
        agregarAlCarrito(`${producto.id}`)
        Toastify({
          text: "🤑 Se agrego el producto al carrito",
          className: "info",
          style: {
            background: "green",
          }
        }).showToast();
        
    }) 
      
}}              
            
function agregarAlCarrito(id){
   
    let repetido = carritoDeCompras.find(elemento => elemento.id == id)
    if(repetido){
        repetido.cantidad = repetido.cantidad + 1
        document.getElementById(`cantidad${repetido.id}`).innerHTML = `<p id="cantidad${repetido.id}">Cantidad: ${repetido.cantidad}</p>`
       
        actualizarCarrito()
    }else{
        let productoAgregar = stockProductos.find(elemento => elemento.id == id)

        carritoDeCompras.push(productoAgregar)
           addLocalStorage(productoAgregar)
        
           
        actualizarCarrito()
        
        let div = document.createElement('div')
        div.classList.add('productoEnCarrito')
        div.innerHTML = `
                        <p>${productoAgregar.nombre}</p>
                        <p>Precio:$${productoAgregar.precio}</p>
                        <p id="cantidad${productoAgregar.id}">Cantidad: ${productoAgregar.cantidad}</p>
                        <button class="boton-eliminar" id="eliminar${productoAgregar.id}"><i class="material-icons">delete_sweep</i></button>`
        contenedorCarrito.appendChild(div)
       

        
        addLocalStorage()

        let botonEliminar = document.getElementById(`eliminar${productoAgregar.id}`)
               
        botonEliminar.addEventListener('click', ()=>{
            if(productoAgregar.cantidad == 1){
              botonEliminar.parentElement.remove()
              localStorage.removeItem(botonEliminar)
            carritoDeCompras = carritoDeCompras.filter(elemento => elemento.id != productoAgregar.id)
            Toastify({
                text: "💀Producto Eliminado",
                className: "info",
                style: {
                  background: "red",
                }
              }).showToast(); 
            }else{
                productoAgregar.cantidad = productoAgregar.cantidad - 1
                document.getElementById(`cantidad${productoAgregar.id}`).innerHTML = `<p id="cantidad${productoAgregar.id}">Cantidad: ${productoAgregar.cantidad}</p>`  
            }

            
           
            actualizarCarrito()
            
           
            
        })
    }
            //vaciar carrito
              vaciarCarrito.addEventListener('click', () => {
              carritoDeCompras = []; 
              contenedorCarrito.innerHTML= ""
              
    
             actualizarCarrito()
})


carritoDeCompras.onload = function () {
  const storage = JSON.parse(localStorage.getItem('carrito'));
    carritoDeCompras = storage;
    
}}


finalizarCompra.addEventListener("click", () => {
carritoDeCompras = []
 contenedorCarrito.innerHTML = ` <div class="alert alert-dismissible alert-success">
 <strong></strong> Gracias por su compra <a href="#" class="alert-link">Los productos seran enviados a la brevedad</a>.
</div>`

localStorage.clear("carrito")

actualizarCarrito()

})


function actualizarCarrito(){
    contadorCarrito.innerText = carritoDeCompras.reduce((acc, el) => acc + el.cantidad, 0)
    precioTotal.innerText = carritoDeCompras.reduce( (acc, el) => acc + (el.precio * el.cantidad),  0)
    addLocalStorage()
     
}

function addLocalStorage() {
  localStorage.setItem('carrito', JSON.stringify(carritoDeCompras))
  
}