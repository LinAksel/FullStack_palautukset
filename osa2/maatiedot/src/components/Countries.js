const Weather = ({ country, weather, handleWeatherChange }) => {
  if (!weather || !(country.capital[0] === weather.name)) {
    handleWeatherChange(country.capital[0], country.cca2)
  }
  return (
    <div>
      <h3>Weather in {country.capital[0]}</h3>
      <div>temperature {weather.main.temp} Celcius</div>
      <img src={weather.icon} alt=""/>
      <div>wind {weather.wind.speed} m/s</div>
    </div>
  )
}

const Country = ({ country }) => {
  return (
    <div>
      <h1>{country.name.common}</h1>
      <div>Capital {country.capital}</div>
      <div>Area {country.area}</div>
      <h3>Languages:</h3>
      <ul>
        {Object.entries(country.languages).map(([key, value]) => (
          <li key={key}>{value}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt="" />
    </div>
  )
}

const Countries = ({ countries, filter, setFilter, weather, handleWeatherChange }) => {
  const filteredCountries = countries.filter((country) =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )
  if (filteredCountries.length > 10) {
    return <div>Too many matches, specify another filter</div>
  } else if (filteredCountries.length < 10 && filteredCountries.length > 1) {
    return filteredCountries.map((country) => (
      <div key={country.ccn3}>
        {country.name.common}{" "}
        <button onClick={() => setFilter(country.name.common)}>show</button>
      </div>
    ))
  } else if (filteredCountries.length === 1) {
    const country = filteredCountries[0]
    return (
      <div>
        <Country country={country} />
        <Weather country={country} weather={weather} handleWeatherChange={handleWeatherChange} />
      </div>
    )
  }
  return null
}

export default Countries
