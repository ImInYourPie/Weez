const Joi = require("@hapi/joi");
const Comment = require("../model/schemas/comment.schema");

module.exports = {

    comment(req, res, next) {

        let { description } = req.body;

        const schema = {
            description: Joi.string(),
        };

        const { error, value } = Joi.validate(description, schema);

        // let error = false;
        if (error) {
            console.log(error)
            return res.status(400).send({ tagError: "O comentário que inseriu é inválido" });
        }
        else {
            next();
        }
    }
}
