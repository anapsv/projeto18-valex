import joi from "joi";
var cardSchemaValidator = joi.object({
    type: joi.string().valid('groceries', 'restaurant', 'transport', 'education', 'health').required(),
    employeeId: joi.number().required()
});
export default cardSchemaValidator;
