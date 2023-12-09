import {useState} from 'react'
import Ingredient from './Ingredient';
import { checkContainsStrings } from '../../utils/utils';

interface IngredientProps {
  ingredients: {id: number, name: string, gross: number, clean: number}[],
}


const Ingredients = ({ingredients}: IngredientProps) => {
  const [searchIngredient, setsearchIngredient] = useState<string>("");
  
  return (
    <div>
      <div className='text-3xl flex flex-col md:flex-row'>
        <label htmlFor='searchIngredient'>Hľadať ingredienciu: </label>
        <input className='input-field md:ml-2 mt-2 md:mt-0' onChange={e => setsearchIngredient(e.target.value)}></input>
      </div>
      <div className='flex justify-between text-3xl pr-2 mb-2 mt-2'>
        <div>Názov</div>
        <div className='flex gap-4'>
          <div>Hrubá</div>
          <div>Čistá</div>
          <div></div>
        </div>
      </div>
      <div className='h-[600px] border-[1px] shadow-lg p-2 border-black overflow-auto ingredients-container bg white'>
        {ingredients
        .filter(
          ing => checkContainsStrings(ing.name, searchIngredient))
        .map((ingredient) => {
          return <Ingredient
            name={ingredient.name}
            key={ingredient.id}
            id={ingredient.id}
            clean={ingredient.clean}
            gross={ingredient.gross}
          />
        })}
      </div>
    </div>
  )
}

export default Ingredients