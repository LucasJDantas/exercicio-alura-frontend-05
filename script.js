const html = document.querySelector('html'); //Constante que seleciona a tag html
const focoBt = document.querySelector('.app__card-button--foco'); //Constante que seleciona a classe do botão Foco
const curtoBt = document.querySelector('.app__card-button--curto'); //Constante que seleciona a classe do botão Descanso curto
const longoBt = document.querySelector('.app__card-button--longo'); //Constante que seleciona a classe do botão Descanso longo
const iniciarOuPausarBt = document.querySelector('#start-pause span'); //Constante que seleciona o id do botão Começar

const banner = document.querySelector('.app__image'); //Constante que seleciona a classe da imagem

const imagemPlayPause = document.querySelector('#start-pause img');

const titulo = document.querySelector('.app__title'); //Constante que seleciona a classe do h1

const botoes = document.querySelectorAll('.app__card-button'); //Constante que seleciona todos os botões

const tempoNaTela = document.querySelector('#timer'); //Constante que seleciona o timer

const musicaFocoInput = document.querySelector('#alternar-musica');
const musica = new Audio('./sons/luna-rise-part-one.mp3'); //Cria o elemento áudio no JS
const somPlay = new Audio('./sons/play.wav');
const somPause = new Audio('./sons/pause.mp3');
const somBeep = new Audio('./sons/beep.mp3');

musica.loop = true; //A música vai se repetir enquanto o input estiver marcado

let tempoDecorridoEmSegundos = 1500; //Variável do tempo de cada modo 
let intervaloId = null;

const startPauseBt = document.querySelector('#start-pause'); //Variável do botão Começar

musicaFocoInput.addEventListener('change', () => { //Change é para a ação do input de ligar/desligar
    if(musica.paused) {
        musica.play()
    } else {
        musica.pause()
    }
})

focoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 1500;
    alterarContexto('foco');
    focoBt.classList.add('active'); //Adiciona a classe active ao elemento quando clicado
})

curtoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 300;
    alterarContexto('descanso-curto');
    curtoBt.classList.add('active');
})

longoBt.addEventListener('click', () => {
    tempoDecorridoEmSegundos = 900;
    alterarContexto('descanso-longo');
    longoBt.classList.add('active');
})

//Função que altera cor do fundo, imagem, texto e estado dos botões
function alterarContexto(contexto) {
    mostrarTempo();
    botoes.forEach(function (contexto) {
        contexto.classList.remove('active'); //Remove a classe active de todos os elementos, mantendo só a do botão selecionado
    })
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `./imagens/${contexto}.png`);
    switch (contexto) {
        case "foco":
            titulo.innerHTML = `
            Otimize sua produtividade,<br>
            <strong class="app__title-strong">mergulhe no que importa.</strong>
            `
        break;
        case "descanso-curto":
            titulo.innerHTML = `
            Que tal dar uma respirada?<br>
            <strong class="app__title-strong">Faça uma pausa curta!</strong>
            `
        break;
        case "descanso-longo":
            titulo.innerHTML = `
            Hora de voltar à superfície<br>
            <strong class="app__title-strong">Faça uma pausa longa.</strong>
        `
        break;
        default:
        break;
    }
}

const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) { //Se o tempo decorrido for menor ou igual à zero
        somBeep.play(); //Dar play na constante somBeep
        alert('Tempo finalizado') //Exibir alert
        const focoAtivo = html.getAttribute('data-contexto') == 'foco'; //Confere se o atributo selecionado é o foco
        if (focoAtivo) {
            const evento = new CustomEvent('FocoFinalizado'); //Criou novo evento
            document.dispatchEvent(evento); //Disparou/Broadcast do evento criado
        }
        zerar(); //Zerar o temporizador
        return
    }
    tempoDecorridoEmSegundos -= 1; //Contagem de 1 em 1 segundo ~ com base na variável
    mostrarTempo();
}

startPauseBt.addEventListener('click', iniciarOuPausar); //Clique de iniciar ou pausar

function iniciarOuPausar() { //Função que será executada com o botão Começar
    if(intervaloId) { //intervaloId é a variável com valor null
        somPause.play(); //Dar play na constante somPause
        zerar(); //Limpa o setInterval e atribui o valor nulo ao intervaloId
        return;
    }
    somPlay.play(); //Dar play na constante somPlay
    intervaloId = setInterval(contagemRegressiva, 1000); //Os parâmetros de setInterval são a função a ser executada e o tempo em ms - aqui ele pega o contagemRegressiva e tira 1 seg a cada 1 seg
    iniciarOuPausarBt.textContent = "Pausar"; //Altera o texto Começar/Pausar
    imagemPlayPause.setAttribute('src', './imagens/pause.png'); //Altera o ícone Play/Pause
}

function zerar() {
    clearInterval(intervaloId); //Cancela a execução do setInterval
    iniciarOuPausarBt.textContent = "Começar"; //Altera o texto Começar/Pausar
    intervaloId = null;
    imagemPlayPause.setAttribute('src', './imagens/play_arrow.png'); //Altera o ícone Play/Pause
}

function mostrarTempo () {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000); //Ajuste do tempo, de milissegundos para segundos
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', {minute: '2-digit', second: '2-digit'}); //Formatação do tempo
    tempoNaTela.innerHTML = `${tempoFormatado}`; //Insere na constante o tempo formatado
}

mostrarTempo(); // Função que mostra o tempo na tela, inserindo-o em sua div com id #timer