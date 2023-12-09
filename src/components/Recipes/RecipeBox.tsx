import React from 'react'
interface RecipeBoxProps {
  add: React.Dispatch<React.SetStateAction<{name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]>>
  addedIngredients: {name: string,id: number, clean: number, gross: number, priceForKg: number, weight: number}[]
  toggle: () => void
}

const RecipeBox = ({add,addedIngredients,toggle}: RecipeBoxProps) => {
  
  const changeWeight = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = parseFloat(e.target.value);
    add(prev => {
      return prev.map(ing => ing.id === id ? {...ing, weight: value} : ing)})
  }
  const changePriceForKG = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const value = parseFloat(e.target.value)
    add(prev => {
      return prev.map(ing => ing.id === id ? {...ing, priceForKg: value} : ing)})
  }
  return (
    <>
    <div className='px-4 flex justify-between text-xl'>
      <span>Nazov</span>
      <div className='flex gap-4 md:mr-12'>
        <span>Hmotnost</span>
        <span>€/kg</span>
      </div>
    </div>
    <div className='h-96 md:h-[400px] md:mx-4 border-[1px] rounded-sm border-black overflow-auto flex flex-col gap-1'>
      {addedIngredients.length === 0 && <div className='h-full text-3xl flex flex-col justify-center items-center gap-2'><span>Pridaj igrediencie</span>
      <button className='px-2 bg-black text-white text-2xl' onClick={toggle}>
        +
      </button></div>}
      {addedIngredients.map(ingredient => {
        return <div key={ingredient.id} className='text-2xl flex justify-between items-center'>
            <span className='px-2'>{ingredient.name}</span>
            <div className='flex justify-between'>
              <div className='flex gap-2'>
                <input className='w-20 border-b-[1px] border-black' defaultValue={ingredient.weight} onChange={e => changeWeight(e,ingredient.id)} type="number" step={0.01}></input>
                <input className='w-16 border-b-[1px] border-black' defaultValue={ingredient.priceForKg} onChange={e => changePriceForKG(e,ingredient.id)} type="number" step={0.01}></input>
              </div>
              <button type='button' onClick={_ => add(prev => prev.filter(e => e.id !== ingredient.id))}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 16 16"><path fill="currentColor" d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8L4.646 5.354a.5.5 0 0 1 0-.708z"/></svg>
              </button>
            </div>
          </div>
      })}
    </div>
    </>
  )
}

export default RecipeBox