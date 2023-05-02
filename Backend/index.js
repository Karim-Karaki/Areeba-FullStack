const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

app.get('/validate/:number', async (req, res) => {
    const config = {
        headers: {
            'apikey': '2MllYD5yB3chBIntmoFILkNg5YP4NZly'
        }
    };

    try {
        const response = await axios.get(`https://api.apilayer.com/number_verification/validate?number=${req.params.number}`, config);
        res.json(response.data);
    } catch (error) {
        console.error('error', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

app.get('/validate/countries', async (req, res) => {
  const config = {
    headers: {
      'apikey': '2MllYD5yB3chBIntmoFILkNg5YP4NZly'
    }
  };

  try {
    const response = await axios.get('https://api.apilayer.com/number_verification/countries', config);
    res.json(response.data);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ message: 'An error occurred' });
  }
});


app.listen(port, () => {
  console.log(`Mobile validation service listening at http://localhost:${port}`);
});
