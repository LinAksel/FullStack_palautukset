import { useState, useEffect } from "react"
import axios from "axios"
import Countries from "./components/Countries"

const Filter = ({ filter, handleFilterChange }) => {
  return (
    <form>
      <div>
        find countries: <input value={filter} onChange={handleFilterChange} />
      </div>
    </form>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState("")
  const [weather, setWeather] = useState({name: "Loading", main: {temp: 'loading'}, wind: {speed: 'loading'}, weather: [{icon: '01d'}], icon: "loading"})

  const handleFilterChange = (event) => setFilter(event.target.value)
  const handleWeatherChange = (capital, cca2) => {
    const api_key = process.env.REACT_APP_API_KEY
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${capital},${cca2}&appid=${api_key}&units=metric`
    axios
      .get(url)
      .then((response) => {
        const iconUrl = `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
        setWeather({...response.data, icon: iconUrl})
      })
      .catch((error) => {
        console.log(`Error fetching weather: ${error}`)
      })
  }

  useEffect(() => {
    console.log("Fetching countries")
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then((response) => {
        setCountries(response.data)
      })
      .catch((error) => {
        console.log(`Error fetching countries: ${error}`)
      })
  }, [])

  return (
    <div>
      <Filter filter={filter} handleFilterChange={handleFilterChange} />
      <Countries
        countries={countries}
        filter={filter}
        setFilter={setFilter}
        weather={weather}
        handleWeatherChange={handleWeatherChange}
      />
    </div>
  )
}

export default App
