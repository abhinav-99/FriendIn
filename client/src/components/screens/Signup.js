import React, {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
	const history = useHistory()
	const [name, setName] = useState("")
	const [password, setPassword] = useState("")
	const [email, setEmail] = useState("")
	const [phone, setPhone] = useState("")
	const [image, setImage] = useState("")
	const [url, setUrl] = useState(undefined)
	useEffect(() => {
		if(url){
			uploadFields()
		}
	}, [url])
	const uploadProfilePic =() => {
		const data = new FormData()
		data.append('file', image)
		data.append('upload_preset', 'FriendIn')
		data.append('cloud_name', 'friendin')
		fetch('https://api.cloudinary.com/v1_1/friendin/image/upload', {
			method:'post',
			body:data
		})
		.then(res=>res.json())
		.then(data=>{
			setUrl(data.url)			//this will invoke setEffect
		})
		.catch(err=>{
			console.log(err)
		})
	}

	const uploadFields = () => {
		if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
			M.toast({html: 'Invalid email', classes:"#ef5350 red lighten-1"})
			return
		}
		fetch("/signup", {
			method:"post",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({
				name,
				password,
				email,
				pic:url,
				phone: '+91' + phone
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

	const PostData =() => {
		if(image){
			uploadProfilePic()
		}
		else{
			uploadFields()
		}
	}

	return(
		<div className="my-card">
			<div className="auth-card input-field">
				<h2 className="brand-logo">FriendIn</h2>
				<input
				type="text"
				placeholder="name"
				value={name}
				onChange={(e)=>setName(e.target.value)}
				/>
				<input
				type="text"
				placeholder="phone no."
				value={phone}
				onChange={(e)=>setPhone(e.target.value)}
				/>
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
				<div className="file-field input-field">
      			<div className="btn #64b5f6 blue darken-2">
        			<span>Upload Profile pic</span>
        			<input type="file"
        			onChange={(e)=>setImage(e.target.files[0])}
        			/>
      			</div>
      			<div className="file-path-wrapper">
        			<input className="file-path validate" type="text"/>
      			</div>
    			</div>
				<button className="btn waves-effect waves-light #64b5f6 blue darken-2"
				onClick={()=>PostData()}
				>
					Signup
				</button>
				<h5>
					<Link to="/Login">Already have an account?</Link>
				</h5>
			</div>
		</div>

		)
}

export default Signup