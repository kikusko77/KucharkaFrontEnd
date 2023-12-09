import {useState} from 'react'
import { checkContainsStrings } from '../../utils/utils';
import User from './User';
import useSWR from 'swr';
import axios from 'axios';
import { getAuthCookie } from '../../utils/Auth';

const token = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}


const fetcher = (url: string) => axios.get(url,config).then(r => r.data);

const Users = () => {
  const [searchUser, setSearchUser] = useState<string>('');
  const { data: fetchedUsers } = useSWR<{id: number, name: string, password: string,role: string}[]>('https://kucharkabackend.onrender.com/users', fetcher);
  
  return (
    <div>
      <div className='text-3xl flex flex-col md:flex-row mt-4'>
        <label htmlFor='searchIngredient'>Hľadať uživateľa: </label>
        <input className='input-field md:ml-2 mt-2 md:mt-0' onChange={e => setSearchUser(e.target.value)}></input>
      </div>
      <div className='flex justify-between text-3xl pr-2 mb-2 mt-2'>
        <div>Meno</div>
        <div className='flex gap-4'>
          <div>Heslo</div>
          <div></div>
        </div>
      </div>
      <div className='h-[600px] border-[1px] shadow-lg p-2 border-black overflow-auto ingredients-container bg white'>
        { fetchedUsers && fetchedUsers
        .filter(
          (us) => checkContainsStrings(us.name, searchUser))
        .map((user) => {
          return <User
            name={user.name}
            key={user.id}
            id={user.id}
            password={user.password}
            role={user.role}
          />
        })}
      </div>
    </div>
  )
}

export default Users