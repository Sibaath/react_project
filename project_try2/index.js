const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const path       = require('path');
const jwt        = require('jsonwebtoken')

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));

const jwtSecret = "MySecretString"

let validatedData = {};

app.post("/validate", (req, res) => {
    const { name, age, dob, phone, email, gender, password } = req.body;
    console.log("Validation started");
    if (name_val(name) && email_val(email) && password_val(password) && phone_val(phone)) {
        validatedData = { name, age, dob, phone, email, gender };
        console.log(validatedData)
        res.redirect(`/home?name=${name}&age=${age}&dob=${dob}&phone=${phone}&email=${email}&gender=${gender}&password=${password}`);
    } else {
        res.status(400).json({ error: 'Please fill in all fields' });
    }
    console.log("Validation ended");
})

app.post('/signin',(req,res)=>
{
    const { name, age, dob, phone, email, gender, password } = req.body;
    if(name === "Sibaath" && password === "Sibaath@2004") //actually the password and name must be fetched from the database for demonstartion iam using harcoded name and password
        return res.json({
            token : jwt.sign({user : "Sibaath"},jwtSecret)
        })
    return res
            .status(401)
            .json({ message : "Invalid username / password "})
})

app.get("/employees",(req,res)=>
{
    let token = req.header('Authorization')
    if(!token)
     return res.status(401).send("no token")
    if(token.startsWith('Bearer '))
    {
        console.log("token")
        tokenValue = token.slice(7,token.length).trimLeft();
    }
    const verificationStatus = jwt.verify(tokenValue,jwtSecret)
    console.log(verificationStatus)
    if(verificationStatus.user === 'Sibaath')
    {
        return res.status(200).json({ message : " Access successfull to Employee Endpoint" })
    }
    return res;
})

function name_val(name) {
    var nameRegex = /^[A-Za-z\s\-]+$/;
    return nameRegex.test(name);
}

function email_val(email) {
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function password_val(password) {
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if(password.length < 8) 
        return false;
    else if(passwordRegex.test(password))
        return true;
    else
        return false; 
}

function phone_val(phone) {
    var phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
}

app.get('/home', (req, res) => {
    const { name, age, dob, phone, email, gender, password } = req.query;
    res.render('home', validatedData);
})

app.get('/', (req, res) => {
    res.render('index');
})

app.listen(3000, () => {
    console.log("Connection established");
})
