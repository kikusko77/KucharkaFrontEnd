import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { getAuthCookie } from '../../utils/Auth';
import axios from 'axios';

interface IngredientFormProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
  gross: number,
  clean: number,
  name: string,
  id: number,
}

interface FormData {
  newName: string;
  newGross: number;
  newClean: number;
}


const token: string | undefined = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token || ''}`,
  }
}

const IngredientForm = ({close,id,name,gross,clean}: IngredientFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const deleteIngredient = async () => {
    try {
      const response = await axios.delete(`https://kucharkabackend.onrender.com/groceries/${id}`, config);
      if (response.status == 204) {
        toast.success("Potravina bola vymazaná");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/groceries')
      close(false);
    } catch {
      toast.error("Nepodarilo sa vymazať potravinu");
    }
  }
  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.put(`https://kucharkabackend.onrender.com/groceries`, {id, name: data.newName, gross: data.newGross, clean: data.newClean}, config);
      if (response.status === 200) {
        toast.success("Potravina bola upravená");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/groceries')
      close(false);
    } catch {
      toast.error("Nepodarilo sa upraviť potravinu");
    }
  }

  return (
    <div className='h-96 w-80 border-[1px] shadow-2xl border-blue-600 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 overflow-auto'>
      <div className='flex justify-center items-center text-4xl font-bold mt-4 ml-4'>{name}</div>
      <form onSubmit={handleSubmit((data) => { onSubmit(data); return Promise.resolve(); })} className='flex flex-col mt-4 gap-2'>
        <div className='flex flex-col px-4 text-xl'>
            <label className='font-light' htmlFor="Vaha">Názov</label>
            <input defaultValue={name} className='module-input-field' id="Nazov" {...register('newName', { required: true })} placeholder="Názov"/>
            {errors.newName && <p className=' text-red-500'>Chýba názov</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="Vaha">Hrubá hmotnosť</label>
          <input defaultValue={gross} className='module-input-field' id="Vaha" {...register('newGross', { required: true, valueAsNumber: true })} placeholder="Hrubá hmotnosť" type="number" step={0.01}/>
          {errors.newGross && <p className=' text-red-500'>Chýba hrubá hmotnosť</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="CistaVaha">Čistá hmotnosť</label>
          <input defaultValue={clean} className='module-input-field' id="CistaVaha" {...register('newClean', { required: true, valueAsNumber: true })} placeholder="Čistá hmotnosť" type="number" step={0.01}/>
          {errors.newClean && <p className=' text-red-500'>Chýba čistá hmotnosť</p>}
        </div>
        <div className='w-full flex justify-center items-center mt-4 gap-4'>
          <button className='submit-button' type="submit">Uložiť</button>
          <button className='close-button' type="button" onClick={() => {
            close(false);
          }}>Zatvoriť</button>
        </div>
      </form>
      <div className='flex justify-center items-center mt-2'>
        <button className='delete-button' onClick={deleteIngredient}>DELETE</button>
      </div>
    </div>
  )
}

export default IngredientForm;
