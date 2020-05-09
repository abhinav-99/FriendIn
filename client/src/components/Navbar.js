import React, {useContext, useRef, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'
import {UserContext} from '../App'
import M from 'materialize-css'
const NavBar = ()=>{
  const {state, dispatch} = useContext(UserContext)
  const [search, setSearch] = useState('')
  const [userDetails, setUserDetails] = useState([])
  const searchModal = useRef(null)
  useEffect(() => {
    M.Modal.init(searchModal.current)
  }, [])
  const renderList = () => {
    if(state){
      return [
        <li key = "1"><i data-target="modal1" className="large material-icons modal-trigger" style={{color:'Black'}}>search</i></li>,
        <li key = "2"><Link to="/profile">Profile</Link></li>,
        <li key = "3"><Link to="/create">Create Post</Link></li>,
        <li key = "4"><Link to="/Feed">Feeds</Link></li>,
        <li key = "5"><Link to="/login"
            onClick={()=>{
            localStorage.clear()
            dispatch({type:'CLEAR'})
          }}
          >
          Logout
          </Link>
        </li>

      ]
    }
    else {
      return [
        <li key = "6"><Link to="/login">Login</Link></li>,
        <li key = "7"><Link to="/signup">Signup</Link></li>
      ]
    }
  }
  const fetchUsers = (query) => {
    setSearch(query)
    fetch('/search-users', {
      method: 'post',
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query
      })
    })
    .then(res => res.json())
    .then(result => {
        setUserDetails(result.user)
    })
  }
	return(
	<nav>
    <div className="nav-wrapper white">
      <Link to={state ? "/" : "/login"} className="brand-logo left">FriendIn</Link>
      <ul id="nav-mobile" className="right hide-on-med-and-down">
        {renderList()}
      </ul>
    </div>
    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
          <div className="modal-content">
            <input
              type="text"
              placeholder="search user"
              value={search}
              onChange={(e)=>fetchUsers(e.target.value)}
              />
              <ul className="collection">
              {
                userDetails.map(item => {
                  return (
                      <Link to={item._id != state._id ? "/profile/"+item._id : '/profile'}><li className="collection-item" onClick={() => {
                        M.Modal.getInstance(searchModal.current).close()
                        setSearch('')
                      }}>{item.email}</li></Link>

                  )
                })
              }
        
              </ul>
          </div>
          <div className="modal-footer">
            <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>CLEAR</button>
          </div>
    </div>
  </nav>)
}

export default NavBar