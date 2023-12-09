import {useContext, useState} from 'react'
import { createPortal } from 'react-dom';
import Recipes from './Recipes';
import { FetchedRecipes } from '../../utils/Context';
import RecipeForm from './RecipeForm';

const Index = () => {
  const [toggleRecipe, settoggleRecipe] = useState(false);
  const recipes = useContext(FetchedRecipes);

  return (
    <div className='mt-32'>
      <div className='flex items-center gap-4'>
        <h2 className='text-5xl font-bold mb-2'>
          Recepty
        </h2>
        <button className='px-2 rounded-md bg-black text-white text-2xl' onClick={() => settoggleRecipe(prev => !prev)}>+</button>
        {toggleRecipe && createPortal(
          <RecipeForm close={settoggleRecipe}/>,
          document.body
        )}
      </div>
      { recipes && <Recipes toggleRecipe={settoggleRecipe}/> }
    </div>
  )
}

export default Index