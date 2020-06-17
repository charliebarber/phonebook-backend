require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json()) 
// const morgan = require('morgan')
// app.use(morgan(
//     ':method :url :status :res[content-length] :response-time ms :data'
// ))
const cors = require('cors')
app.use(cors())
app.use(express.static(
    'build'
))
const Person = require('./models/person')
const { response } = require('express')


app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
})

app.get('/info', (req, res) => {
    Person.find({}).then((result) => {
      res.send(`
            <div>
                Phonebook has info for ${result.length} persons
                <p>${new Date()}</p>
            </div>
            `);
    });

})

app.get('/api/persons/:id', (req,res, next) => {
    Person.findById(req.params.id)
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

app.post('/api/persons', (req,res,next) => {
    const body = req.body
    // morgan.token('data', (req, res) => JSON.stringify(req.body))
    // if (!body.name || !body.number) {
    //     res.status(400).json({
    //         error: 'Missing name or person'
    //     })
    // }
    // if (persons.find((person) => person.name === body.name)) {
    //     res.status(400).json({
    //         error: 'Name already used'
    //     })
    // } else {
        const newPerson = new Person ({
            name: body.name,
            number: body.number,
            id: generateId()
        })
        newPerson.save()
        .then(savedPerson => {
            res.json(savedPerson)
        })
        .catch(error => next(error))

})

app.put('/api/persons/:id', (req, res, next) => {
    const updatedPerson = {
        name: req.body.name,
        number: req.body.number
    }


    Person.findByIdAndUpdate(req.params.id, updatedPerson, {new: true, runValidators: true, context: 'query'})
        .then(person => {
            res.json(person)
        })
        .catch(error => next(error))
})


const generateId = () => {
    min = 5
    max = 1000
    return Math.floor(Math.random() * (max-min)) + min
}

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Sever running on ${PORT}`)
})

const errorHandler = (error, req, res, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === 'ValidationError') {
        return res.status(400).json({error: error.message})
    }

    next(error)
}

app.use(errorHandler)