import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { mutate } from 'swr';
import { getAuthCookie } from '../../utils/Auth';
import axios from 'axios'

interface IngredientFormProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
}

interface FormData {
  name: string;
  gross: number;
  clean: number;
}


const token = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}

const IngredientForm = ({close}: IngredientFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.post('https://kucharkabackend.onrender.com/groceries', data, config);
      if (response.status === 201) {
        toast.success("Potravina bola pridaná");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/groceries')
      close(false);
    } catch {
      toast.error("Nepodarilo sa pridať potravinu");
    }
  }

  return (
    <div className='h-96 w-80 border-[1px] shadow-2xl border-blue-600 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'>
      <div className='text-2xl flex justify-center items-center mt-4'>Vytvor Potravinu</div>
      <form onSubmit={handleSubmit((data) => { onSubmit(data); return Promise.resolve(); })} className='flex flex-col mt-4 gap-2'>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="Nazov">Názov</label>
          <input className='module-input-field' id="Nazov" {...register('name', { required: true })} placeholder="Názov" />
          {errors.name && <p className=' text-red-500'>Chýba názov</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="Vaha">Hrubá hmotnosť</label>
          <input className='module-input-field' id="Vaha" {...register('gross', { required: true, valueAsNumber: true })} placeholder="Hrubá hmotnosť" type="number" step={0.01}/>
          {errors.gross && <p className=' text-red-500'>Chýba hrubá hmotnosť</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="CistaVaha">Čistá hmotnosť</label>
          <input className='module-input-field' id="CistaVaha" {...register('clean', { required: true, valueAsNumber: true })} placeholder="Čistá hmotnosť" type="number" step={0.01} />
          {errors.clean && <p className=' text-red-500'>Chýba čistá hmotnosť</p>}
        </div>
        <div className='w-full flex justify-center items-center mt-4 gap-4'>
          <button className='submit-button' type="submit">Pridať</button>
          <button className='close-button' type="button" onClick={() => {
            close(false);
          }}>Zatvoriť</button>
        </div>
      </form>
    </div>
  )
}

export default IngredientForm;
