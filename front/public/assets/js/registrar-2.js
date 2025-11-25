// Exibe campo de área específico para professor e auxiliar docente no carregamento
document.addEventListener('DOMContentLoaded', function() {
  const nivel = document.getElementById('nivel');
  const areaProfessorDiv = document.getElementById('areaProfessorDiv');
  const areaProfessorSelect = document.getElementById('areaProfessor');
  const areaAuxiliarDiv = document.getElementById('areaAuxiliarDiv');
  const areaAuxiliarSelect = document.getElementById('areaAuxiliar');
  const areaTodosDiv = document.getElementById('areaTodosDiv');
  const areaTodosSelect = document.getElementById('areaTodos');
  
  // Inicializa o estado
  if (nivel.value === 'professor') {
    areaProfessorDiv.style.display = 'block';
    areaProfessorSelect.disabled = false;
    areaAuxiliarDiv.style.display = 'none';
    areaAuxiliarSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  } else if (nivel.value === 'auxiliar_docente') {
    areaAuxiliarDiv.style.display = 'block';
    areaAuxiliarSelect.disabled = false;
    areaProfessorDiv.style.display = 'none';
    areaProfessorSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  } else {
    areaProfessorDiv.style.display = 'none';
    areaProfessorSelect.disabled = true;
    areaAuxiliarDiv.style.display = 'none';
    areaAuxiliarSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  }
  
  // Listener para mudanças
  nivel.addEventListener('change', function() {
    if (this.value === 'professor') {
      areaProfessorDiv.style.display = 'block';
      areaProfessorSelect.disabled = false;
      areaAuxiliarDiv.style.display = 'none';
      areaAuxiliarSelect.disabled = true;
      areaTodosDiv.style.display = 'none';
      areaTodosSelect.disabled = true;
    } else if (this.value === 'auxiliar_docente') {
      areaAuxiliarDiv.style.display = 'block';
      areaAuxiliarSelect.disabled = false;
      areaProfessorDiv.style.display = 'none';
      areaProfessorSelect.disabled = true;
      areaTodosDiv.style.display = 'none';
      areaTodosSelect.disabled = true;
    } else {
      areaProfessorDiv.style.display = 'none';
      areaProfessorSelect.disabled = true;
      areaAuxiliarDiv.style.display = 'none';
      areaAuxiliarSelect.disabled = true;
      areaTodosDiv.style.display = 'none';
      areaTodosSelect.disabled = true;
    }
  });
});

document.getElementById('formRegistro').addEventListener('submit', async function(e) {
  e.preventDefault();
  const cpf = document.getElementById('cpf').value;
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;
  const nivel = document.getElementById('nivel').value;
  const nivelSelect = document.getElementById('nivel');
  const selectedOption = nivelSelect.options[nivelSelect.selectedIndex];
  let area = null;
  
  if (nivel === 'professor') {
    area = document.getElementById('areaProfessor').value;
  } else if (nivel === 'auxiliar_docente') {
    area = document.getElementById('areaAuxiliar').value;
  } else if (nivel === 'todos') {
    // Para Coordenação e Direção, usa um valor padrão que o backend reconhece
    area = 'Coordenação'; // Pode ser qualquer área, será ignorada pelo backend para "todos"
  }
  
  const msg = document.getElementById('msg');
  msg.textContent = '';

  // Validar se professor ou auxiliar docente selecionou uma área
  if ((nivel === 'professor' || nivel === 'auxiliar_docente') && !area) {
    msg.textContent = 'Por favor, selecione uma área de atuação.';
    msg.classList.remove('text-muted');
    msg.classList.add('text-danger');
    return;
  }

  console.log('Registrando:', { CPF: cpf, Email: email, Nivel: nivel, Area: area });

  try {
    const resp = await fetch('http://localhost:3000/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ CPF: cpf, Email: email, Senha: senha, Nivel: nivel, Area: area })
    });
    if (resp.ok) {
      msg.textContent = 'Registrado com sucesso! Redirecionando...';
      msg.classList.remove('text-muted');
      msg.classList.add('text-success');
      setTimeout(() => {
        window.location.href = '/page/usuario/login.html';
      }, 1200);
    } else {
      const data = await resp.json();
      msg.textContent = data.erro || 'Erro ao registrar.';
      msg.classList.remove('text-muted');
      msg.classList.add('text-danger');
    }
  } catch (err) {
    msg.textContent = 'Erro de conexão.';
    msg.classList.remove('text-muted');
    msg.classList.add('text-danger');
  }
});

// Exibe campo de área específico para professor e auxiliar docente
document.getElementById('nivel').addEventListener('change', function() {
  const areaProfessorDiv = document.getElementById('areaProfessorDiv');
  const areaProfessorSelect = document.getElementById('areaProfessor');
  const areaAuxiliarDiv = document.getElementById('areaAuxiliarDiv');
  const areaAuxiliarSelect = document.getElementById('areaAuxiliar');
  const areaTodosDiv = document.getElementById('areaTodosDiv');
  const areaTodosSelect = document.getElementById('areaTodos');
  
  if (this.value === 'professor') {
    areaProfessorDiv.style.display = 'block';
    areaProfessorSelect.disabled = false;
    areaAuxiliarDiv.style.display = 'none';
    areaAuxiliarSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  } else if (this.value === 'auxiliar_docente') {
    areaAuxiliarDiv.style.display = 'block';
    areaAuxiliarSelect.disabled = false;
    areaProfessorDiv.style.display = 'none';
    areaProfessorSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  } else {
    areaProfessorDiv.style.display = 'none';
    areaProfessorSelect.disabled = true;
    areaAuxiliarDiv.style.display = 'none';
    areaAuxiliarSelect.disabled = true;
    areaTodosDiv.style.display = 'none';
    areaTodosSelect.disabled = true;
  }
});
