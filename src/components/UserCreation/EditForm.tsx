/* eslint-disable @typescript-eslint/no-misused-promises */
import React from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { mutate } from 'swr';
import { getAuthCookie } from '../../utils/Auth';
import axios from 'axios';
interface EditFormProps {
  close: React.Dispatch<React.SetStateAction<boolean>>
  password: string,
  name: string,
  id: number,
  role: string,
}

interface FormData {
  newPassword: number;
  newName: number;
}

const token = getAuthCookie();

const config = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }
}
const EditForm = ({close,id,name,role}: EditFormProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const deleteUser = async () => {
    try {
      const response = await axios.delete(`https://kucharkabackend.onrender.com/users/${id}`, config);
      if (response.status === 204) {
        toast.success("Uživateľ bol vymazaný");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/users')
      close(false);
    } catch {
      toast.error("Nepodarilo sa vymazať užívateľa");
    }
  }

  const onSubmit = async (data: FormData) => {
    try {
      const response = await axios.put(`https://kucharkabackend.onrender.com/users/${id}`, {id, name: data.newName, password: data.newPassword, role}, config);
      if (response.status === 200) {
        toast.success("Uživateľ bol upravený");
      } else {
        throw new Error();
      }
      await mutate('https://kucharkabackend.onrender.com/users')
      close(false);
    } catch {
      toast.error("Nepodarilo sa upraviť užívateľa");
    }
  }

  return (
    <div className='h-96 w-80 border-[1px] rounded-lg shadow-2xl border-blue-600 bg-white absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2'>
      <div className='flex justify-center items-center text-4xl font-bold mt-4'>{name}</div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col mt-4 gap-2'>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="menoEdit">Meno</label>
          <input defaultValue={name} className='module-input-field' id="menoEdit" {...register('newName', { required: true})} placeholder="Meno" />
          {errors.newName && <p className=' text-red-500'>Chýba meno</p>}
        </div>
        <div className='flex flex-col px-4 text-xl'>
          <label className='font-light' htmlFor="hesloEdit">Heslo</label>
          <input className='module-input-field' id="hesloEdit" {...register('newPassword', { required: true })} placeholder="Heslo" />
          {errors.newPassword && <p className=' text-red-500'>Chýba heslo</p>}
        </div>
        <div className='w-full flex justify-center items-center mt-4 gap-4'>
          <button className='submit-button' type="submit">Uložiť</button>
          <button className='close-button' type="button" onClick={() => {
            close(false);
          }}>Zatvoriť</button>
        </div>
      </form>
      <div className='flex justify-center items-center mt-2'>
        <button className='delete-button' onClick={deleteUser}>DELETE</button>
      </div>
    </div>
  )
}

export default EditForm;
