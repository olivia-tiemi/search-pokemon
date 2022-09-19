const root = document.querySelector('body');
const searchButton = document.querySelector('.buscar');
const clearButton = document.querySelector('.limpar');
const pokemonInput = document.querySelector("#pokemon"); //input que receberá o nome ou numero do pokémon
const nomePokemon = document.querySelector("h1"); //h1 que irá mostrar o nome do pokémon
const imgPokemon = document.querySelector(".poke-img"); //mostrará a img principal do pokémon
const versionOption = document.querySelector("select"); //irá selecionar estilo da imagem (front, back, shiny)
const pokeType = document.querySelectorAll(".type p"); //irá controlar o texto dos tipos do pokémon (fire, dragon...)
const typeOne = document.querySelector(".type-one"); //colore o primeiro tipo do pokémon
const typeTwo = document.querySelector(".type-two"); //colore o segundo tipo do pokémon
const colorContainer = document.querySelectorAll(".color-container"); //colore o fundo do card 1 com a cor do primeiro tipo do pokémon
const pokeData = document.querySelector(".poke-data"); //div que irá receber as infos do pokémon
const seta = document.querySelector(".seta"); //classe que faz aparecer a seta para expandir as infos do poké
const statusBar = document.querySelectorAll(".bar"); //classe que controla a barra de cada stats
const pokeStatus = document.querySelectorAll(".status h2"); //número correspondente a cada stats
const abilities = document.querySelector(".abilities"); //div que comporta as habilidades do poké


//array de cores por tipo do pokémon
const typeColors = [
    { type: 'normal', color: '#A8A77A' },
    { type: 'fire', color: '#EE8130' },
    { type: 'water', color: '#6390F0' },
    { type: 'electric', color: '#F7D02C' },
    { type: 'grass', color: '#7AC74C' },
    { type: 'ice', color: '#96D9D6' },
    { type: 'fighting', color: '#C22E28' },
    { type: 'poison', color: '#A33EA1' },
    { type: 'ground', color: '#E2BF65' },
    { type: 'flying', color: '#A98FF3' },
    { type: 'psychic', color: '#F95587' },
    { type: 'bug', color: '#A6B91A' },
    { type: 'rock', color: '#B6A136' },
    { type: 'ghost', color: '#735797' },
    { type: 'dragon', color: '#6F35FC' },
    { type: 'dark', color: '#705746' },
    { type: 'steel', color: '#B7B7CE' },
    { type: 'fairy', color: '#D685AD' }
]

let currentBody = {}; //guarda o body da primeira resposta para utilizar no event listener do select
let id = 0; //guarda o id do pokémon para utilizar no fetch 2
let url = ''; //guarda a url do pokémon para utilizar no fetch 3
let urlArray = []; //guarda as url de cada pokéon da cadeia de evolução

//event listener para o valor do input com nome ou número do pokémon
searchButton.addEventListener('click', async () => {
    if (!pokemonInput.value)
        return;

    searchButton.style.display = 'none';
    clearButton.style.display = 'flex';

    //buscando o pokémon do input e suas propriedades
    try {
        const resposta = await fetch('https://pokeapi.co/api/v2/pokemon/' + pokemonInput.value.toLowerCase());

        versionOption.id = '';
        imgPokemon.style.filter = 'brightness(0)';
        const body = await resposta.json();
        currentBody = body;

        //setta o nome e img do pokémon (inicialmente, irá aparecer preta)
        id = body.id; //este id será utilizado para buscar uma página. Esta página irá fornecer a url da cadeia de evolução
        nomePokemon.textContent = id + '-' + body.name.toUpperCase();
        imgPokemon.src = body.sprites.front_default;
        pokeStatus.forEach((status, index) => {
            status.textContent = body.stats[index].base_stat;
            for (let i = 1; i <= 255; i++) {
                const bar = document.createElement('div');
                bar.classList.add('one-bar');
                if (i > status.textContent) {
                    bar.style.backgroundColor = '#FFF';
                }

                statusBar[index].appendChild(bar);
            }
        })

        for (let ability of body.abilities) {
            const h2 = document.createElement('h2');
            h2.textContent = ability.ability.name.toUpperCase();
            abilities.appendChild(h2);
        }

        //o for a seguir controla os elementos do pokémon, inclusive suas cores e do card
        body.types.forEach((type, index) => {

            pokeType[index].classList.add('show');

            for (let item of typeColors) {

                if (item.type === type.type.name) {

                    if (index === 0) {
                        typeOne.style.backgroundColor = item.color;
                        root.style.setProperty('--element-color', item.color)

                    } else {
                        typeTwo.style.backgroundColor = item.color;

                    }
                }
            }
            pokeType[index].textContent = type.type.name.toUpperCase();

        })
    } catch (err) {
        versionOption.id = 'hidden';
        console.log(err);
        nomePokemon.textContent = 'Pokémon not found.'
        return;
    }
})

