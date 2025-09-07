# 📋 Gerenciador de Tarefas (Frontend)

Este é o **frontend** de um Gerenciador de Tarefas moderno e responsivo, desenvolvido em **HTML, CSS e JavaScript**.  
O sistema permite adicionar, visualizar, filtrar, concluir e excluir tarefas de forma simples e intuitiva.  

---

## 🚀 Funcionalidades

- ➕ **Adicionar tarefas** com título e descrição.  
- ✅ **Marcar tarefas como concluídas** ou reabri-las.  
- 🗑️ **Excluir tarefas** permanentemente.  
- 🔎 **Filtros de visualização**:  
  - Todas  
  - Pendentes  
  - Concluídas  
- 🎨 **Tema claro e escuro** com persistência no `localStorage`.  
- 📱 **Interface responsiva** para diferentes tamanhos de tela.  
- ⚡ Integração com backend (`http://localhost:3000/api/tarefas`).  

---

## 📂 Estrutura do Projeto

```
frontend/
│── index.html       # Estrutura principal da aplicação
│── styles.css       # Estilos e temas (claro/escuro + responsividade)
│── script.js        # Lógica de interação e integração com backend
```

---

## 🔧 Pré-requisitos

- Navegador moderno (Chrome, Firefox, Edge, etc.)
- Backend rodando em `http://localhost:3000/api/tarefas`  
  (Node.js + Express + MongoDB, conforme projeto backend)

---

## ▶️ Como usar

1. Clone este repositório ou copie os arquivos para uma pasta local.
2. Certifique-se de que o **backend** está em execução.  
   Exemplo:  
   ```bash
   npm start
   ```
3. Abra o arquivo `index.html` no navegador.  
4. Comece a gerenciar suas tarefas! 🎉

---

## 🖼️ Demonstração da Interface

- **Tela inicial sem tarefas:**  
  Mostra estado vazio com sugestão de adicionar nova tarefa.  
- **Lista de tarefas:**  
  Cada tarefa aparece em um card com título, descrição, data e ações.  
- **Tema escuro:**  
  Ative o modo escuro pelo botão no cabeçalho.  

---

## 👨‍💻 Autor

Desenvolvido por José Fernando de Lima Amorim
