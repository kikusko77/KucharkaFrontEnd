import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import Users from './Users';
import { getAuthCookie } from '../../utils/Auth';
import axios from 'axios';
interface FormData {
  name: string;
  password: string;
}


const token = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

const Index = () => {
  const { register, reset, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('https://kucharkabackend.onrender.com/users', {...data, role: "USER"}, config);
      if (response.status === 201) {
        toast.success("Uživateľ bol vytvorený");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/users')
      reset();
    } catch {
      toast.error("Nepodarilo sa vytvoriť uživateľa");
    }
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center'>
        <form onSubmit={handleSubmit((data) => { onSubmit(data); return Promise.resolve(); })} className='flex flex-col mt-8 w-96'>
          <div className='flex flex-col px-4 text-xl'>
            <label className='font-light' htmlFor="Nazov">Meno</label>
            <input className='input-field' id="Nazov" {...register('name', { required: true })} placeholder="Meno" />
            {errors.name && <p className=' text-red-500'>Chýba meno</p>}
          </div>
          <div className='flex flex-col px-4 text-xl'>
            <label className='font-light' htmlFor="Heslo">Heslo</label>
            <input className='input-field' id="Heslo" {...register('password', { required: true })} placeholder="Heslo"/>
            {errors.password && <p className='s text-red-500'>Chýba heslo</p>}
          </div>
          <button className='submit-button mt-4 mx-4' type="submit">Vytvoriť</button>
        </form>
      </div>
      <Users />
    </>
  )
}

export default Index