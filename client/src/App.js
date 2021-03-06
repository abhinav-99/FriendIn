import React, {useEffect, createContext, useContext, useReducer} from 'react'
import NavBar from './components/Navbar'
import "./App.css"
import {BrowserRouter, useHistory, Route, Switch} from 'react-router-dom'
import Home from './components/screens/Home'
import Login from './components/screens/Login'
import Signup from './components/screens/Signup'
import Profile from './components/screens/Profile'
import CreatePost from './components/screens/CreatePost'
import {reducer, initialState} from './reducers/userReducer'
import UserProfile from './components/screens/UserProfile'
import Feed from './components/screens/Feed'
import Reset from './components/screens/Reset'
import Newpassword from './components/screens/Newpassword'

export const UserContext = createContext()

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'))
    
    if(user){
      dispatch({type:'USER', payload:user})
    }
    else{
      if(!history.location.pathname.startsWith('/reset'))
      history.push('/login')
    }
  }, [])
  return(
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route exact path="/profile">
          <Profile />
        </Route>
        <Route path="/create">
          <CreatePost />
        </Route>
        <Route path="/profile/:userid">
          <UserProfile />
        </Route>
        <Route path="/Feed">
          <Feed />
        </Route>
        <Route exact path="/reset">
          <Reset />
        </Route>
        <Route path="/reset/:token">
          <Newpassword />
        </Route>
      </Switch>
      )
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <UserContext.Provider value={{state, dispatch}}>
    <BrowserRouter>
      <NavBar/>
      <Routing/>
    </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