clearButton.addEventListener('click', () => {
    //resetando para o card inicial
    pokemonInput.value = "";
    versionOption.value = "";
    versionOption.id = 'hidden';
    pokeType[0].classList.remove('show');
    pokeType[1].classList.remove('show');
    imgPokemon.src = "";
    imgPokemon.style.transition = '';
    root.style.setProperty('--element-color', 'darkslategray');
    nomePokemon.textContent = '';
    colorContainer[1].id = 'hidden';
    urlArray = [];
    searchButton.style.display = 'flex';
    clearButton.style.display = 'none';
    seta.id = 'hidden';

    while (pokeData.childNodes[0]) {
        pokeData.childNodes[0].remove();
    }

    while (abilities.childNodes[0]) {
        abilities.childNodes[0].remove();
    }

    statusBar.forEach(statusBar => {
        while (statusBar.childNodes[0]) {
            statusBar.childNodes[0].remove();
        }
    })
})

seta.addEventListener('click', async () => {

    colorContainer[1].id = '';
    seta.id = 'hidden';

    //busca a url da cadeia de evolução
    const resposta2 = await fetch('https://pokeapi.co/api/v2/pokemon-species/' + id);

    const content = await resposta2.json();
    url = content.evolution_chain.url;

    //Acessando a url da cadeia de evolução
    const resposta3 = await fetch(url);
    const evo = await resposta3.json();

    //gastly: console.log(evo.chain.species);
    //haunter: console.log(evo.chain.evolves_to[0].species);
    //gengar: console.log(evo.chain.evolves_to[0].evolves_to[0].species);
    // console.log(evo.chain);

    //adicionando a url de cada evolução no array de url
    urlArray.push(evo.chain.species.url);

    if (evo.chain.evolves_to.length === 1 && evo.chain.evolves_to[0].evolves_to.length === 0) {
        urlArray.push(evo.chain.evolves_to[0].species.url);
    }

    if (evo.chain.evolves_to.length === 1 && evo.chain.evolves_to[0].evolves_to.length === 1) {
        urlArray.push(evo.chain.evolves_to[0].species.url);
        urlArray.push(evo.chain.evolves_to[0].evolves_to[0].species.url);
    }

    if (evo.chain.evolves_to.length > 1) {
        for (let evolution of evo.chain.evolves_to) {
            urlArray.push(evolution.species.url);
            if (evolution.evolves_to.length === 1) {
                urlArray.push(evolution.evolves_to[0].species.url);
            }
        }
    }

    if (evo.chain.evolves_to.length === 1 && evo.chain.evolves_to[0].evolves_to.length > 1) {
        urlArray.push(evo.chain.evolves_to[0].species.url);
        for (let evolution of evo.chain.evolves_to[0].evolves_to) {
            urlArray.push(evolution.species.url);
        }
    }

    for (let url of urlArray) {
        const pokeEvo = document.createElement('div');
        pokeEvo.classList.add('poke-evo');

        const imgPokemon = document.createElement('img');
        const nomePokemon = document.createElement('h2');

        const resp1 = await fetch(url);
        const pokebase = await resp1.json();
        const ultimaUrl = pokebase.varieties[0].pokemon.url;

        const resp2 = await fetch(ultimaUrl);
        const bodyFinal = await resp2.json();

        imgPokemon.src = bodyFinal.sprites.front_default;
        nomePokemon.textContent = bodyFinal.name.toUpperCase();
        pokeEvo.append(imgPokemon, nomePokemon);
        pokeData.appendChild(pokeEvo);
    }

})


//event listener para alterar a img do pokémon conforme seleção
versionOption.addEventListener('change', () => {
    if (versionOption.value === 'Front') {

        imgPokemon.src = currentBody.sprites.front_default;
        imgPokemon.style.filter = 'brightness(100%)';
        imgPokemon.style.transition = 'ease-in 0.5s';
        if (seta.id === 'hidden') {
            seta.id = '';
        }

    } else if (versionOption.value === 'Back') {

        imgPokemon.src = currentBody.sprites.back_default;
        imgPokemon.style.filter = 'brightness(100%)';
        imgPokemon.style.transition = 'ease-in 0.5s';
        if (seta.id === 'hidden') {
            seta.id = '';
        }

    } else if (versionOption.value === 'Shiny') {

        imgPokemon.src = currentBody.sprites.front_shiny;
        imgPokemon.style.filter = 'brightness(100%)';
        imgPokemon.style.transition = 'ease-in 0.5s';
        if (seta.id === 'hidden') {
            seta.id = '';
        }

    } else if (versionOption.value === 'Animated') {

        imgPokemon.src = currentBody.sprites.versions["generation-v"]["black-white"].animated.front_default;
        imgPokemon.style.filter = 'brightness(100%)';
        imgPokemon.style.transition = 'ease-in 0.5s';
        if (seta.id === 'hidden') {
            seta.id = '';
        }

    } else {

        imgPokemon.style.filter = 'brightness(0)';
    }
})
