assignmentTask = () => {
    getPokemonData(Math.floor(Math.random() * 151) + 1)
}

async function getPokemonData(id) {
    try {
        // Get response from PokeAPI for the given Pokemon ID
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)

        if (!pokemonResponse.ok) {
            throw new Error(`Pokemon HTTP error: ${pokemonResponse.status}`)
        }
        
        const pokemonData = await pokemonResponse.json()

        console.log(pokemonData)

        console.log(`Pokemon ID: ${pokemonData.id}`)
        console.log(`Pokemon Name: ${pokemonData.name}`)
        console.log(`Pokemon Height: ${pokemonData.height}`)
        console.log(`Pokemon Weight: ${pokemonData.weight}`)
        console.log(`Pokemon Types: ${pokemonData.types.map(type => type.type.name).join(', ')}`)

        // Get species data for the same Pokemon ID
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)

        if (!speciesResponse.ok) {
            throw new Error(`Species HTTP error: ${speciesResponse.status}`)
        }

        const speciesData = await speciesResponse.json()

        const flavor = speciesData.flavor_text_entries.find(
            entry => entry.language.name === 'en'
        )

        if (!flavor) {
            console.log('No English flavor text available')
            return
        }

        console.log(`Flavor text: ${flavor.flavor_text}`)
        console.log(`Habitat: ${speciesData.habitat.name}`)
        console.log(`Is Legendary: ${speciesData.is_legendary ? 'Yes' : 'No'}`)
    }
    catch (error) {
        console.error('Error fetching data:', error)
    }
}

assignmentTask();

// How to use:
// CD to discussions then run with command: 'node week2.js'