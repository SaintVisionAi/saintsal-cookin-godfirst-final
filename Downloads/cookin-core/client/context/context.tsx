import { createContext, useContext, useState } from "react"

export const AppContext = createContext({})

export const useAppContext = () => useContext(AppContext)

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  return (
    <AppContext.Provider value={{ user, setUser }}>
      {children}
    </AppContext.Provider>
  )
}
