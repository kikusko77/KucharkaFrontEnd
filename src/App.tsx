import Admin from './components/Admin/Index'
import Calculator from './components/Calculator/Index'
import Navbar from './components/Navbar/Index'
import UserCreation from './components/UserCreation/Index'
import Recipes from './components/Recipes/Index'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Context from './utils/Context';
import Login from './components/Login/Page'
import { getAuthCookie } from './utils/Auth'
import { useEffect, useState } from 'react'
import jwt_decode from "jwt-decode";


function App() {
  const [authorized, setAuthorized] = useState<string>();
  const [admin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    const token = getAuthCookie();
    setAuthorized(token);
    if (token !== undefined) {
      const role: {role: string} = jwt_decode(token.split(" ")[1]);
      setAdmin(role['role'] === 'ADMIN');
    }
  },[])

  return (
    <>
      <BrowserRouter>
        {
          !authorized ? 
          <Login /> :
          <>
            <Navbar admin={admin}/>
            <Context>
            <main>
              <Routes>
                { admin
                ?
                  <>
                    <Route path="/" element={<Admin />} />
                    <Route path='/calculator' element={<Calculator />} />
                    <Route path='/user-creation' element={<UserCreation />} />
                    <Route path='/recipe' element={<Recipes />} />
                  </>
                : <Route path='/' element={<Recipes />} />
                }
                { !authorized ? <Route path='/login' element={<Login />} /> : null }
              </Routes>
            </main>
            </Context>
          </>
        }
      </BrowserRouter>
    </>
  )
}

export default App
