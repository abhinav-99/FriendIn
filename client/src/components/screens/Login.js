import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Login = () => {
	const {state, dispatch} = useContext(UserContext)
	const history = useHistory()
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")
	const PostData =() => {
		if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			M.toast({html: 'Invalid email', classes:"#ef5350 red lighten-1"})
			return
		}
		fetch("/signin", {
			method:"post",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				password,
				email
			})
		})
		.then(res=>res.json())
		.then(data=>{
			console.log(data)
			if(data.error){
				M.toast({html: data.error, classes:"#ef5350 red lighten-1"})
			}
			else{
				localStorage.setItem('jwt', data.token)
				localStorage.setItem('user', JSON.stringify(data.user))
				dispatch({type:'USER', payload:data.user})
				M.toast({html: 'Signedin successfully', classes: "#42a5f5 blue lighten-1"})
				history.push('/')
			}
		}).catch(err=>{
			console.log(err)
		})
	}
	return(
		<div className="my-card">
			<div className="auth-card input-field">
				<h2 className="brand-logo">FriendIn</h2>
				<input
				type="text"
				placeholder="email"
				value={email}
				onChange={(e)=>setEmail(e.target.value)}
				/>
				<input
				type="password"
				placeholder="password"
				value={password}
				onChange={(e)=>setPassword(e.target.value)}
				/>
				
				<i id="login-icon" className="material-icons" onClick={()=>PostData()}>fingerprint</i>
				<h5>
					<Link to="/signup">Don't have an account?</Link>
				</h5>
				<h6>
					<Link to="/reset">Forgot password?</Link>
				</h6>
			</div>
		</div>

		)
}

export default Login

