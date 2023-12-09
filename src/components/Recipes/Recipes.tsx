import { useContext, useState } from 'react'
import {  FetchedRecipes } from '../../utils/Context'
import RecipeListing from './RecipeListing';
import { RecipeType } from '../../utils/Types';

interface RecipeProps {
  toggleRecipe: React.Dispatch<React.SetStateAction<boolean>>;
}

const Recipes = ({toggleRecipe}: RecipeProps) => {
  const fetchedRecipes: RecipeType[] = useContext(FetchedRecipes);
  const [profit, setprofit] = useState<number>(0);
  const [platKuchara,setPlatKuchara] = useState(0);
  const [cenaEnergii,setCenaEnergii] = useState(0);
  const [pocetHodin,setPocetHodin] = useState(0);

  return (
    <div className='flex flex-col gap-2 text-2xl'>
      <div>
        <label>Plat kuchara:</label>
        <input className='ml-2 input-field w-24' onChange={e => {
          setPlatKuchara(prevPlat => {
            setprofit(prevProfit => prevProfit + (prevPlat * pocetHodin) - (Number(e.target.value) * pocetHodin))
            return Number(e.target.value);
          });
        }} type="number"></input>
      </div>
      <div>
        <label>Cena energii na hodinu:</label>
        <input className='ml-2 input-field w-24' onChange={e => {
          setCenaEnergii(prevPlat => {
            setprofit(prevProfit => prevProfit + (prevPlat * pocetHodin) - (Number(e.target.value) * pocetHodin))
            return Number(e.target.value);
          });
        }}></input>
      </div>
      <div>
        <label>Pocet hodin:</label>
        <input className='ml-2 input-field w-24' onChange={e => {
          setPocetHodin(prevHodiny => {
            setprofit(prevProfit => prevProfit + (platKuchara * prevHodiny) + (cenaEnergii * prevHodiny) - (Number(e.target.value) * platKuchara) - (Number(e.target.value) * cenaEnergii))
            return Number(e.target.value);
          });
        }}></input>
      </div>
      <div className='flex justify-between text-3xl'>
        <div>Nazov</div>
        <div className='flex gap-8 md:mr-24'>
          <div className=''></div>
          <div>Pocet</div>
          <div>Cena</div>
        </div>
      </div>
      <div className='h-96 md:h-[400px] border-[1px] rounded-md border-black overflow-auto flex flex-col gap-1 p-2'>
        {fetchedRecipes.length ? fetchedRecipes.map((recipe) => <RecipeListing key={recipe.id} recipe={recipe} setGlobalProfit={setprofit} />) : 
          <div className='text-3xl flex justify-center items-center h-full flex-col'><span>Ziadne recepty</span><button className='px-2 bg-black text-white text-2xl' onClick={() => toggleRecipe(prev => !prev)}>
          </button></div>}
      </div>
      <div className='text-5xl font-bold self-end'>Profit: {profit}€</div>
    </div>
  )
}

export default Recipes