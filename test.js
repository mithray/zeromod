const safeEval = require('safe-eval')
const Joi = require('@hapi/joi')

const validate = 'string()'
const schema = safeEval('Joi.' + validate,{Joi: Joi})

console.log(schema.validate(1).error.details[0].message)


