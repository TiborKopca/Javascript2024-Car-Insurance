//CONSTANTS
const AMERICANO = 1.15;
const ASIATICO = 1.05;
const EUROPEO = 1.35;

//CONSTRUCTOR
function Seguro(marca, anio, tipo) {
     this.marca = marca;
     this.anio = anio;
     this.tipo = tipo;
}
//CALCULATE THE INSURANCE AMOUNT
Seguro.prototype.cotizarSeguro = function() {
     const AMERICAN_COVERAGE = 1.15;
     const ASIATIC_COVERAGE = 1.05;
     const EUROPEAN_COVERAGE = 1.35;
     let cantidad;
     const base = 2000;
     //reads the value of the <option> selected in the <select>
     switch(this.marca){
          case '1':
               cantidad = base * AMERICAN_COVERAGE;
               break;
          case '2':
               cantidad = base * ASIATIC_COVERAGE;
               break;
          case '3':
               cantidad = base * EUROPEAN_COVERAGE;
               break;
     }

     //READS THE YEAR
     const diferencia = new Date().getFullYear() - this.anio;
     
     //--------------------------------------------------------------------
     //CALCULATIONS FOR THE INSURANCE AMOUNT
     //--------------------------------------------------------------------

     //REDUCE THE TOTAL PRICE = EACH YEAR -3% FROM THE PRICE
     cantidad -= ((diferencia * 3) * cantidad) / 100;
     //BASIC COVERAGE MULTIPLICATION BY 30%
    if(this.tipo === 'basic') {
         cantidad *= 1.30;
    } else if(this.tipo === 'premium') {
     //PREMIUM COVERAGE MULTIPLICATION BY 50%
         cantidad *= 1.50;
    }else{
     //outside of the coverage
         cantidad = 0;
    }
     return cantidad;
}

//HTML INTERFACE - RENDERING
function Interfaz() {}

//PRINT MESSAGE TO HTML / CORRECT / ERROR
Interfaz.prototype.mostrarMensaje = function(mensaje, tipo) {
     const div = document.createElement('div');
     //class "message" is only to the js, that will remove the message after 3 seconds
     if(tipo === 'error') {
          div.classList.add('mensaje','error');
     } else {
          div.classList.add('mensaje','correcto');
     }
     div.classList.add('mt-10');
     div.innerHTML = `${mensaje}`;

     //INSERT THE MESSAGE TO THE FORM BEFORE THE RESULTS
     formulario.insertBefore(div, document.querySelector('#resultado')); // Nuevo Nodo y referencia... // Si la referencia no existe se añadira al final

     setTimeout( () =>  {
          document.querySelector('.mensaje').remove();
     }, 3000);
} 

// Imprime el resultado de la cotización
Interfaz.prototype.mostrarResultado = function(seguro, total) {
     const resultado = document.querySelector('#resultado');
     let marca;
     switch(seguro.marca) {
          case '1':
               marca = 'American';
               break;
          case '2':
               marca = 'Asian';
               break;
          case '3':
               marca = 'European';
               break;
     }
     // Crear un div
     const div = document.createElement('div');
     div.classList.add('mt-10')
     // Insertar la informacion
     div.innerHTML = `
          <p class='header'>Tu Resumen: </p>
          <p class="font-bold">Marca: <span class="font-normal"> ${marca} </span> </p>
          <p class="font-bold">Año: <span class="font-normal"> ${seguro.anio} </span> </p>
          <p class="font-bold">Tipo: <span class="font-normal"> ${seguro.tipo} </span> </p>
          <p class="font-bold"> Total: <span class="font-normal"> $ ${total} </span> </p>
     `;

     const spinner = document.querySelector('#cargando');
     spinner.style.display = 'block';
     setTimeout( () =>  {
          spinner.style.display = 'none';
          resultado.appendChild(div);
     }, 3000);
     
}

//GENERATE <option> with YEARS TO THE SELECT DYNAMICALLY
Interfaz.prototype.llenarOpciones = function () {
     const __MAX_YEAR = 20; //20 years maximum of car age
     const max = new Date().getFullYear(),
          min = max - __MAX_YEAR;

     const selectAnios = document.querySelector('#year');
     for(let i = max; i > min; i--) {
          let option = document.createElement('option');
          option.value = i;
          option.innerHTML = i;
          selectAnios.appendChild(option);
     }   
}

//INSTANCE OF INTERFACE & DOM OPERATIONS
const interfaz = new Interfaz();
document.addEventListener('DOMContentLoaded', () => {
     interfaz.llenarOpciones()
});

// DOM Operaciones
const formulario = document.querySelector('#cotizar-seguro');

formulario.addEventListener('submit', e =>  {
     e.preventDefault();

     //READS THE USER SELECTION - BRAND OF THE CAR
     const marca = document.querySelector('#marca').value;

     //READS THE USER SELECTION OF THE YEAR
     const year = document.querySelector('#year').value

     //READS THE RADIO BUTTON SELECTION - INSURENCE TYPE
     const tipo = document.querySelector('input[name="tipo"]:checked').value;

     //FORM VALIDATION
     if(marca === '' || year === '' || tipo === '') {
          //ON ERROR => PRINT MESSAGE
          //Parameter1 = Message, parameter2 = type of message (error / success)
          interfaz.mostrarMensaje('Data missing, check the form and try again', 'error');
     } else {
          //CLEAR PREVIOUS RESULTS
          const resultados = document.querySelector('#resultado div');
          if(resultados != null) {
               resultados.remove();
          }

          //CREATE NEW INSTANCE OF THE OBJECT INSURANCE
          const seguro = new Seguro(marca, year, tipo);
          //CALL THE METHOD TO CALCULATE THE INSURANCE AMOUNT
          const cantidad = seguro.cotizarSeguro();
          //PRINT THE RESULTS TO THE HTML
          interfaz.mostrarResultado(seguro, cantidad);
          //PRINT A SUCCESS MESSAGE
          interfaz.mostrarMensaje('Obtaining Insurance...', 'Success');
     }

});

