const express = require('express')
const app = express()

let persons = [
  { name: 'Arto Hellas', number: '040-123456' },
  { name: 'Ada Lovelace', number: '39-44-5323523' },
  { name: 'Dan Abramov', number: '12-43-234345' },
  { name: 'Mary Poppendieck', number: '39-23-6423122' }
]

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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})