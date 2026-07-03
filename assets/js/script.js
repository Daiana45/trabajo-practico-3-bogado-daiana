let listadepersonaje = [];

// Obtener listado general
async function obtenerpersonaje() {
    try {
        const respuesta = await fetch('https://thesimpsonsapi.com/api/characters');
        const datos = await respuesta.json();
        listadepersonaje = datos.results; // ✅ personajes están en results
        console.log(listadepersonaje); // para verificar en consola
        renderizartarjetas(listadepersonaje);
    } catch (error) {
        console.log("Error al obtener personajes", error);
    }
}

// Renderizar tarjetas
function renderizartarjetas(personajes) {
    const contenedor = document.getElementById('lista-personaje');
    contenedor.innerHTML = '';
    personajes.forEach(personaje => {
        const urlimagen = `https://cdn.thesimpsonsapi.com/500${personaje.portrait_path}`;
        const tarjeta = `
            <div class="col-md-3 mb-3">
                <div class="card">
                    <img src="${urlimagen}" class="card-img-top" alt="${personaje.name}">
                    <div class="card-body">
                        <h5 class="card-title">${personaje.name}</h5>
                        <p class="card-text">Ocupación: ${personaje.occupation}</p>
                        <p class="card-text">Estado: ${personaje.status}</p>
                        <button class="btn btn-primary" data-id="${personaje.id}">Ver detalle</button>
                    </div>
                </div>
            </div>
        `;
        contenedor.innerHTML += tarjeta;
    });
}

// Buscador
const formulario = document.querySelector('form');
const input = formulario.querySelector('input');

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = input.value.trim().toLowerCase();
    if (texto === '') {
        alert('El campo está vacío');
        return;
    }
    const filtrados = listadepersonaje.filter(p =>
        p.name.toLowerCase().includes(texto)
    );
    if (filtrados.length === 0) {
        document.getElementById('lista-personaje').innerHTML = '<p>No se encontraron resultados</p>';
    } else {
        renderizartarjetas(filtrados);
    }
});

// Modal detalle
const lista = document.getElementById('lista-personaje');
lista.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const id = e.target.getAttribute('data-id');
        obtenerDetalle(id);
    }
});

async function obtenerDetalle(id) {
    try {
        const respuesta = await fetch(`https://thesimpsonsapi.com/api/characters/${id}`);
        const datos = await respuesta.json();
        mostrarModal(datos);
    } catch (error) {
        console.log("Error al obtener detalle", error);
    }
}

function mostrarModal(personaje) {
    document.getElementById('modalImagen').src = `https://cdn.thesimpsonsapi.com/500${personaje.portrait_path}`;
    document.getElementById('modalNombre').textContent = personaje.name;
    document.getElementById('modalOcupacion').textContent = personaje.occupation;
    document.getElementById('modalEstado').textContent = personaje.status;
    document.getElementById('modalFrase').textContent = personaje.phrases?.[0] || "Sin frases";
    document.getElementById('modalEdad').textContent = personaje.age || "Edad desconocida";
    document.getElementById('modalNacimiento').textContent = personaje.dateOfBirth || "Fecha no disponible";
    const modal = new bootstrap.Modal(document.getElementById('modalDetalle'));
    modal.show();
}


// Inicializar
obtenerpersonaje();
