const express = require('express');
const app = express();
const mongoose = require("mongoose");
const User = require('./models/user')
const session = require('express-session')

mongoose.connect('mongodb://127.0.0.1:27017/LoginP', { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected !");
})

const ejsMate = require('ejs-mate')

app.set('view engine', 'ejs')
app.engine('ejs', ejsMate)


app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: "Some secret",
    resave: false,
    saveUninitialized: true
}))


app.get('/', (req, res) => {
    res.render('home')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.post('/signup', async (req, res) => {
    const { username, email, password } = req.body
    const check = await User.findOne({ username })
    if (check) {
        res.send('<div>User already exists <a href="/signup">Go back</a><div/>')
    }
    else {
        const updatedUser = new User({
            username,
            email,
            password
        })
        await updatedUser.save();
        req.session.user_id = user._id;
        res.redirect('/successs', { updatedUser })
    }

})

app.get('/success', (req, res) => {
    if (!req.session.user_id) {
        res.send('<div>You should Signup/Login <a href="/login">Go back</a><div />')
    } else {
        const updatedUser = User.findById(req.session.user_id)
        res.render('success', { updatedUser })
    }

})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    if (!user) {
        res.send('<div>User does not exist <a href="/login">Go back</a><div/>')
    } else {
        const foundP = user.password
        if (password === foundP) {
            const currentTime = new Date()
            const updates = { last_login: currentTime }
            const updatedUser = await User.findByIdAndUpdate(user._id, updates)
            await updatedUser.save()
            req.session.user_id = user._id;
            res.render('success', { updatedUser })
        } else {

            res.send('<div>Something is wrong, try again <a href="/login">Go back</a><div/>')
        }
    }

})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Live on Port 3000')
})