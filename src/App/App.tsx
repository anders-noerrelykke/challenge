import React from "react"
import type { ChangeEvent, FC } from "react"
import { Weather } from "../components/Weather/Weather"
import { QueryClient, QueryClientProvider } from "react-query"

import "./App.css"
import ThemeSwitcher from "../components/ThemeSwitcher/ThemeSwitcher"

export const App: FC = () => {
  const queryClient = new QueryClient()
  const [input, setInput] = React.useState<string>("")
  const [city, setCity] = React.useState<string>("Copenhagen")

  const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    setInput(event.target.value)

  const submitCity = (input: string): void => {
    setCity(input)
  }

  return (
    <QueryClientProvider client={queryClient}>
      <div className="controls_container">
        <span>
          <input
            role="search"
            type="text"
            value={input}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.keyCode === 13) {
                submitCity(input)
              }
            }}
          />
          <button onClick={() => submitCity(input)}>Show Weather</button>
        </span>
        <ThemeSwitcher />
      </div>
      <Weather city={city} />
    </QueryClientProvider>
  )
}
