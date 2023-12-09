import Cookies from 'js-cookie';
interface Props {
  admin: boolean
}

const Index = ({admin}: Props) => {

  const logout = () => {
    Cookies.remove('authToken');
    window.location.assign('/');
  }
  
  return (
    <div className='border-b-[1px] flex justify-between px-4 items-center h-14 mb-4'>
      <a href='/'>
        <h3 className='text-4xl font-bold'>Kuchar</h3>
      </a>
      <div className="flex gap-4">
        {
          admin ?
            <>
              <a href="/">Ingrediencie</a>
              <a href="/calculator">Kalkulačka</a>
              <a href="/user-creation">Uživatelia</a>
              <a href="/recipe">Recepty</a>
            </>
          : <a href="/">Recepty</a>
        }
        <button onClick={logout}>Odhlásiť sa</button>
      </div>
    </div>
  )
}

export default Index