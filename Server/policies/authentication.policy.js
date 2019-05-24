const Joi = require("joi");
const User = require("../model/schemas/user.schema");

module.exports = {

    async register(req, res, next) {
        const schema = {
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().regex(
                new RegExp("^[a-zA-Z0-9]{6,32}$")
            ),
            passwordConfirm: Joi.string().valid(Joi.ref("password"))

        }

        const { error, value } = Joi.validate(req.body, schema);
        let hasUsernameError = false;
        let hasEmailError = false;
        let hasPasswordError = false;
        let hasPassConfirmError = false;

        const usernameExists = await User.find({ username: req.body.username });
        const emailExists = await User.find({ email: req.body.email });

        if (error || !!usernameExists || !!emailExists) {
            if (error) {
                switch (error.details[0].context.key) {
                    case "username":
                        hasUsernameError = "O nome de utlizador não é valido"
                    case "email":
                        hasEmailError = "O email não é valido"
                    case "password":
                        hasPasswordError = "A password tem de ser entre 6 e 32 caracteres e conter apenas minusculas, maiusculas e numeros"
                    case "passwordConfirm":
                        hasPassConfirmError = "As passwords não coincidem"
                        break
                }
            }
            if (usernameExists.length != 0) {
                hasUsernameError = "O nome de utilizador já se encontra registado"
            };
            if (emailExists.length != 0) {
                hasEmailError = "Este email já se encontra registado"
            };
            res.status(400).send({ hasUsernameError, hasEmailError, hasPasswordError, hasPassConfirmError })
        } else {
            next();
        }
    }

}