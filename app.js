require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
require('./db/connection')
const user = require('./models/model')
const bcrypt = require('bcryptjs');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const {auth, isUnAuthenticated} = require('./middleware/auth')
let local = require('./middleware/setLocal')



const hostname = '127.0.0.1';
const port = process.env.PORT || 3000;

// setting Template engine as 'hbs'
app.set('view engine', 'ejs')

let store = new MongoDBStore({
    uri: process.env.DB_HOST,
    collection: 'mySessions'
});

// using middleware 
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000
    },
    store: store
}))
app.use(local)


// home page
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' })
})

// about page
app.get('/about', auth, (req, res) => {
    res.render('about', { title: 'About' })
})

// blog page
app.get('/blog', auth, (req, res) => {
    res.render('blog', { title: 'Blog' })
})

// register page
app.get('/register', isUnAuthenticated,  (req, res) => {
    res.render('register', { title: 'Register' })
})

// login page 
app.get('/login', isUnAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' })
})

// post request for register page
app.post('/register', isUnAuthenticated, async (req, res) => {
    try {
        const getUser = new user(req.body)
        const { name, email, phone, address, password, confirmpassword } = req.body;
        console.log(name, email, password)
        const errors = []

        if (!name || !email || !phone || !password || !confirmpassword) {
            errors.push({ msg: "Please fill all the field" })
        }
        if (password !== confirmpassword) {
            errors.push({ msg: "Password doesn't matched" })
        }
        if (password.length > 6) {
            errors.push({ msg: "Password should be 6 characters long" })
        }
        const isRegistered = await user.findOne({ email: email })
        if (isRegistered) {
            errors.push({ msg: "Email is already registered" })
            res.render('register', {
                title: "Register",
                errors,
                name,
                email,
                phone,
                password,
                confirmpassword
            })
        }

        if (errors.length > 0) {
            res.render('register', {
                title: 'Register',
                errors,
                name,
                email,
                phone,
                password,
                confirmpassword
            })
        } else {
            const saveUser = await getUser.save()
            res.render('login', { title: 'Login' })
        }

    } catch (error) {
        console.log(error)
    }

})

// post request for login page
app.post('/login', isUnAuthenticated, async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        let message = []

        let findUser = await user.findOne({ email: email })
        if (!findUser) {
            message.push({ msg: "Invalid Login Information" })
            res.render('login', {
                title: 'Login',
                message,
                email,
                password
            })
        }

        let isPassword = await bcrypt.compare(password, findUser.password)
        if (!isPassword) {
            message.push({ msg: "Invalid Login Information" })
            res.render('login', {
                title: 'Login',
                message,
                email,
                password
            })
        }

        req.session.isLoggedIn = true;
        req.session.user = findUser;


        if (findUser || isPassword) {
            res.redirect('/blog')
        }


    } catch (error) {
        console.log(error)
    }

})

// logout page
app.get('/logout', auth, (req, res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log(err)
        }
        return res.redirect('/login')
    })
})

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});