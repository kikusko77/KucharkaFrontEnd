import React, { useContext } from 'react'
import { FetchedIngredients } from '../../utils/Context';
import Ingredient from './Ingredient';
import { IngredientType } from '../../utils/Types';

interface IngredientsAdderProps {
  add: React.Dispatch<React.SetStateAction<{name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]>>
  addedIngredients: {name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]
}

const IngredientsAdder = ({add, addedIngredients}: IngredientsAdderProps) => {
  const fetchedIngredients: IngredientType[] = useContext(FetchedIngredients);

  return (
    <>
    <div className='px-4 flex justify-between text-xl'>
      <span>Nazov</span>
    </div>
    <div className='h-96 md:h-[400px] md:mx-4 border-[1px] p-1 rounded-sm border-black overflow-auto relative'>
      <div className='flex flex-col h-full my-1'>
        {fetchedIngredients && fetchedIngredients.map(ingredient => {
          return <Ingredient key={ingredient.id} add={add} ingredient={ingredient} addedIngredients={addedIngredients}/>
        })}
      </div>
    </div>
  </>
  )
}

export default IngredientsAdder