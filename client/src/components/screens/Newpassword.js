import React, {useState, useContext} from 'react'
import {Link, useHistory, useParams} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Login = () => {
	const history = useHistory()
	const [password, setPassword] = useState("")
	const {token} = useParams()
	const PostData =() => {
		fetch("/new-password", {
			method:"post",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				password,
				token
			})
		})
		.then(res=>res.json())
		.then(data=>{
			console.log(data)
			if(data.error){
				M.toast({html: data.error, classes:"#ef5350 red lighten-1"})
			}
			else{
				M.toast({html: data.message, classes: "#42a5f5 blue lighten-1"})
				history.push('/login')
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
				type="password"
				placeholder="Enter new password"
				value={password}
				onChange={(e)=>setPassword(e.target.value)}
				/>
				
				<i id="login-icon" className="material-icons" onClick={()=>PostData()}>fingerprint</i>
			</div>
		</div>

		)
}

export default Login

