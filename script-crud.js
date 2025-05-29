//CRUD - Create, read, update, delete

const btnAdicionarTarefa = document.querySelector('.app__button--add-task');
const formAdicionarTarefa = document.querySelector('.app__form-add-task');
const textarea = document.querySelector('.app__form-textarea'); //Campo de texto do formulário
const ulTarefas = document.querySelector('.app__section-task-list');
const paragrafoDescricaoTarefa = document.querySelector('.app__section-active-task-description');

const btnRemoverConcluidas = document.querySelector('#btn-remover-concluidas');
const btnRemoverTodas = document.querySelector('#btn-remover-todas');

let tarefas = JSON.parse(localStorage.getItem('tarefas')) || [];
let tarefaSelecionada = null;
let liTarefaSelecionada = null;

//Guarda o objeto que se chama tarefas no array tarefas no Armazenamento local
function atualizarTarefas () {
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function criarElementoTarefa(tarefa) {
    const li = document.createElement('li'); //Cria elemento li
    li.classList.add('app__section-task-list-item'); //Adiciona classe ao elemento li
    
    const svg = document.createElement('svg'); //Cria o elemento svg e inclui ele com innerHTML
    svg.innerHTML = `
        <svg class="app__section-task-icon-status" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="12" fill="#FFF"></circle>
            <path d="M9 16.1719L19.5938 5.57812L21 6.98438L9 18.9844L3.42188 13.4062L4.82812 12L9 16.1719Z" fill="#01080E"></path>
        </svg>
    `
    const paragrafo = document.createElement('p'); //Cria elemento p
    paragrafo.textContent = tarefa.descricao; //Conteúdo do elemento p
    paragrafo.classList.add('app__section-task-list-item-description');
    
    const botao = document.createElement('button'); //Cria elemento button para editar
    botao.classList.add('app_button-edit');

    //Botão de editar a tarefa
    botao.onclick = () => {
        //debugger //Mostra a etapa da leitura do código para ajudar a identificar onde está o problema
        const novaDescricao = prompt("Qual é o novo nome da tarefa?"); //Alert com caixa de texto
        //console.log('Nova descriçãoda tarefa: ', novaDescricao);
        if (novaDescricao) {
            paragrafo.textContent = novaDescricao; //Sobrescrevre o que foi escrito no outro parágrafo
            tarefa.descricao = novaDescricao;
            atualizarTarefas();
        }        
    }

    const imagemBotao = document.createElement('img'); //Cria elemento img
    imagemBotao.setAttribute('src', '/imagens/edit.png'); //Aplica o atributo src e o caminho da imagem

    botao.append(imagemBotao);

    li.append(svg);
    li.append(paragrafo);
    li.append(botao);

    if (tarefa.completa) {
        li.classList.add('app__section-task-list-item-complete');
        botao.setAttribute('disabled', 'disabled');
    } else {
        li.onclick = () => {
    
            document.querySelectorAll('.app__section-task-list-item-active')
                .forEach(elemento => {
                    elemento.classList.remove('app__section-task-list-item-active');
                })
            
            //Se clicar na tarefa selecionada, remove a seleção e não faz mais nada
            if (tarefaSelecionada == tarefa) {
                paragrafoDescricaoTarefa.textContent = '';
                tarefaSelecionada = null;
                liTarefaSelecionada = null;
                return
            }
    
            tarefaSelecionada = tarefa;
            liTarefaSelecionada = li;
            paragrafoDescricaoTarefa.textContent = tarefa.descricao;
            
            li.classList.add('app__section-task-list-item-active'); //Tarefa selecionada
        }
    }

    return li
}

btnAdicionarTarefa.addEventListener('click', () => {
    formAdicionarTarefa.classList.toggle('hidden'); //Habilita/Desabilita a classe .hidden
});

formAdicionarTarefa.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const tarefa = {
        //tarefa é um objeto que recebe o valor de textarea (input de texto do form).value
        descricao: textarea.value //Objeto que representa uma tarefa
    }
    tarefas.push(tarefa); // Empurra a tarefa criada para dentro do array tarefas
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
    atualizarTarefas(); 
    //Cria a tarefa > Empurra a tarefa para o array > Armazena no localStorage
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
});

//Para cada tarefa, criar elemento li tarefa e vincular à lista ul
tarefas.forEach(tarefa => {
    const elementoTarefa = criarElementoTarefa(tarefa);
    ulTarefas.append(elementoTarefa);
})

const btnCancelar = document.querySelector('.app__form-footer__button--cancel');

//Botão de cancelar o texto no input textarea
const limparFormulario = () => {
    textarea.value = '';
    formAdicionarTarefa.classList.add('hidden');
}

btnCancelar.addEventListener('click', limparFormulario);

document.addEventListener('FocoFinalizado', () => {
    if(tarefaSelecionada && liTarefaSelecionada) {
        liTarefaSelecionada.classList.remove('app__section-task-list-item-active');
        liTarefaSelecionada.classList.add('app__section-task-list-item-complete');
        liTarefaSelecionada.querySelector('button').setAttribute('disabled', 'disabled');
        //Tira a classe ativa, adiciona a classe completa e desabilita o botão
        tarefaSelecionada.completa = true;
        atualizarTarefas();
    }
});

//Remove tarefas concluídas e atualiza a localStorage
const removerTarefas = (somenteCompletas) => {
    //If ternário
    //Tem tarefas completas? Seleciona as que tem a classe com complete e remove elas (true)
    const seletor = somenteCompletas ? ".app__section-task-list-item-complete" : ".app__section-task-list-item";
    document.querySelectorAll(seletor).forEach(elemento => {
        elemento.remove();
    })
    //Tem tarefas completas? Filtrar e remover somente as completas (false) e criar um array vazio
    tarefas = somenteCompletas ? tarefas.filter(tarefa => !tarefa.completa) : [];
    atualizarTarefas();
}


btnRemoverConcluidas.onclick = () => removerTarefas(true); //Remove as tarefas concluídas
btnRemoverTodas.onclick = () => removerTarefas(false); //Remove todas as tarefas

//Mão na massa: fechando o formulário ao cancelar
//No código da resolução do desafio a constante formularioTarefa está com o nome diferente do desenvolvido em aula (formAdicionarTarefa);