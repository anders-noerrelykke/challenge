import { useQuery } from "react-query"
import "./Weather.css"

interface Info extends Location, WeatherType {
  icon: string
}

type Location = {
  name: string
  lat: number
  lon: number
  country: string
  state: string
}

type WeatherType = {
  main: {
    temp: number
    temp_min: number
    temp_max: number
    feels_like: number
  }
  weather: [{ icon: string }]
}

const Weather = ({ city }: { city?: string }) => {
  // Replacing useState state management and useRef loading tracker with useQuery
  const {
    data: info,
    error,
    isLoading,
  } = useQuery<Info, { message: string }>(
    ["weather", city],
    async () => {
      const [location]: [Location] = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=4c4f0b1876954338598a7be96c66527b`
      ).then((res) => res.json())
      if (!location) {
        const error = new Error()
        error.message = `No location found matching: ${city}`
        throw error
      }
      const weather: WeatherType = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lon}&units=metric&appid=4c4f0b1876954338598a7be96c66527b`
      ).then((res) => res.json())
      return {
        ...location,
        ...weather,
        icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
      }
    },
    { enabled: !!city, retry: 1 }
  )

  return (
    <>
      <div className="weather">
        {isLoading && <>Loading weather data...</>}
        {error && error.message}
        <div>
          <h1 className="title">{info?.name}</h1>
          <label>
            {info?.state && info?.state}
            {info?.country && <>- {info.country}</>}
          </label>
        </div>
        <div>
          {info?.main.temp && (
            <p className="temperature">
              {info?.main.temp && ~~info?.main.temp}°
            </p>
          )}
          {info?.main.temp_min && info?.main.temp_max && (
            <>
              <hr />
              <label>Ranges between:</label>
              <p>
                {~~info?.main.temp_min}° to {~~info?.main.temp_max}°
              </p>
            </>
          )}
          {info?.main.feels_like && (
            <>
              <hr />
              <label>Feels like:</label>
              <p>{~~info?.main.feels_like}°</p>
            </>
          )}
        </div>
        <div>
          {info?.icon && <img className="icon" src={info?.icon} alt="Icon" />}
        </div>
      </div>
    </>
  )
}

export { Weather }
