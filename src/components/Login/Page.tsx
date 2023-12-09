/* eslint-disable @typescript-eslint/no-misused-promises */
import axios from 'axios'
import Cookies from 'js-cookie';
import jwt_decode from "jwt-decode";
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  password: string;
}

const Page = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post(`https://kucharkabackend.onrender.com/authenticate`,{name: data.name, password: data.password});
      if (response.status == 200) {
        const headers = response.headers;
        const token = headers.authorization;
        if (token) {
          const decoded: {exp: string} = jwt_decode(token.split(" ")[1]);
          const expiration_time: string = decoded['exp'];
          Cookies.set('authToken', token, { expires: new Date(parseInt(expiration_time, 10) * 1000) })
          window.location.assign('/');
        }
      }
    } catch {
      toast.error("Nepodarilo sa prihlásiť");
    }
  }

  return (
    <div className='flex justify-center mt-12'>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-4 gap-2 border-[1px] p-4 rounded-md border-black'>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="Nazov">Meno</label>
          <input className='input-field w-64' id="Nazov" {...register('name', { required: true })} placeholder="Meno" />
          {errors.name && <p className=' text-red-500'>Zadaj meno</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="Vaha">Heslo</label>
          <input className='input-field w-64' id="Vaha" {...register('password', { required: true })} placeholder="Heslo" type="password" />
          {errors.password && <p className=' text-red-500'>Zadaj heslo</p>}
        </div>
        <div className='w-full flex justify-center items-center mt-4 gap-4'>
          <button className='submit-button' type="submit">Prihlas sa</button>
        </div>
      </form>
    </div>
  )
}

export default Page