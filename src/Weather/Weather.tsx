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
        // city: location.name,
        // temp: weather.main.temp,
        // state: location.state,
        icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        // country: location.country,
      }
    },
    { enabled: !!city, retry: 1 }
  )

  return (
    <>
      <div className="weather">
        {isLoading && <>Loading weather data...</>}
        <div>
          <h1 className="title">
            {info?.name} {info?.country && `(${info?.country})`}
          </h1>
          {info?.state && <label>{info?.state}</label>}
        </div>
        <div>
          {info?.main.temp && (
            <p className="temperature">
              {info?.main.temp && ~~info?.main.temp}°
            </p>
          )}
        </div>
        <div>
          {info?.icon && <img className="icon" src={info?.icon} alt="Icon" />}
        </div>

        {error && error.message}
      </div>
    </>
  )
}

export { Weather }
