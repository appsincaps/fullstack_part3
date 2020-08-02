require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

let persons = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

morgan.token('body', req => {
  const body = {  name: req.body.name,
                  number: req.body.number }
  return JSON.stringify(body)
})

app.use(express.static('build'))
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(cors())

/*
app.get('/', (req, res) => {
  res.send(`<h1>Phonebook server running on port ${PORT}</h1>`)
})
*/

app.get('/info', (req, res) => {
  res.send(`<div>
              <p>Phonebook has info for ${persons.length} people.</p>
              <p>${new Date().toString()}</p>
            </div>`)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    res.json(person)
  })
})

app.post('/api/persons', (req, res) => {

  const name = req.body.name
  const number = req.body.number

  if (!name || !number) {
    res.status(400).json({
      error: 'Name or number missing'
    })
  } else {
    const person = new Person ({ name, number })
    person.save().then( savedPerson => {
      res.json(savedPerson)
    })
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})