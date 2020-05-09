// abhi-kr
// MXLsTZDGkoYLT1EU
// mongodb+srv://<username>:<password>@cluster0-u53qh.mongodb.net/test?retryWrites=true&w=majority

const express = require('express')
//const cors = require('cors')
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const PORT = 5000
const app = express()

mongoose.connect(MONGOURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})
mongoose.connection.on('connected', () => {
	console.log('Connected to MongoDB')
})
mongoose.connection.on('error', (err) => {
	console.log('Error connecting MongoDB ', err)
})

require('./models/user')
require('./models/post')

//app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


app.listen(PORT, () => {
	console.log('Server running on ', PORT)
})