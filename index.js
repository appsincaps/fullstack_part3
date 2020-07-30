const express = require('express')
const app = express()

let persons = [
  { name: 'Arto Hellas', number: '040-123456', id: 1 },
  { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
  { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
  { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
]

app.use(express.json())

app.get('/', (req, res) => {
  res.send('<h1>Phonebook server running</h1>')
})

app.get('/info', (req, res) => {
  res.send(`<div>
              <p>Phonebook has info for ${persons.length} people.</p>
              <p>${new Date().toString()}</p>
            </div>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    res.json(person)
  } else {
    res.status(404).end('<div>No resource found</div>')
  }
})

app.post('/api/persons', (req, res) => {

  if (!req.body.name || !req.body.number) {
    res.status(400).json({
      error: 'Name or number missing'
    })
  } else if ( persons.find(person => person.name === req.body.name)) {
    res.status(400).json({
      error: 'Name must be unique'
    })
  } else {
    const person = {  name:   req.body.name,
                      number: req.body.number,
                      id:     Math.ceil(Math.random() * 1000000 + 4)
                    }
    persons.push(person)
    res.json(persons)
  }
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)
  res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})