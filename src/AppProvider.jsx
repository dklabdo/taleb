import React, { Children, useState } from 'react'
import { createContext } from 'react'

export const AppContext = createContext()

function AppProvider({children}) {
    const [isModifie , setisModifie] = useState(false)
    const [modifieObj , setmodifieObj ] = useState(null)

  return (
    <AppContext.Provider value={{isModifie , setisModifie , modifieObj , setmodifieObj}} >
        {children}
    </AppContext.Provider>
  )
}

export default AppProvider