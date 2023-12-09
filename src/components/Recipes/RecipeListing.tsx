import React, { useContext, useEffect, useState } from 'react'
import { FetchedIngredients } from '../../utils/Context';
import { createPortal } from 'react-dom';
import EditForm from './EditForm/EditForm';
import { IngredientType, RecipeIngredient } from '../../utils/Types';

interface RecipeListingProps {
  recipe: {
    id: number;
    name: string;
    sellingPrice: number;
    recipeGroceries: {
      groceryId: number;
      priceForKg: number;
      weight: number;
    }[]
  },
  setGlobalProfit: React.Dispatch<React.SetStateAction<number>>
}

const RecipeListing = ({recipe,setGlobalProfit}: RecipeListingProps) => {
  const ingredients: IngredientType[] = useContext(FetchedIngredients);
  const [myIngredients, setmyIngredients] = useState<RecipeIngredient[]>([]);
  const [profit, setProfit] = useState(recipe.sellingPrice);
  const [_, setAmount] = useState(0);
  const [openEdit,setOpenEdit] = useState(false);

  useEffect(() => {
    recipe.recipeGroceries.forEach((recipeGrocery) => {
      const grocery = ingredients.find(i => i.id === recipeGrocery.groceryId);
      
      // Check if the grocery is already in myIngredients
      if (!grocery) return;
      const existingIngredient = myIngredients.find(i => i.id === grocery.id);
  
      if (existingIngredient) {
        // Update the existing ingredient in myIngredients
        setmyIngredients(prev => prev.map(i => 
          i.id === existingIngredient.id ? { ...i, priceForKg: recipeGrocery.priceForKg, weight: recipeGrocery.weight } : i
        ));
      } else {
        // Add the grocery as a new ingredient in myIngredients
        setmyIngredients(prev => [...prev, { ...grocery, priceForKg: recipeGrocery.priceForKg, weight: recipeGrocery.weight }]);
      }
  
      // Calculate profit based on the updated ingredients
      setProfit(prev => parseFloat((prev - (recipeGrocery.priceForKg * (recipeGrocery.weight / 1000))).toFixed(2)));
    });
  }, [recipe.recipeGroceries, ingredients]);

  return (
    <div className='flex justify-between items-center'>
      <span>{recipe.name}</span>
      <div className='flex gap-8 justify-center items-center'>
        <div>
          <input className='input-field w-16' onChange={e => {
            setAmount(prevAmount => {
              setGlobalProfit(prevGlobal => {
                return Number((prevGlobal - (prevAmount * profit) + (Number(e.target.value) * profit)).toFixed(2));
              })
              return Number(e.target.value);
            })
          }} type="number"></input>
        </div>
        <div className='flex justify-center items-end'>
          <div className='w-24'>{recipe.sellingPrice}€</div>
          <button onClick={_ => setOpenEdit(prev => !prev)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg>
          </button>
          {/* <div className='w-24'>{profit}€</div> */}
        </div>
      </div>
      {openEdit && createPortal(
          <EditForm close={setOpenEdit} name={recipe.name} id={recipe.id} recipeGroceries={myIngredients} recipePrice={recipe.sellingPrice}/>,
          document.body
        )}
    </div>
  )
}

export default RecipeListing