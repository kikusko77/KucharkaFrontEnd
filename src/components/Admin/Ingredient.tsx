import { useState } from 'react';
import { createPortal } from 'react-dom';
import EditForm from './EditForm';

interface IngredientProps {
  id: number,
  name: string,
  clean: number,
  gross: number,
}

const Ingredient = ({id,name,clean,gross} : IngredientProps) => {
  const [edit, setEdit] = useState<boolean>(false);
  
  return (
    <div className='flex justify-between text-2xl mb-2 border-b-[1px] border-black p-2'>
      <div className='flex justify-center items-center'>{name}</div>
      <div className='flex gap-4 justify-center items-center'>
        <div className='min-w-12'>{gross}</div>
        <div className='min-w-12'>{clean}</div>
        <button onClick={_ => setEdit(prev => !prev)}><svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a.996.996 0 0 0 0-1.41l-2.34-2.34a.996.996 0 0 0-1.41 0l-1.83 1.83l3.75 3.75l1.83-1.83z"/></svg></button>
        
        {edit && createPortal(
          <EditForm close={setEdit} id={id} gross={gross} clean={clean} name={name}/>,
          document.body
        )}
      </div>
    </div>
  )
}

export default Ingredient