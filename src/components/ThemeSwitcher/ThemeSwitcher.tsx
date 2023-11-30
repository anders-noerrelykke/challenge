import { useEffect, useState } from "react"
import { themes } from "./themes"
import { capitalize } from "../../utils/utils"

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState<string>(
    Object.keys(themes)[0]
  )

  useEffect(() => {
    Object.entries(themes[currentTheme as keyof typeof themes]).map(
      ([property, value]: [string, any]) =>
        document.documentElement.style.setProperty(property, value)
    )
  }, [currentTheme])

  return (
    <select
      className="theme_switcher"
      value={currentTheme}
      onChange={(e) => setCurrentTheme(e.target.value)}
    >
      <option disabled>--- Select theme ---</option>
      {Object.keys(themes).map((theme) => (
        <option key={theme} value={theme}>
          {capitalize(theme)}
        </option>
      ))}
    </select>
  )
}

export default ThemeSwitcher
