// Variáveis globais
let tarefas = [];
let filtroAtual = 'all';

// Elementos DOM
const tarefaForm = document.getElementById('tarefaForm');
const tarefaTitulo = document.getElementById('tarefaTitulo');
const tarefaDescricao = document.getElementById('tarefaDescricao');
const tarefasContainer = document.getElementById('tarefasContainer');
const emptyState = document.getElementById('emptyState');
const themeToggle = document.getElementById('themeToggle');
const botoesFiltro = document.querySelectorAll('.filter-btn');

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    buscarTarefas();
    configurarEventos();
    verificarPreferenciaTema();
});

// Configurar event listeners
function configurarEventos() {
    tarefaForm.addEventListener('submit', adicionarTarefa);
    themeToggle.addEventListener('click', alternarTema);

    botoesFiltro.forEach(button => {
        button.addEventListener('click', () => {
            botoesFiltro.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            filtroAtual = button.getAttribute('data-filter');
            renderizarTarefas();
        });
    });
}

// Buscar tarefas do backend
async function buscarTarefas() {
    try {
        const res = await fetch("http://localhost:3000/api/tarefas");
        tarefas = await res.json();
        renderizarTarefas();
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
        mostrarErro("Não foi possível carregar as tarefas. Verifique se o servidor está rodando.");
    }
}

// Adicionar nova tarefa
async function adicionarTarefa(e) {
    e.preventDefault();

    const titulo = tarefaTitulo.value.trim();
    const descricao = tarefaDescricao.value.trim();

    if (!titulo) {
        alert('Por favor, insira um título para a tarefa.');
        return;
    }

    const novaTarefa = { titulo, descricao };

    try {
        const res = await fetch("http://localhost:3000/api/tarefas", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novaTarefa)
        });

        const tarefa = await res.json();
        tarefas.unshift(tarefa);
        renderizarTarefas();

        tarefaForm.reset();
        tarefaTitulo.focus();
    } catch (error) {
        console.error("Erro ao adicionar tarefa:", error);
        alert("Não foi possível adicionar a tarefa. Tente novamente.");
    }
}

// Alternar conclusão da tarefa
async function alternarConclusaoTarefa(id) {
    const tarefa = tarefas.find(t => t._id === id);

    try {
        const res = await fetch(`http://localhost:3000/api/tarefas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ concluida: !tarefa.concluida })
        });

        const atualizada = await res.json();
        tarefas = tarefas.map(t => (t._id === atualizada._id ? atualizada : t));
        renderizarTarefas();
    } catch (error) {
        console.error("Erro ao atualizar tarefa:", error);
        alert("Não foi possível atualizar a tarefa. Tente novamente.");
    }
}

// Remover tarefa
async function removerTarefa(id) {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return;

    try {
        await fetch(`http://localhost:3000/api/tarefas/${id}`, { method: "DELETE" });
        tarefas = tarefas.filter(t => t._id !== id);
        renderizarTarefas();
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error);
        alert("Não foi possível excluir a tarefa. Tente novamente.");
    }
}

// Renderizar tarefas na interface
function renderizarTarefas() {
    let tarefasFiltradas = tarefas;

    if (filtroAtual === 'pending') {
        tarefasFiltradas = tarefas.filter(t => !t.concluida);
    } else if (filtroAtual === 'completed') {
        tarefasFiltradas = tarefas.filter(t => t.concluida);
    }

    if (tarefasFiltradas.length === 0) {
        emptyState.style.display = 'block';
        tarefasContainer.innerHTML = '';
        tarefasContainer.appendChild(emptyState);
        return;
    } else {
        emptyState.style.display = 'none';
    }

    tarefasContainer.innerHTML = '';

    tarefasFiltradas.forEach(tarefa => {
        const tarefaElement = document.createElement('div');
        tarefaElement.className = `tarefa-card ${tarefa.concluida ? 'tarefa-concluida' : ''}`;

        const dataFormatada = new Date(tarefa.createdAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        tarefaElement.innerHTML = `
            <div class="tarefa-header" onclick="alternarConclusaoTarefa('${tarefa._id}')">
                <span class="tarefa-status">
                    ${tarefa.concluida 
                        ? '<i class="fas fa-check-circle" style="color: var(--success);"></i>' 
                        : '<i class="far fa-circle"></i>'}
                </span>
                <h3 class="tarefa-titulo">${tarefa.titulo}</h3>
            </div>
            
            <div class="tarefa-body">
                ${tarefa.descricao 
                    ? `<p class="tarefa-descricao">${tarefa.descricao}</p>` 
                    : '<p class="tarefa-descricao vazio">Sem descrição</p>'}
            </div>

            <div class="tarefa-footer">
                <span class="tarefa-data">📅 Criada em: ${dataFormatada}</span>
                <div class="tarefa-acoes">
                    <button class="action-btn ${tarefa.concluida ? 'btn-success' : ''}" onclick="alternarConclusaoTarefa('${tarefa._id}')">
                        ${tarefa.concluida ? '<i class="fas fa-undo"></i> Reabrir' : '<i class="fas fa-check"></i> Concluir'}
                    </button>
                    <button class="action-btn btn-danger" onclick="removerTarefa('${tarefa._id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `;

        tarefasContainer.appendChild(tarefaElement);
    });
}

// Alternar entre tema claro e escuro
function alternarTema() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
}

// Verificar preferência de tema salva
function verificarPreferenciaTema() {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    if (savedDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
}

// Mostrar mensagem de erro
function mostrarErro(mensagem) {
    const erroElement = document.createElement('div');
    erroElement.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: var(--danger);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1000;
        max-width: 300px;
    `;
    erroElement.textContent = mensagem;
    document.body.appendChild(erroElement);
    
    setTimeout(() => {
        document.body.removeChild(erroElement);
    }, 5000);
}