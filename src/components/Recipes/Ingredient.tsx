import React from 'react'

interface IngredientProps {
  add: React.Dispatch<React.SetStateAction<{name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]>>
  ingredient: {name: string,id: number, clean: number, gross: number}
  addedIngredients: {name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]
}

const Ingredient = ({add,ingredient,addedIngredients}: IngredientProps) => {
  const addIngredient = () => {
    add(prev => [...prev, {...ingredient,priceForKg: 0, weight: 0}]);
  }
  return (
    <div className='text-2xl px-2 mb-1 flex justify-between items-center'>
      <span>
        {ingredient.name}
      </span>
      <div className='font-medium'>
        { addedIngredients.some(p => p.id === ingredient.id) ? <button onClick={addIngredient} className='bg-gray-300 px-4 py-1 rounded-md ' disabled>Pridaj</button> : <button onClick={addIngredient} className='bg-green-400 px-4 rounded-md py-1'>Pridaj</button>}
      </div>
    </div>
  )
}

export default Ingredient