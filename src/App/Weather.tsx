import { useQuery } from "react-query"

type Info = {
  city: string
  temp: number
  icon: string
  country: string
}

type Location = {
  name: string
  lat: number
  lon: number
  country: string
}

type WeatherType = {
  main: {
    temp: number
  }
  weather: [{ icon: string }]
}

const Weather = ({ city }: { city?: string }) => {
  // Replacing useState state management and useRef loading tracker with useQuery
  const { data, error, isLoading } = useQuery<Info, { message: string }>(
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
        city: location.name,
        temp: weather.main.temp,
        icon: `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`,
        country: location.country,
      }
    },
    { enabled: !!city, retry: 1 }
  )

  return (
    <>
      {isLoading && <>Loading weather data...</>}
      <h1>
        {data?.city} {data?.country && `(${data?.country})`}
      </h1>

      {data && (
        <>
          <p>{data?.temp && ~~data?.temp} Celcius</p>
          <img src={data?.icon} alt="Icon" />
        </>
      )}

      {error && error.message}
    </>
  )
}

export { Weather }
