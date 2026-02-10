// API fetch stuff
const apiKey = 'b5f869c0812305704157f12f4fb58c4a'

// Generate random latitude and longitude
const randomLatitude = (Math.random() * 180 - 90).toFixed(6)
const randomLongitude = (Math.random() * 360 - 180).toFixed(6)

async function getWeatherData(lat, lon, key) {
    try {
        console.log(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)
        // Send request to OpenWeatherMap API with random coordinates
        const dataRequest = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${key}`)

        if (!dataRequest.ok) {
            const body = await dataRequest.text()
            throw new Error(`Data HTTP error: ${dataRequest.status} ${dataRequest.statusText} - ${body}`)
        }
        
        const data = await dataRequest.json()

        console.log(data)
    }
    catch (error) {
        console.error('Error fetching data:', error)
    }
}

getWeatherData(randomLatitude, randomLongitude, apiKey);