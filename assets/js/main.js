var pokemones = [];
var pokemones_filtrados = [];
var pokemon_seleccionado = {};
inicializarPokemonSeleccionado();

function inicializarPokemonSeleccionado() {
    pokemon_seleccionado = {
        nombre: '',
        numero: '',
        id: 0,
        url: '',
        img: '',
        datos: {

        },
        detalle: {

        }
    };
}

function mostrarDetalle(){
    $('#altura').html(pokemon_seleccionado.detalle.height/10 + ' m');
    $('#categoria').html(pokemon_seleccionado.datos.genera.filter((genus)=>{
        return genus.language.name == 'es';
    }).map((genus)=>{
        return genus.genus;
    }).join(', '));
    $('#peso').html(pokemon_seleccionado.detalle.weight/10 + ' Kg');
    $('#habilidad').html(pokemon_seleccionado.detalle.abilities.map((ability)=>{
        return ability.ability.name;
    }).join(', '));
}

function mostrarContenido(){
    var html = '';
    var textos = pokemon_seleccionado.datos.flavor_text_entries.filter((obj)=>{
        return obj.language.name == 'es';
    })
    html += `<p>${textos[0].flavor_text}</p>
            <div class="row">
                <div class="col-xs-4 blue">
                    Altura: <br/>
                    <span id="altura"></span> <br/>
                </div>
                <div class="col-xs-7 blue">
                    Categoría: <br/>
                    <span id="categoria"></span> <br/>
                </div>
            </div>
            <div class="row">
                <div class="col-xs-4 blue">
                    Peso: <br/>
                    <span id="peso"></span> <br/>
                </div>
                <div class="col-xs-7 blue">
                    Habilidad: <br/>
                    <span id="habilidad"></span> <br/>
                </div>
            </div>
            `;
    $('#modal_contenido').html(html);
    ajaxPokemonDetalle(pokemon_seleccionado.id);    
}

function ajaxPokemonDetalle(id) {
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon/' + id + '/',
        type: "GET",
        datatype: "json",
        data: {}
    })
        .done(function (response) {
            console.log(response);
            pokemon_seleccionado.detalle = response;
            mostrarDetalle();
        })
        .fail(function () {
            console.log("error");
        });
}

function ajaxPokemon(id) {
    $.ajax({
        url: 'https://pokeapi.co/api/v2/pokemon-species/' + id + '/',
        type: "GET",
        datatype: "json",
        data: {}
    })
        .done(function (response) {
            console.log(response);
            pokemon_seleccionado.datos = response;
            mostrarContenido();
        })
        .fail(function () {
            console.log("error");
        });
}

function ajaxPokedexNacional() {
    $.ajax({
        url: "https://pokeapi.co/api/v2/pokedex/1/",
        type: "GET",
        datatype: "json",
        data: {}
    })
        .done(function (response) {
            console.log(response);
            pokemones = response.pokemon_entries;
            pokemones_filtrados = pokemones;
            dibujarPokedexNacional(pokemones_filtrados);
        })
        .fail(function () {
            console.log("error");
        });
}

function dibujarPokedexNacional(pokemones) {
    $('.collage').html('');
    pokemones.forEach((pokemon, i) => {

        var nombre = pokemon.pokemon_species.name[0].toUpperCase() + pokemon.pokemon_species.name.slice(1);
        var numero = pokemon.entry_number;
        if (pokemon.entry_number < 100) numero = '0' + numero;
        if (pokemon.entry_number < 10) numero = '0' + numero;

        var str = (numero + '. ' + nombre + '.jpg');

        console.log(str);

        $('.collage').append(`<div class="col-xs-3">
                <div class="sqr">
				    <div class="pokemon" style="background-image: url('assets/img/pokemon/${str}');"
                        data-toggle="modal" data-target="#myModal" onclick="seleccionarPokemon(${pokemon.entry_number-1})">

                    </div>
                </div>
			</div>`);
    });
}

function seleccionarPokemon(i) {
    inicializarPokemonSeleccionado();   
    $('#modal_contenido').html('');
    var pokemon = pokemones[i];
    pokemon_seleccionado.nombre = pokemon.pokemon_species.name[0].toUpperCase() + pokemon.pokemon_species.name.slice(1);
    pokemon_seleccionado.numero = '' + pokemon.entry_number;
    pokemon_seleccionado.id =  pokemon.entry_number;
    if (pokemon.entry_number < 100) pokemon_seleccionado.numero = '0' + pokemon_seleccionado.numero;
    if (pokemon.entry_number < 10) pokemon_seleccionado.numero = '0' + pokemon_seleccionado.numero;
    pokemon_seleccionado.img = pokemon_seleccionado.numero + '. ' + pokemon_seleccionado.nombre + '.jpg';

    pokemon_seleccionado.url = pokemon.pokemon_species.url;
    ajaxPokemon(pokemon.entry_number);
    
    $('#myModalLabel').html(pokemon_seleccionado.numero + ' - ' + pokemon_seleccionado.nombre);
    $('#pokemon_modal').attr('style', "background-image: url('assets/img/pokemon/" + pokemon_seleccionado.img + "');");
}

$(document).ready(() => {

    $('#select').on('keyup', (event) => {
        var txt = event.target.value;
        console.log(txt);
        pokemones_filtrados = pokemones.filter((pokemon) => {
            return pokemon.pokemon_species.name.indexOf(txt) >= 0;
        });
        console.log(pokemones_filtrados);
        dibujarPokedexNacional(pokemones_filtrados);
    });

    ajaxPokedexNacional();

});






