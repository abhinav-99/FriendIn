const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const {JWT_SECRET} = require('../keys')
const reqLogin = require('../middleware/reqLogin')
const twilio = require('twilio');
// const nodemailer = require('nodemailer')
// const sendgridTransport = require('nodemailer-sendgrid-transport')


// const transporter = nodemailer.createTransport(sendgridTransport({
// 	auth:{
// 		api_key:''
// 	}
// }))
const accountSid = ''
const authToken = ''
const client = new twilio(accountSid, authToken)


router.post('/signup', (req, res) => {
	const {name, email, password, pic, phone} = req.body
	if(!email || !password || !name || !phone){
		return res.status(422).json({
			error: "please add all fields"
		})
	}
	User.findOne({email:email})
	.then((savedUser) => {
		if(savedUser){
			return res.status(422).json({
			error: "User already exists"
		})
		}
			bcrypt.hash(password, 12)
			.then(hashedpassword => {
				const user = new User({
				email: email,
				password: hashedpassword,
				name: name,
				pic: pic,
				phone: phone
			})
			user.save()
			.then(user => {
				// transporter.sendMail({
				// 		to:user.email,
				// 		from:'no-reply@friendin.com',
				// 		subject:'Welcome to FriendIn',
				// 		html:'<h1>You have Successfully Signed up</h1>'
				// 	})
				console.log(user)
				client.messages
  				.create({
     				body: 'Welcome to FriendIn',
     				from: '+12058437973',
     				to: user.phone
   				})
  				.then(message => {
  					console.log(message.sid)
  				})

  				res.json({
					message: 'Successfully saved'
				})
			})
			.catch(err => {
				console.log(err)
			})
			})
	})
	.catch(err => {
		console.log(err)
	})
})

router.post('/signin', (req, res) => {
	const {email, password} = req.body
	if(!email || !password){
		return res.status(422).json({
			error: "Field is empty"
		})
	}
	User.findOne({email: email})
	.then(savedUser => {
		if(!savedUser){
			return res.status(422).json({
				error: "Invalid email or password"
			})
		}
		bcrypt.compare(password, savedUser.password)
		.then(doMatch => {
			if(doMatch){
				const token = jwt.sign({
					_id: savedUser._id
				}, JWT_SECRET)
				const {_id, name, email, followers, following, pic, phone} = savedUser
				res.json({token, user:{_id, name, email, followers, following, pic, phone}})
			}
			else {
				return res.status(422).json({
				error: "Invalid email or password"
			})
			}
		})
		.catch(err => {
			console.log(err)
		})
	})
})

router.post('/reset-password', (req, res) => {
	crypto.randomBytes(32, (err, buffer) => {
		if(err){
			console.log(err)
		}
		const token = buffer.toString('hex')
		User.findOne({email:req.body.email})
		.then(user => {
			if(!user){
				return res.status(422).json({error: 'Unregistered email'})
			}
			user.resetToken = token
			user.expireToken = Date.now() + 3600000
			user.save().then(result => {
				transporter.sendMail({
					to: user.email,
					from: 'no-reply@friendin.com',
					subject: 'Password reset',
					html: `
					<p>You requested for password reset</p>
					<h5>click on this <a href="https://localhost:3000/reset/${token}">link</a> to reset password</h5>
					`
				})
				res.json({message: 'Check your email'})
			})
		})
	})
})


router.post('/new-password', (req, res) => {
	const newPassword = req.body.password
	const sentToken = req.body.token
	User.findOne({resetToken: sentToken, expireToken:{$gt:Date.now}})
	.then(user => {
		if(!user){
			return res.status(422).json({message:'Token Expired'})
		}
		bcrypt.hash(newPassword, 12).then(hashedpassword=>{
			user.password = hashedpassword
			user.resetToken = undefined
			user.expireToken = undefined
			user.save().then((savedUser) => {
				res.json({message:'Successfully updated!'})
			})
		})
	})
	.catch(err => console.log(err))
})

module.exports = router