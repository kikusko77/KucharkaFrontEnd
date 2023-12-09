import { useContext, useState } from 'react'
import Ingredients from './Ingredients.tsx'
import { createPortal } from 'react-dom';
import IngredientForm from './IngredientForm';
import { FetchedIngredients } from '../../utils/Context.tsx';


const Index = () => {
  const [showAddIngredient, setshowAddIngredient] = useState<boolean>(false);
  const ingredients = useContext(FetchedIngredients);

  return (
    <div className='mt-32'>
      <div className='flex items-center gap-4'>
        <h2 className='text-5xl font-bold mb-2'>
          Potraviny
        </h2>
        <button className='px-2 bg-black text-white text-2xl' onClick={() => setshowAddIngredient(prev => !prev)}>+</button>
        {showAddIngredient && createPortal(
          <IngredientForm close={setshowAddIngredient}/>,
          document.body
        )}
      </div>
      { ingredients && <Ingredients ingredients={ingredients}/> }
    </div>
  )
}

export default Index