import axios from "axios"
import React, { useState } from "react"
import { useMutation } from "react-query"
import { useNavigate } from "react-router-dom"
const apiLink = import.meta.env.VITE_API_LINK

function App() {
  const navigate = useNavigate()
  const [email , setemail] = useState('')
  const [password , setpassword] = useState('')
  const LogInMutation = useMutation({
    mutationKey : ["login"],
    mutationFn : async () => {
      const res = await axios.post(`${apiLink}/auth/login` , {
        email : email,
        password : password
      })
      console.log(res.data);
      return res.data
      
    },
    onSuccess : () => {
      navigate('/list')
    }
  
  })

  function handleSubmit(e){
    e.preventDefault()
    LogInMutation.mutate()
  }

  return (
    <div className='w-full flex justify-center items-center h-screen bg-gray-100' >
      <form onSubmit={(e) => handleSubmit(e)} className="w-[95%] md:w-[70%] px-6 md:px-12 h-[60%] flex flex-col gap-6 p-4 " >
        <h1 className="text-center mb-4 text-blue-900 text-2xl " > Veuillez connecter </h1>
        <input onChange={(e) => setemail(e.target.value)} type="email" placeholder="e-mail"   />
        <input onChange={(e) => setpassword(e.target.value)} type="password" placeholder="mot de pass" />
        <button disabled={LogInMutation.isLoading} className={`p-3 my-2 bg-blue-900 text-white rounded-md ${LogInMutation.isLoading ? "bg-gray-500" : "bg-blue-900<<"} `} > Log in </button>
      </form>
    </div>
  )
}

export default App
