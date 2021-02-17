const express = require('express');
const Joi = require('joi');

const app = express();
app.use(express.json());
app.use(express.urlencoded()); //urlenocded allows the data from PUT and POST requests to be interpreted as arrays and strings

const items = [
  {id: '1', description: 'Wash up'},
  {id: '2', description: 'Walk dog'}
]

app.get('/', (req, res) => {
  res.sendFile(__dirname+'/frontend/index.html');
});

app.get('/todo', (req, res) => {
  res.send(items);
});

app.post('/todo', (req, res) => {
  //input validation on variables we assume are present
  //using Joi for validation, allows you to check input against a schema
  const schema = Joi.object({
    description: Joi.string().min(5).required()
  });
  const result = schema.validate(req.body);
  if (result.error) {
    //status code 400 = bad request
    //result.error includes an array of errors and details on them
    res.status(400).send(result.error.details[0].message);
    return;
  }
  //when working with a DB, assign the ID via the DB
  const item = {
    id: items.length+1,
    description: req.body.description
  };
  //add it to database
  items.push(item);
  res.sendFile(__dirname+"/frontend/todolist.html");
});

app.get('/items/:id', (req, res) => {
  var item = items.find(i => i.id === req.params.id);
  if (!item) res.status(404, "Item not found");
  res.send(item);
});

//This means that when deployed, the port can be assigned dynamically based on env variables (or just on port 3000 if not)
const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server listening on port "+port));

export {items};
