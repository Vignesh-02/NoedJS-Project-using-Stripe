const express=require('express');
const keys = require('./config/keys');
const stripe=require('stripe')(keys.stripeSecretKey);
const bodyParser=require("body-parser");
const exphbs=require("express-handlebars");

// const keys = require('./config/keys');
// const stripe = requre('stripe')(keys.stripeSecretKey);
// const bodyParser = require('body-parser');
// const exphbs = require('express-handlebars');

const app = express();
              
// Handlebars Middleware
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

// Set Static Folder
app.use(express.static(`${__dirname}/public`));

// Index Route
app.get('/', (req, res) => {
  res.render('index',{
    stripePublishableKey:keys.stripePublishableKey
  });
});

app.get('/success', (req, res) => {
  res.render('success');
});

// Charge Route
// app.post('/create-checkout-session', async (req, res) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ['card'],
//     line_items: [
//       {
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: 'Stubborn Attachments',
//             images: ['https://i.imgur.com/EHyR2nP.png'],
//           },
//           unit_amount: 2000,
//         },
//         quantity: 1,
//       },
//     ],
app.post('/charge', (req, res) => {
  const amount = 325000;
  console.log(req.body);
  
  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
  .then(customer => stripe.charges.create({
    amount,
    description: 'Web Development Ebook',
    currency: 'inr',
    customer: customer.id
  }))
  .then(charge => res.render('success'));
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});