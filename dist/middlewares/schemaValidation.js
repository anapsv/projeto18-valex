export default function validateSchema(schema) {
    return function (req, res, next) {
        var error = schema.validate(req.body).error;
        if (error) {
            throw { type: "schema_error", message: error.details.map(function (detail) { return detail.message; }) };
        }
        next();
    };
}
