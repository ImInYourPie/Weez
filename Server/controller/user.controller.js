const bcrypt = require("bcrypt");
const expressValidator = require("express-validator");
let User = require("../model/schemas/user.schema.js");

function registerUser(req, res) {
    // Get inputs
    const username = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    
    // Validate inputs
    req.checkBody("username", "É necessário inserir um nome de utilizador.").notEmpty();
    req.checkBody("email", "É necessário inserir um endereço de email.").notEmpty();
    req.checkBody("email", "É necessário inserir um endereço de email válido.").isEmail();
    req.checkBody("password", "É necessário inserir uma password").notEmpty();
    req.checkBody("passwordConfirm", "As passwords não coincidem.").equals(req.body.password);
    
    
    let errors = req.validationErrors();
    
    if(errors){
        res.status(500).send(errors);
    } else {
        // If valide create new User
        let newUser = new User({
            username: username,
            email: email,
            password: password,
            profilePic: "",
            upVotes: 0,
            downVotes: 0,
            experience: 0
        });
        
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save((err) => {
                    if(err){
                        console.log(err);
                        return;
                    } else {
                        req.flash("success", "Registo efetuado com successo!");
                        res.status(200).send();
                    }
                })
            })
        })
    }
    
    // Save User

}


module.exports = registerUser;
