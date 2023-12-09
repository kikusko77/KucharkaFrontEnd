import {useContext, useState} from 'react'
import { stringsEqualNormalized } from '../../utils/utils';
import { FetchedIngredients } from '../../utils/Context';
import Ingredients from '../Admin/Ingredients';
import { IngredientType } from '../../utils/Types';

function reverseAndFormat(inputString: string) {
  const segments = inputString.split(/\s+/);
  const l = segments.length;
  const cista = segments[l-1]
  const hruba = segments[l-2]
  const name = segments.slice(0,l-2).join(' ');
  
  return [name,hruba,cista];
}

const Index = () => {
  const [input,setInput] = useState<string>('');
  const [ingredients, setIngredients] = useState<{name: string, gross: number,clean: number, isOkay: boolean, error: string}[]>([]);
  const fetchedIngredients = useContext(FetchedIngredients);

  const checkIngredients = () => {
    const inputArray = input.split('\n');
    const ingredients: {name: string, gross: number,clean: number, isOkay: boolean, error: string}[] = [];
    for (let i = 0; i < inputArray.length; i++) {
      const element = inputArray[i];
      const elementArray = reverseAndFormat(element);

      const name = elementArray[0];

      if (name === undefined || name === '') continue;
      const hruba = parseFloat(elementArray[1].replace(',', '.'));
      const cista = parseFloat(elementArray[2].replace(',', '.'));
      let isOkay = true;
      let error = '';

      fetchedIngredients.forEach((ingredient: IngredientType) => {
        if (stringsEqualNormalized(ingredient.name, name)) {
          const upper_bound = (ingredient.clean/ingredient.gross)*1.05;
          const lower_bound = (ingredient.clean/ingredient.gross)*.95;
          const current = cista/hruba;
          if (current > upper_bound || current < lower_bound) {
            isOkay = false;
            error = `hodnota pomeru ${current.toFixed(3)} je mimo rozsahu ${lower_bound.toFixed(3)}-${upper_bound.toFixed(3)}`;
          } else {
            error = 'pomer je správný';
          }
        }
      });
      ingredients.push({name, gross: hruba,clean: cista, isOkay, error});
    }

    setIngredients(ingredients);
  }
  return (
    <>
      <div className='w-full flex gap-2 text-xl'>
        <textarea className='w-1/4 h-96 p-2' onChange={e => setInput(e.target.value)}></textarea>
        <div className='w-2/3 border-[1px] rounded-sm border-black'>
          {
            ingredients.map((ingredient, index) => 
              <div key={index} className={ingredient.isOkay ? 'bg-green-300 px-4' : 'bg-red-400 px-4'}>
                {ingredient.name}
                <span className='ml-4'>
                  {ingredient.error}
                </span>
              </div>
            )
          }
        </div>
      </div>
      <div>
        <button className='submit-button mt-2 mb-4' onClick={checkIngredients}>Zkontroluj</button>
      </div>
      { fetchedIngredients && <Ingredients ingredients={fetchedIngredients}/> }
    </>
  )
}

export default Index