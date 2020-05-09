import React, {useState, useContext} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Reset = () => {
	const history = useHistory()
	const [email, setEmail] = useState("")
	const PostData =() => {
		if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			M.toast({html: 'Invalid email', classes:"#ef5350 red lighten-1"})
			return
		}
		fetch("/reset-password", {
			method:"post",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				email
			})
		})
		.then(res=>res.json())
		.then(data=>{
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
				type="text"
				placeholder="email"
				value={email}
				onChange={(e)=>setEmail(e.target.value)}
				/>
				<i id="login-icon" className="material-icons" onClick={()=>PostData()}>fingerprint</i>
			</div>
		</div>

		)
}

export default Reset

