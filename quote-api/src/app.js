import express from 'express';
import iex_helper from'./iex_helper'

const
  app = express();
  // router = express.Router()
  // port = 3000

app.get('/', (req, res) => {
  res.send('GODSPEED!');
})

app.get('/search/:sym', (req, res) => {
  var sym = req.params.sym
  iex_helper.make_API_call('https://api.iextrading.com/1.0/tops/last?symbols=' + sym)
  .then(response => {
      res.header('Access-Control-Allow-Origin', '*');
      res.json(response)
  })
  .catch(error => {
      res.send(error)
  })
})

export default app
