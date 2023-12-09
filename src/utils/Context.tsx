import { createContext } from 'react'
import useSWR from 'swr';
import { getAuthCookie } from './Auth';
import axios from 'axios'
import jwt_decode from "jwt-decode";

export const FetchedIngredients = createContext([]);
export const FetchedUser = createContext({});
export const FetchedUsers = createContext({});
export const FetchedRecipes = createContext([]);

const token = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}
let id = 0;
if (token !== undefined) {
  const decoded: {userId: number} = jwt_decode(token.split(" ")[1]);
  id = decoded['userId'];
}


const fetcher = (url: string) => axios.get(url,config).then(r => r.data);
const recipeFetcher = () => axios.get(`https://kucharkabackend.onrender.com/recipes/${id}`,config).then(r => r.data);
// const fetcher = (url: string) => fetch(url,{credentials: 'include', headers: {
//   'Content-Type': 'application/json',
//   'Authorization': `Bearer ${token}`,
// }  }).then(r => r.json());
interface ContextProps {
  children: React.ReactNode
}

const Context = (props: ContextProps) => {

  const { data: fetchedIngredients } = useSWR('https://kucharkabackend.onrender.com/groceries', fetcher);
  const { data: fetchedRecipes } = useSWR('recipes', recipeFetcher);

  return (
    <FetchedIngredients.Provider value={fetchedIngredients}>
        <FetchedRecipes.Provider value={fetchedRecipes}>
          {props.children}
        </FetchedRecipes.Provider>
    </FetchedIngredients.Provider>
  )
}

export default Context