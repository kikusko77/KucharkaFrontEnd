/* eslint-disable @typescript-eslint/no-misused-promises */
import React, {useEffect, useState} from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import IngredientsAdder from '../IngredientsAdder';
import RecipeBox from '../RecipeBox';
import { getAuthCookie } from '../../../utils/Auth';
import axios from 'axios';
import jwt_decode from 'jwt-decode';

interface RecipeFormProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
  name: string,
  recipePrice: number,
  recipeGroceries: {name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[],
  id: number
}

interface FormData {
  name: string;
  sellingPrice: number;
}

const token = getAuthCookie();
let userId = 0;
let role = '';
if (token !== undefined) {
  const decoded: {userId: number, role: string} = jwt_decode(token.split(" ")[1]);
  userId = decoded['userId'];
  role = decoded['role'];
}

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}


const RecipeForm = ({close,name,recipePrice,recipeGroceries,id}: RecipeFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const [addedIngredients, setaddedIngredients] = useState<{name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]>(recipeGroceries);
  const [toggleIngredients, settoggleIngredients] = useState(false);
  const [toggleRecipe, settoggleRecipe] = useState(true);
  const [profit,setProfit] = useState(0);
  const [cleanWeight, setCleanWeight] = useState(0);
  const [sellingPrice, setSellingPrice] = useState<number>(recipePrice);

  useEffect(() => {
    let profi = sellingPrice;
    let cleanWeight = 0;
    addedIngredients.forEach((ingredient) => {
      const ratio = ingredient.clean / ingredient.gross;
      profi -= ingredient.priceForKg * (ingredient.weight/1000);
      cleanWeight += ratio * ingredient.weight;
    })
    setProfit(profi);
    setCleanWeight(cleanWeight);
  }, [addedIngredients,sellingPrice])


  const deleteRecipe = async () => {
    try {
      const response = await axios.delete(`https://kucharkabackend.onrender.com/recipes/${id}`, config);
      if (response.status === 204) {
        toast.success("Recept bol vymazaný");
      } else {
        throw new Error();
      }
      await mutate('recipes')
      close(false);
    } catch {
      toast.error("Nepodarilo sa vymazať recept");
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.put('https://kucharkabackend.onrender.com/recipes', {id, ...data, userId, recipeGroceries: [ ...addedIngredients.map((ingredient) => {
        return {groceryId: ingredient.id, weight: ingredient.weight, priceForKg: ingredient.priceForKg}
        })]} , config);
      if (response.status === 200) {
        toast.success("Recept bol pridaný");
      } else {
        throw new Error();
      }
      await mutate('recipes')
      close(false);
    } catch {
      toast.error("Nepodarilo sa pridať recept");
    }
  }

  const toggleIngre = () => {
    settoggleIngredients(true);
    settoggleRecipe(false);
  }

  return (
    <div className='h-3/4 w-3/4 border-[1px] rounded-lg shadow-2xl border-blue-600 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 overflow-auto'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-4 gap-2'>
        <div className='flex px-4 text-2xl'>
          <label className='font-light' htmlFor="Nazov">Názov: </label>
          <input defaultValue={name} className='ml-2 module-input-field' id="Nazov" {...register('name', { required: true })} />
          {errors.name && <p className=' text-red-500'>Chýba názov</p>}
        </div>
        <div className='gap-2 flex mx-4 text-xl'>
          <button type="button" className={`underline-button ${toggleRecipe ? 'text-blue-500' : ''}`} onClick={_ => {
            settoggleIngredients(false);
            settoggleRecipe(true)
          }}>Recept</button>
          <button type="button" className={`underline-button ${toggleIngredients ? 'text-blue-500' : ''}`} onClick={_ => {
            settoggleIngredients(true);
            settoggleRecipe(false)
          }}>Ingrediencie</button>
        </div>
        { toggleRecipe ? <RecipeBox add={setaddedIngredients} addedIngredients={addedIngredients} toggle={toggleIngre}/> : <IngredientsAdder add={setaddedIngredients} addedIngredients={addedIngredients} />}
        <div className='px-4 text-2xl flex justify-between'>
          <div>
            <label htmlFor='cenaReceptu'>Cena jedla: </label>
            <input defaultValue={Number(recipePrice)} id="cenaReceptu" className='module-input-field w-16 border-b-2 border-black' {...register('sellingPrice', { required: true, valueAsNumber: true})} onChange={e => setSellingPrice(Number(e.target.value))} type="number" step={0.01}></input>
            {errors.sellingPrice && <p className=' text-red-500'>Chýba cena</p>}
          </div>
          <div className='flex gap-2'>
              { role === 'ADMIN' ? <span>Čistá hmotnosť: {cleanWeight.toFixed(2)}g</span>  : null}
              <span>Profit: {profit.toFixed(2)}€</span>
          </div>      
        </div>
        <div className='w-full flex justify-center items-center mt-4 gap-4'>
          <button className='submit-button' type="submit">Zmen</button>
          <button className='close-button' type="button" onClick={() => {
            close(false);
          }}>Zatvoriť</button>
        </div>
      </form>
      <div className='flex justify-center items-center mt-2'>
        <button className='delete-button' onClick={deleteRecipe}>DELETE</button>
      </div>

    </div>
  )
}

export default RecipeForm