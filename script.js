// ==========================================
// 1. SELECCIÓN DE ELEMENTOS DEL DOM
// ==========================================

// Entradas de datos
const input = document.getElementById("inputTarea");
const selectPrioridad = document.getElementById("selectPrioridad");

// Contenedores y Visualización
const lista = document.getElementById("listaTareas");
const contador = document.getElementById("contador");
const fechaDisplay = document.getElementById("fechaHoy");

// Botones Principales
const btnAgregar = document.getElementById("btnAgregar");
const btnBorrarTodo = document.getElementById("btnBorrarTodo");

// Botones de Filtros
const btnFiltroTodas = document.getElementById("btnTodas");
const btnFiltroPendientes = document.getElementById("btnPendientes");
const btnFiltroCompletadas = document.getElementById("btnCompletadas");

// Botones de Estado de Ánimo
const moodButtons = document.querySelectorAll(".mood-btn");

//Notas
const areaNotas = document.getElementById("notas");
const btnNotas = document.getElementById("btnGuardarNotas")

// ==========================================
// 2. VARIABLES GLOBALES (ESTADO)
// ==========================================

let filtroActual = "todas"; // Estado inicial del filtro
let tareas = JSON.parse(localStorage.getItem("misTareas")) || [];
let notasGuardadas = localStorage.getItem("misNotas") || "";
let animoGuardado = localStorage.getItem("miAnimo") || "";


// ==========================================
// 3. FUNCIONES AUXILIARES
// ==========================================

// Guardar en el navegador
const guardarLocal = () => {
    localStorage.setItem("misTareas", JSON.stringify(tareas));
};

// Mostrar la fecha actual
const mostrarFecha = () => {
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fechaActual = new Date().toLocaleDateString('es-AR', opciones);
    fechaDisplay.innerText = fechaActual;
};
mostrarFecha();


// ==========================================
// 4. LÓGICA PRINCIPAL (RENDERIZAR)
// ==========================================

const renderizarTareas = () => {
    lista.innerHTML = ""; // Limpiamos la lista antes de pintar
    let tareasFiltradas = [];

    // --- Aplicamos Filtros ---
    if (filtroActual === "todas") {
        tareasFiltradas = tareas;
    } else if (filtroActual === "pendientes") {
        tareasFiltradas = tareas.filter(t => !t.completadas);
    } else if (filtroActual === "completadas") {
        tareasFiltradas = tareas.filter(t => t.completadas);
    }

    // --- Actualizamos Contador ---
    contador.innerText = "viendo " + tareasFiltradas.length + " tareas";

    // --- Pintamos cada tarea ---
    tareasFiltradas.forEach((tarea) => {
        const li = document.createElement("li");

        // 1. Asignamos color de prioridad
        li.classList.add(`prioridad-${tarea.prioridad}`);

        // 2. Si está completa, le ponemos el estilo tachado
        if (tarea.completadas) {
            li.classList.add("terminada");
        }

        // 3. HTML interno de la tarea
        li.innerHTML = `
            <p> ${tarea.nombre} </p>
            <button class="btn-borrar">🗑️</button>
        `;

        // 4. EVENTO: Borrar tarea individual
        li.querySelector(".btn-borrar").addEventListener("click", (e) => {
            e.stopPropagation(); // Evita que al borrar se active el click de tachar
            tareas = tareas.filter(t => t !== tarea);
            guardarLocal();
            renderizarTareas();
        });

        // 5. EVENTO: Tachar tarea (Click en el texto)
        li.querySelector("p").addEventListener("click", () => {
            tarea.completadas = !tarea.completadas; // Invertir valor
            guardarLocal();
            renderizarTareas();
        });

        // Agregamos a la lista
        lista.appendChild(li);
    });
};


// ==========================================
// 5. FUNCIÓN AGREGAR TAREA
// ==========================================

const agregarTarea = () => {
    const textoTarea = input.value;
    const prioridadTarea = selectPrioridad.value;

    if (textoTarea === "") {
        alert("Por favor ingrese una tarea");
        return;
    }

    const nuevaTarea = {
        nombre: textoTarea,
        prioridad: prioridadTarea,
        completadas: false, // Siempre nacen pendientes
    };

    tareas.push(nuevaTarea);
    input.value = ""; // Limpiar input
    
    guardarLocal();
    renderizarTareas();
};


// ==========================================
// 6. EVENTOS (LISTENERS)
// ==========================================

// Botón Agregar
btnAgregar.addEventListener("click", agregarTarea);

// Botón Borrar Todo
btnBorrarTodo.addEventListener("click", () => {
    if (confirm("¿Estás seguro que quieres borrar todo?")) {
        tareas = [];
        guardarLocal();
        renderizarTareas();
    }
});

// Filtros
btnFiltroTodas.addEventListener("click", () => {
    filtroActual = "todas";
    renderizarTareas();
});

btnFiltroPendientes.addEventListener("click", () => {
    filtroActual = "pendientes";
    renderizarTareas();
});

btnFiltroCompletadas.addEventListener("click", () => {
    filtroActual = "completadas";
    renderizarTareas();
});

// Notas (Guardado automático)
areaNotas.value = notasGuardadas;
areaNotas.addEventListener("input", () => {
    localStorage.setItem("misNotas", areaNotas.value);
});

// ==========================================
// 7. MOOD TRACKER (CARITAS)
// ==========================================

moodButtons.forEach(boton => {
    boton.addEventListener("click", () => {

        moodButtons.forEach(b => {
            b.classList.remove("selected")
        });

        boton.classList.add("selected");

        const estadoAnimo = boton.dataset.mood;
        localStorage.setItem("miAnimo", estadoAnimo);

    });

});

// ==========================================
// 8. NOTAS (LOCALSTORAGE)
// ==========================================

//  EVENTO CLICK: Guardar usando el botón
btnNotas.addEventListener("click", () => {
    // Capturamos lo que escribió el usuario
    const mensaje = areaNotas.value;
    // Guardamos el texto en la memoria del navegador (LocalStorage)
    // La clave es "misNotas" y el valor es el texto capturado
    localStorage.setItem("misNotas", mensaje);

    alert(" ¡Nota Guardada! ")
});

areaNotas.addEventListener("keydown", (e) => {

    if(e.key === "Enter" && e.ctrlKey) {

        const mensaje = areaNotas.value;
        
        localStorage.setItem("misNotas", mensaje);

    alert(" ¡Nota Guardada! ")
    }
});