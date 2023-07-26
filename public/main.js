// VARIABLES
const formulario = document.querySelector("#formulario");
const divReference = document.querySelector("#div-reference");
const listGroup = document.querySelector("#list-group");
const btnDelete = document.querySelector("btn-delete");
const btnAgregar = document.querySelector("#buttonsub")




// EVENTOS 

eventListeners();
function eventListeners(){
    
    document.addEventListener("DOMContentLoaded",preguntarPresupuesto);
    formulario.addEventListener("submit", agregarGasto);
   
}
// CLASES

class Presupuesto {
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }
    // agregamos los nuevos gastos al array de gastos
    nuevoGasto(gasto){
        this.gastos=[...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce((total,gasto)=>  // ITERAMOS SOBRES GASTOS DONDE CADA CANTIDAD DE SE IRA SUMANDO.
            total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto  => gasto.id !== id);
        this.calcularRestante();

    }
}

class UI {
insertarPresupuesto(cantidad){
    const {presupuesto, restante} = cantidad;

    document.querySelector("#total").textContent = presupuesto;
    document.querySelector("#restante").textContent = restante;
    
    }


agregarAlerta(mensaje,tipo){
    
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center","rounded-lg", "h-14", "text-2xl", "p-3");

        if(tipo=== "error"){
            divMensaje.classList.add("bg-red-400");
        
        }else{ 
            divMensaje.classList.add("bg-green-200");
        }

        divMensaje.textContent= mensaje;

        //INSERTAR EN EL DOM
        document.querySelector("#formulario").insertBefore(divMensaje, divReference);

        setTimeout(()=>{
            divMensaje.remove();
        },3000)

    }

agregarGastoListado(gastos){
    // iterar sobre los gastos 
    this.limpiarHTML();
    gastos.forEach( gasto=>{
        const {cantidad, nombre, id}= gasto;

    //CREAR UN LI
        const nuevoGasto = document.createElement("li");
        nuevoGasto.className = "flex items-center justify-between px-5 my-3 text-3xl border rounded shadow-lg h-14";
        nuevoGasto.setAttribute("data-id", id);


    // AGREGAR EL HTML DEL GASTO
    nuevoGasto.innerHTML = `${nombre}<span class= "bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-full"><b>$ ${cantidad}</b></span>`;



    // CREAR UN BOTON PARA BORRA EL GASTO
        const btnborrar = document.createElement("button");
        btnborrar.textContent = "X";
        btnborrar.className="w-10 h-10 text-center text-white bg-red-500 rounded-full hover:bg-red-700 btn-delete";
        btnborrar.onclick = () =>{
            eliminarGasto(id);
        }

    // AGREGAR AL HTML 
        nuevoGasto.appendChild(btnborrar);
        listGroup.appendChild(nuevoGasto); 

        })
    }
    // APPENDCHILD NO BORRA EL HTML PREVIO POR LO QUE DEBEMOS LIMPIARLO
    limpiarHTML(){
        while(listGroup.firstChild){
            listGroup.removeChild(listGroup.firstChild);  //MIENTRAS TENGAMOS UN HIJO EN LA UL VAMOS AL ELEMINAR AL PRIMERO CUANDO TENGAMOS EL PROXIMO
        }
    }
    // ACTUALIZAMOS EL RESTANTE EN EL HTML
    actualizarRestante(restante){
        document.querySelector("#restante").textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj){
        const {presupuesto,restante} = presupuestoObj;

        const restanteDiv = document.querySelector("#restante-div");

        // COMPROBAR 25%
        if( (presupuesto / 4) > restante){

                restanteDiv.classList.remove("bg-blue-200");

                restanteDiv.classList.add("bg-red-200");

        }else if((presupuesto / 2 > restante ) ){

            restanteDiv.classList.remove("bg-blue-200");

            restanteDiv.classList.add("bg-yellow-200");
        }else{
                restanteDiv.classList.remove('bg-red-200',"bg-yellow-200")
                restanteDiv.classList.add("bg-blue-200");
                formulario.querySelector("#buttonsub").disabled= false;
                btnAgregar.classList.remove("bg-violet-200");
                btnAgregar.classList.add("bg-violet-300");
            }


        if(restante <= 0 ){
                ui.agregarAlerta("El presupuesto se ha agotado", "error");
                formulario.querySelector("#buttonsub").disabled= true;
                btnAgregar.classList.remove("bg-violet-300")
                btnAgregar.classList.add("bg-violet-200");
        }
        
    }

}


//INSTANCIAR
const ui = new UI();
let presupuesto;
//FUNCIONES

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt("Cual es tu presupuesto?");

    if(presupuestoUsuario==="" || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario<= 0){

        window.location.reload(); // si no pone nada en el promp se recarca la pregunta.
    }
    presupuesto = new Presupuesto(presupuestoUsuario); // guarda el numero que el usuario pone en el prompt.

    ui.insertarPresupuesto(presupuesto);
}


// AGREGAR GASTOS


function agregarGasto(event){
    event.preventDefault();

    // LEER LOS GASTOS DEL FORM
    const nombre = document.querySelector('#gasto').value;

    const cantidad = Number(document.querySelector('#cantidad').value);


// Comprobar que los campos no esten vacios
if(nombre === '' || cantidad === '') {

    ui.agregarAlerta("Los campos no pueden ir vacios", "error");
    return;

    
    
    }else if(cantidad <=0 || isNaN(cantidad)) {

    ui.agregarAlerta("Cantidad no valida", "error");
        return;
    }
    //si pasa esta validacion seguimos con lo de abajo
    //generar un objeto llamado gasto con el nombre y la cantidad.
    const gasto = { nombre,cantidad, id:Date.now() } // esto es igual a const gasto = {nombre:nombre, cantidad:cantidad, id:date.now()}

    // agremaos el nuevo gasto al array de gastos. recordar que nuestro objeto es presupuesto ya que lo instanciamos nuevamente en una variable global.
    
    presupuesto.nuevoGasto(gasto);

    ui.agregarAlerta("Agregado correctamente");

    // IMPRIMIR LOS GASTOS
    const{gastos,restante} = presupuesto; // aqui aplicamos destructuring para sacar los gastos del objeto presupuesto.

    ui.agregarGastoListado(gastos);
    
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto)
    // RESETEAR EL FORM
    formulario.reset();
  
    
}


function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    // ELIMINAR LOS GASTOS DEL HTML
    const {gastos, restante} = presupuesto;
    ui.actualizarRestante(restante);
 
    ui.agregarGastoListado(gastos);

    ui.comprobarPresupuesto(presupuesto);
}




 
