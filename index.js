const express = require('express')
const { response } = require('express')
const app = express()

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
    console.log(persons)
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
    res.send(`DELETE request for ${person.name}`)
    persons = persons.filter((person) => person.id !== id)
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Sever running on ${PORT}`)
})