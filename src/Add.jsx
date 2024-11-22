import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useMutation } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { AppContext } from './AppProvider'
const apiLink = import.meta.env.VITE_API_LINK

function Add() {
    const navigate = useNavigate()
    const {isModifie , setisModifie , modifieObj , setmodifieObj} = useContext(AppContext)
    const [officeName , setofficeName] = useState(isModifie ? modifieObj.nomBureau : "")
    const [officeNumber , setofficeNumber] = useState(isModifie ? modifieObj.NumeroBureau : "")

    const modifieMutation = useMutation({
        mutationKey : ["modifie"],
        mutationFn : async () => {
            console.log(modifieObj);
            
            const res = await axios.patch(`${apiLink}/bureau/${modifieObj.id}` , {
                nomBureau : modifieObj.nomBureau,
                NumeroBureau : modifieObj.NumeroBureau
            })
            console.log(res.data);
            return res.data
            
        }
    })

    

    const addMutation = useMutation({
        mutationKey : ["add"],
        mutationFn : async () => {
            const res = await axios.post(`${apiLink}/bureau` , {
                nomBureau : officeName,
                NumeroBureau : officeNumber
            })
            console.log(res.data);
            return res.data
        },
        onSuccess : () => {
            navigate('/list')
        }

    })
    function handleSubmit(e){
        e.preventDefault();
        console.log({
            officeName,
            officeNumber
        });
        if(isModifie){
            modifieMutation.mutate()
        }else{
            addMutation.mutate()
        }
        

    }
    return (
    <div className='w-full h-screen flex justify-center items-center' >
        <form onSubmit={(e) => handleSubmit(e)} className='w-[90%] md:w-[70%] h-[60%] flex flex-col gap-5 '>
            <h1 className='text-xl text-center mb-6 text-blue-900' > Ajouter un bureau </h1>
            <input value={officeName} required onChange={(e) => setofficeName(e.target.value)} type='text' placeholder='nom du bureau' />
            <input value={officeNumber} required onChange={(e) => setofficeNumber(e.target.value)} type='number' placeholder='numero de bureau' />
            {
                isModifie ? (
                    <button disabled={modifieMutation.isLoading}  className={`text-white p-3 rounded-md bg-blue-900 ${modifieMutation.isLoading ? "bg-gray-400" : "bg-blue-900" }`} > Modifier </button>
                ) : (
                    <button disabled={addMutation.isLoading}  className={`text-white p-3 rounded-md bg-blue-900 ${addMutation.isLoading ? "bg-gray-400" : "bg-blue-900" }`} > Ajouter </button>
                )
            }
        </form>  
    </div>
  )
}

export default Add