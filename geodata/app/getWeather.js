// API fetch stuff
async function getWeatherData(lat, lon) {
    try {
        // Keeping this local for now; move to .env if/when you want to lock it down
        const key = 'b5f869c0812305704157f12f4fb58c4a'

        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        // Hit OpenWeatherMap for the exact coordinates from the request
        const dataRequest = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)

        if (!dataRequest.ok) {
            const body = await dataRequest.text()
            throw new Error(`Data HTTP error: ${dataRequest.status} ${dataRequest.statusText} - ${body}`)
        }
        
        const data = await dataRequest.json()

        console.log(data)

        // Return raw API payload and let the controller decide what to keep
        return data
    }
    catch (error) {
        console.error('Error fetching data:', error)
    }
}

module.exports = {
    getWeatherData
}
