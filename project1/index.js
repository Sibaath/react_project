const express = require('express');
const path = require('path'); // Import the path module
const bodyparser = require('body-parser')
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(express.urlencoded({
    extended : true
}));

app.use(express.json())
app.set('view engine','ejs');
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.get('/',(req,res)=>
{
    res.render('index')
})

app.post('/validate',(req,res)=>
{
    console.log("Validation started")

    const { first_name, middle_name, last_name, dob, gender, ph_no, email, password } = req.body
    const emailValid = email_validate(email)
    const nameValid = name_validate(first_name)
    const phNoValid = ph_no_validation(ph_no)
    const passwordValid = password_validate(password)

    if (emailValid && nameValid && phNoValid && passwordValid) {
        console.log("validation complete");
            const userData = {
            first_name: first_name,
            middle_name: middle_name,
            last_name: last_name,
            dob: dob,
            gender: gender,
            ph_no: ph_no,
            email: email,
            password: password
        };
        // res.status(400).render('home',{ userData: userData });
        console.log("hello")
        res.render(`/home?userData=${JSON.stringify(userData)}`);
    } else {
        console.log("validation failed");
        res.status(400).json({ success: false, message: 'Invalid input fields' });
    }
})

function email_validate(email)
{
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function name_validate(name)
{
    var nameRegex = /^[A-Za-z\s\-]+$/;
    return nameRegex.test(name);
}

function ph_no_validation(phone_number){
    var phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone_number);
}

function password_validate(password)
{
    var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
    if(password.length <=8)
    return false;
    else if(passwordRegex.test(password))
    return true;
    else
    return true;
} 

app.get('/home', (req, res) => {
    const userData = JSON.parse(req.query.userData);
    res.render('home', { userData: userData });
});

app.listen(8001,()=>
{
    console.log("Connection established")
})
