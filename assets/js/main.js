$(document).ready(() => {



    function ajaxPokedexNacional() {
        $.ajax({
            url: "http://pokeapi.co/api/v2/pokedex/1/",
            type: "GET",
            datatype: "json",
            data: {}
        })
            .done(function (response) {
                console.log(response);
                dibujarPokedexNacional(response.pokemon_entries);
            })
            .fail(function () {
                console.log("error");
            });
    }

    function dibujarPokedexNacional(pokemones){
        pokemones.forEach((pokemon)=>{

            var str = (pokemon.entry_number + '. ' + pokemon.pokemon_species.name[0].toUpperCase() + pokemon.pokemon_species.name.slice(1) + '.jpg');
            if (pokemon.entry_number < 100) str = '0' + str;
            if (pokemon.entry_number < 10) str = '0' + str;

            console.log(str);

            $('.collage').append(`<div class="col-md-3">
                <div class="sqr">
				    <div class="pokemon" style="background-image: url('assets/img/pokemon/${str}');">
                    </div>
                </div>
			</div>`)
            
        });
    }



    ajaxPokedexNacional();



});






