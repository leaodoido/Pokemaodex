const ul = document.querySelector('[data-js="pokedex"]');
const escolha = document.getElementById("tipo-pokemon");
const escolhahab = document.getElementById("habitat-pokemon");

async function fetchPokemon() {
  const pokemons = [];
  const pokehabs = [];

  for (let i = 1; i <= 9; i++) {
    try {
      const pokeUrl = `https://pokeapi.co/api/v2/pokemon-habitat/${i}`;
      const Response = await fetch(pokeUrl);
      const habitat = await Response.json();

      pokehabs.push(habitat);
    } catch (PINGOLA) {
      alert("Deu erro visse?");
    }
  }
  
  for (let i = 1; i <= 150; i++) {
    try {
      const PokeUrl = `https://pokeapi.co/api/v2/pokemon/${i}`;
      const Response = await fetch(PokeUrl);
      const pokemon = await Response.json();

      pokehabs.forEach((pokehab) => {
        const checkHab = pokehab.pokemon_species.find(
          ({ name }) => name === pokemon.name
        );
        if (checkHab) pokemon.habitat = pokehab.name;
      });

      pokemons.push(pokemon);
    } catch (e) {
      alert("Deu erro visse?");
      console.error(e);
    }
  }

  return pokemons;
}

function drawCard({ id, name, habitat, ...pokemon }) {
  const types = pokemon.types.map((typeInfo) => typeInfo.type.name);
  return `
                <li class = "card ${types[0]}">
                <img class="pokeImg" alt="${name}" src="https://pokeres.bastionbot.org/images/pokemon/${id}.png">
                    <h2 class="pokeNome">${id}. ${name}</h2>
                    <p class="pokeTipos">${types.join(" ; ")}</p>
                </li>
                `;
}

function display(pokemons, escolha, escolhahab) {
  let displayPoke = "";

  pokemons.forEach((pokemon) => {
    const types = pokemon.types.map((typeInfo) => typeInfo.type.name);

    if (escolha === "all" && escolhahab === pokemon.habitat)
      displayPoke += drawCard(pokemon);

    if (types.includes(escolha) && escolhahab === "all")
      displayPoke += drawCard(pokemon);

    if (escolha === "all" && escolhahab === "all")
      displayPoke += drawCard(pokemon);

    if (types.includes(escolha) && escolhahab === pokemon.habitat)
      displayPoke += drawCard(pokemon);
  });

  ul.innerHTML = displayPoke;
}

async function init() {
  const pokemons = await fetchPokemon();

  const filtros = {
    tipo: "all",
    habitat: "all",
  };

  display(pokemons, "all", "all");
  escolha.addEventListener("change", (e) => {
    const { value } = e.target;
    filtros.tipo = value;

    const { tipo, habitat } = filtros;
    display(pokemons, tipo, habitat);
  });
  escolhahab.addEventListener("change", (e) => {
    const { value } = e.target;
    filtros.habitat = value;

    const { tipo, habitat } = filtros;
    display(pokemons, tipo, habitat);
  });
}

init();
