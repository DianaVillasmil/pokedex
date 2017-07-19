//declaro el arreglo pokemones que contedra el resultado de la consulta a API del listado
//completo de pokemon
var pokemones = [];

//declaro el arreglo que contendra el resultado de aplicar el filtro de busqueda sobre el 
//listado completo
var pokemones_filtrados = [];

//declaro el objeto que contendra al pokemon seleccionado con click para mostrar en el modal
var pokemon_seleccionado = {};

//inicializo e pokemon seleccionado con un objeto con las propiedades en blanco
inicializarPokemonSeleccionado();

$(document).ready(() => {
    //se llama a la funcion que para obtener el listado de todos los pokemon
    ajaxPokedexNacional();

    //selecciono el id del input buscar  le agrego un eventListener (on) el cual recibe como
    //parametro el evento a escuchar y la funcion (callback) que se ejecutara al ocurrir el evento
    $('#select').on('keyup', (event) => {
        //leo el texto del input y la gusrdo ena variable txt
        var txt = event.target.value;
        console.log(txt);
        //filtro del listado de pokemon, los que contengan el texto del input
        pokemones_filtrados = pokemones.filter((pokemon) => {
            return pokemon.pokemon_species.name.indexOf(txt) >= 0;
        });
        console.log(pokemones_filtrados);
        //actualizo los pokemon mostrados en pantalla de acuerdo al filtro aplicado
        dibujarPokedexNacional(pokemones_filtrados);
    });

});
//inicializo el pokemon seleccionado con un objeto con las propiedades en blanco
function inicializarPokemonSeleccionado() {
    pokemon_seleccionado = {
        nombre: '',
        numero: '',
        id: 0,
        img: '',
        datos: {

        },
        detalle: {

        }
    };
}

//Esta funcionn devuelve el json que contiene el listado con los nombres y numero de los pokemon, copia el listado en pokemones y pokemones filtrados,
//y llama a dibujarPokedexNacional con el listado completo
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

//Esta funcion toma como argumento un arreglo de pokemon, limpia la vista, lo rceorre, procesa los nombres con la inicial mayuscula y los
//numeros con tres digitos. Genera los nombres de archivo en el formato de las imagenes qure se consiguieron y usa estos 
//datos para concatenar (interpolacion) el html que se inyecta por cada pokemon refrescando la vista
function dibujarPokedexNacional(pokemones) {
    $('.collage').html('');
    pokemones.forEach((pokemon, i) => {

        var nombre = pokemon.pokemon_species.name[0].toUpperCase() + pokemon.pokemon_species.name.slice(1);
        var numero = pokemon.entry_number;
        if (pokemon.entry_number < 100) numero = '0' + numero;
        if (pokemon.entry_number < 10) numero = '0' + numero;
        //nombre de archivo de la imagen
        var str = (numero + '. ' + nombre + '.jpg');

        console.log(str);

        $('.collage').append(`
            <div class="col-xs-3">
                <div class="sqr">
				    <div class="pokemon" style="background-image: url('assets/img/pokemon/${str}');"
                        data-toggle="modal" data-target="#myModal" onclick="seleccionarPokemon(${pokemon.entry_number - 1})">

                    </div>
                </div>
			</div>
        `);
    });
}


function seleccionarPokemon(i) {
    //Se limpia la variable pokemon_seleccionado
    inicializarPokemonSeleccionado();
    //Se limpia el html del modal 
    $('#modal_contenido').html('');
    //Escojo del arreglo original de pokemon, el pokemon a usar para extraer nombre y numero 
    var pokemon = pokemones[i];
    //Guardo el nombre del pokemon seleccionado como el nombre del pokemon con la inicial mayuscula 
    pokemon_seleccionado.nombre = pokemon.pokemon_species.name[0].toUpperCase() + pokemon.pokemon_species.name.slice(1);
    //Guardo el numero del pokemon como string 
    pokemon_seleccionado.numero = '' + pokemon.entry_number;
    //Guardo en id del pokemon, el numero del pokemon (como numero)
    pokemon_seleccionado.id = pokemon.entry_number;
    //completo los 0 a la izquierda faltantes en el string numero 
    if (pokemon.entry_number < 100) pokemon_seleccionado.numero = '0' + pokemon_seleccionado.numero;
    if (pokemon.entry_number < 10) pokemon_seleccionado.numero = '0' + pokemon_seleccionado.numero;
    //construyo el nombre de la imagen a partir de los daos que conozco
    pokemon_seleccionado.img = pokemon_seleccionado.numero + '. ' + pokemon_seleccionado.nombre + '.jpg';

    //En el modal imprimo el numero y el nombre del pokemon seleccionado
    $('#myModalLabel').html(pokemon_seleccionado.numero + ' - ' + pokemon_seleccionado.nombre);
    //Aplico la imagen del pokemon seleccionado al modal 
    $('#pokemon_modal').attr('style', "background-image: url('assets/img/pokemon/" + pokemon_seleccionado.img + "');");

    //ejecuto la funcion que busca los datos del pokemon
    ajaxPokemon(pokemon.entry_number);
}

//Esta funcionn devuelve el json que contiene la descripcion del pokemon seleccionado, lo almacena 
//dentro de pokemon_seleccionado.datos y llama a mostrar contenido
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

//Esta funcion construye el html interno de la seccion de contenido del modal, usando solamente la 
//descripcion en espanol, y dejando en blanco un span por cada campo pendiente por rellenar .
//al final llama a la funcion ajaxPokemonDetalle, para que obtenga los datos faltamtes  
function mostrarContenido() {
    var html = '';
    var textos = pokemon_seleccionado.datos.flavor_text_entries.filter((obj) => {
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

//esta funcion obtiene el json con los datos restantes, y los almacena en pokemon_seleccionado.detalle, y llama a la fncion mostrarDetalle
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

//Esta funcion procesa los datos obtenidos para mostrarlos de manera correcta, y los inserta en cada uno de los span que quedaron en blanco en el modal
function mostrarDetalle() {
    //la altura viene guardada en el json como un numero entero, pero debe mostrarse  con un decimal por lo que se divide entre 10
    $('#altura').html(pokemon_seleccionado.detalle.height / 10 + ' m');
    //pokemon_seleccionado.datos.genera contiene un arreglo con objetos en muchos idiomas, solo nos interesa el espanol asi que lo filtramos
    $('#categoria').html(pokemon_seleccionado.datos.genera.filter((genus) => {
        return genus.language.name == 'es';
    }).map((genus) => {
        return genus.genus;
    }).join(', '));
    //el peso viene guardada en el json como un numero entero, pero debe mostrarse  con un decimal por lo que se divide entre 10
    $('#peso').html(pokemon_seleccionado.detalle.weight / 10 + ' Kg');
    //pokemon_seleccionado.detalle.abilities contiene un arreglo, el cual comvertimos a una lista separada por comas
    $('#habilidad').html(pokemon_seleccionado.detalle.abilities.map((ability) => {
        return ability.ability.name;
    }).join(', '));
}

















