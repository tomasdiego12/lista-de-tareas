
//1. SELECCION DE ELEMENTOS DEL DOM
const input = document.getElementById("inputTarea");
const btn = document.getElementById("btnAgregar");
const  lista = document.getElementById("listaTareas");
const contador = document.getElementById("contador");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");
//2. EL ESTADO DONDE VIVEN LOS DATOS
//intentamos leer del localstorage si no hay nada empezamos una lista vacia
let tareas = JSON.parse(localStorage.getItem("misTareas")) || [];
//3. FUNCION PARA GUARDAR EN EL LOCALSTORAGE
const guardarLocal = () => {
  localStorage.setItem("misTareas", JSON.stringify(tareas));
};

//4. FUNCION PARA DIBUJAR LA LISTA (RENDER)
//lo que hace esto es que borra el html viejo y lo crea de nuevo en la lista "tareas"
const renderizarTareas = () => {
  //limpiamos el html viejo
  lista.innerHTML = "";

  //DESAFIO: CONTADOR
contador.innerText = "Tareas totales: " + tareas.length;

  //por cada tarea en el array creamos un LI nuevo
  tareas.forEach((tarea) => {
    // creamos una li
    const nuevaLi = document.createElement("li");

    const texto = document.createElement("span");
    texto.innerText = tarea.texto;

    //si la tarea estaba completada le agregamos la clase
    if (tarea.completada) {
      texto.classList.add("completada");
    }
    //EVENTO : tachar tarea
    texto.addEventListener("click", () => {
      // Cambiamos el estado del dato
      tarea .completada = !tarea.completada;
      // guardamos en el localStorage
      guardarLocal();
      //volvemos a renderizar la lista
      renderizarTareas();

    });
  // BOTON BORRAR
    const btnBorrar = document.createElement("button");
    btnBorrar.innerText = "Borrar";
    btnBorrar.style.marginLeft = "10px";
    btnBorrar.style.backgroundColor = "red";
    // EVENTO BORRAR TAREA 
    btnBorrar.addEventListener("click", () => {
      // Filtramos la lista: Dejamos todas MENOS la que queremos borrar
      tareas = tareas.filter(t => t !== tarea);
      guardarLocal();
      renderizarTareas();
    });
  // JUNTAR TODO (appendChils es como enganchar o insertar dentro)
    nuevaLi.appendChild(texto);
    nuevaLi.appendChild(btnBorrar);
    lista.appendChild(nuevaLi);
  });

};
//5. FUNCION PARA AGREGAR TAREA (Solo modifica datos)
const agregarTarea = () => {
  const textoTarea = input.value;

  if (textoTarea === "") {
    alert("por favor ingresa una tarea");
    return;
    }
  //Creamos un objeto con el texto y el estado
  const nuevaTarea = {
    texto: textoTarea,
    completada: false
  };

  // La metemos en la lista de datos
  tareas.push(nuevaTarea);
  // Guardamos en el localStorage
  guardarLocal();
  // Renderizamos la lista de nuevo
  renderizarTareas();
  // Limpiamos el input
  input.value = "";
};
//6. EVENTO BOTON
btn.addEventListener("click", agregarTarea);

// DESAFIO: AGREGAR TAREA CON ENTER 
input.addEventListener( "keydown", (event) => {
  if (event.key === "Enter") {
    agregarTarea();
  }
});

//DESAFIO: BORRAR TODO 
btnBorrarTodo.addEventListener("click", () => {
  //vaciar array
  tareas = [];
  guardarLocal();
  renderizarTareas();
});

//7. RENDERIZAR LA LISTA AL CARGAR LA PAGINA
renderizarTareas();