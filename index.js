const express = require('express')
const { response } = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json()) 
const morgan = require('morgan')
app.use(morgan(
    ':method :url :status :res[content-length] :response-time ms :data'
))

let persons = [
    {
        "name": "Arto Hellas",
            "number": "040-123456",
                "id": 1
    },
    {
        "name": "Ada Lovelace",
            "number": "39-44-5323523",
                "id": 2
    },
    {
        "name": "Dan Abramov",
            "number": "12-43-234345",
                "id": 3
    },
    {
        "name": "Mary Poppendieck",
            "number": "39-23-6423122",
                "id": 4
    }
]

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (req, res) => {
    const date = new Date()
    res.send(`
    <div>
        Phonebook has info for ${persons.length} persons
        <p>${date}</p>
    </div>
    `)
})

app.get('/api/persons/:id', (req,res) => {
    const id = Number(req.params.id)
    const person = persons.find((person) => person.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person =  persons.find((person) => person.id === id)
    res.json(person)
    persons = persons.filter((person) => person.id !== id)
})

app.post('/api/persons', (req,res) => {
    const body = req.body
    if (!body.name || !body.number) {
        res.status(400).json({
            error: 'Missing name or person'
        })
    }
    if (persons.find((person) => person.name === body.name)) {
        res.status(400).json({
            error: 'Name already used'
        })
    } else {
        const newPerson = {
            name: body.name,
            number: body.number,
            id: generateId()
        }
        persons = persons.concat(newPerson)
        morgan.token('data', (req, res) => JSON.stringify(req.body))
        res.json(persons)
    }
})

const generateId = () => {
    min = 5
    max = 1000
    return Math.floor(Math.random() * (max-min)) + min
}

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Sever running on ${PORT}`)
})

