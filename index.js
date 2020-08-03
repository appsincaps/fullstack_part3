require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

/*
let persons = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]
*/

morgan.token('body', req => {
  const body = {  name: req.body.name,
                  number: req.body.number }
  return JSON.stringify(body)
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id).then(person => {
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.post('/api/persons', (req, res, next) => {

  const name = req.body.name
  const number = req.body.number

  if (!name || !number) {
    res.status(400).json({
      error: 'Name or number missing'
    })
  } else {
    Person.find({}).then(persons => {
      let person = { name, number }
      const listed = persons.find(person=>person.name === name)
      if (listed) {
        Person.findByIdAndUpdate(listed.id, person, { new: true })
          .then(updatedPerson => {
            res.json(updatedPerson)
          })
          .catch(error=>next(error))
      } else {
        person = new Person (person)
        person.save().then( savedPerson => {
          res.json(savedPerson)
        })
      }
    })
  }
})


app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const name = req.body.name
  const number = req.body.number
  const person = { name, number }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(updatedPerson => {
      console.log(req.body, updatedPerson)
      res.json(updatedPerson)
    })
    .catch(error=>next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id).then( () => {
    res.status(204).end()
  })
  .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})