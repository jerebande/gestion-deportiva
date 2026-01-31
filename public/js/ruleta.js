let opciones = [];

function agregarOpcion() {
  const input = document.getElementById('opcionInput');
  const valor = input.value.trim();
  if (valor) {
    opciones.push(valor);
    input.value = '';
    renderizarOpciones();
  }
}

function eliminarOpcion(index) {
  opciones.splice(index, 1);
  renderizarOpciones();
}

function renderizarOpciones() {
  const lista = document.getElementById('listaOpciones');
  lista.innerHTML = '';
  opciones.forEach((opcion, index) => {
    const li = document.createElement('li');
    li.innerHTML = `${opcion} <button onclick="eliminarOpcion(${index})">Eliminar</button>`;
    lista.appendChild(li);
  });
}

function girarRuleta() {
  if (opciones.length === 0) {
    document.getElementById('resultado').innerText = 'Agrega opciones primero.';
    return;
  }

  const indexGanador = Math.floor(Math.random() * opciones.length);
  const ganador = opciones[indexGanador];
  document.getElementById('resultado').innerText = ` ${ganador} 🎉`;
}
