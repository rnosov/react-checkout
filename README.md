# React Checkout

Quickly create simple React checkout forms styled with Bootstrap 4. Bank cards are processed via [stripe.js](https://stripe.com/docs/stripe.js) low level library. Redux store is used to maintain internal state. Forms are generated using the [SimpleForm](https://www.npmjs.com/package/simpleform) package. 

## Live Examples

Two examples are available: 

1. [Donation Form](https://www.solarleague.org/about/donations/)
2. [Checkout](https://www.solarleague.org/shop/macbook-case/) - In order to be able to see the Checkout page you'll need to add some products to the shopping cart. To do it, press green "Add to Cart" button. Next, press blue "Checkout" button.

## Introduction

`react-checkout` is a package that is designed to simplify the process of making bespoke checkout pages. Alternatively, you could use Stripe's own Checkout widget to process card payments but it does have some issues:
1. You will need to load the rather large Stripe Checkout library *before* you can even show Checkout UI. With this package you can bundle the checkout page with the rest of you code and show it immediately to the user. Low level lightweight `stripe.js` library will be asynchronously loaded only after `react-checkout` has been mounted.
2. Stripe Checkout widget will redirect you to the Stripe web site on mobile devices.
3. Stripe Checkout widget look and feel is not really customizable and it can look out of place on your web site. With this package you control checkout look and feel.
4. REST API handling is left as an exercise to the reader.

## Installation

To install the package run the following command in the command prompt:

```sh
npm install react-checkout bootstrap@4.0.0-alpha.4 redux react-redux --save

```

Import `react-checkout` in the component where you want to use it like so:

```javascript
import 'bootstrap/dist/css/bootstrap.css'; //import Bootstrap if you haven't done it already
import { createStore, combineReducers } from 'redux'; // redux store utilities
import reducers from '<project-path>/reducers'; // your other reducers
import Checkout, { formReducer, order } from 'react-checkout'; 
```

Create Redux store with the supplied reducer. `formReducer` must be on the `simpleform` key:

```javascript
const store = createStore(
  combineReducers({
    ...reducers,
    simpleform: formReducer
  })
);

```

Use `order` action to specify the particulars of the order:

```javascript
store.dispatch(order({ amount: 10000 }));
```

Somewhere in your component `render` method:

```javascript
<Checkout 
  store={store}
  testStripeKey="replace with your test public key"
  liveStripeKey="replace with your live public key"
  stripeEndpoint="https://example.com/"
  amountPrefix="Pay $"
  schema={{
    Name: {
      required: true,
      label: 'Name',
      placeholder: 'John Doe',
      autoComplete: 'cc-name',
    },
    Email: {
      required: true,
      type: 'email',
      placeholder: 'john@example.com',
    },
    Phone: {
      type: 'tel',
      placeholder: '+44 207 123 4567',
    },
    number: {
      label: 'Card Number',
      placeholder: '4242 4242 4242 4242',
      hint: 'Long number on the front of your card',
    },
    cvc: {
      label: 'CVC',
      placeholder: '123',
      hint: 'The 3 digits to the right of the signature strip located on the back of your card',
    },
    exp: {
      label: 'Expiry',
      placeholder: '10/17',
    },
    Address: {
      required: true,
      type: '6',
      placeholder: '1 Chapel Hill, Heswall, BOURNEMOUTH, UK, BH1 1AA',
      hint: 'The address where your order will be shipped',
    },
  }}
/>
```

## Documentation

### Checkout Properties

- `stripeEndpoint` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. RESTful API endpoint that should parse JSON object in the `POST` body. The JSON object sent will look like this:

```javascript
{
  mode: 'string',// either "live" or "test" depending whether application is in production or not 
  token: 'Stripe token', // Token returned by the Stripe API
  data: {} // Object which will have all key/value pairs from the form and the order object.
  // Card details will NOT be sent.
}
```
**Required**.
- `schema` **[object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)** [SimpleForm](https://www.npmjs.com/package/simpleform) Schema. It must have the following fields: `number`, `cvc` and `exp`. See examples above. **Required**.
- `testStripeKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. Public Stripe API test key. **Required**.
- `liveStripeKey` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. Public Stripe API live key. **Required**.
- `amountPrefix` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. Text displayed on the form submit button in front of the amount. Defaults to "Pay £". **Optional**.
- `zeroAmountText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. Text shown when Redux store order amount is zero. Defaults to "Your order is empty". **Optional**.
- `stripeNotLoadedText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)**. Error message shown when `stripe.js` library is not found. Defaults to "Unfortunately we are unable to process your payment". **Optional**.
- `waitText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is being uploaded . Defaults to "Processing your payment. Please wait ...". **Optional**.
- `errorText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form has encountered errors on upload. Defaults to "Houston, we have a problem!". **Optional**.
- `successText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is uploaded without any issues. Defaults to "Your payment has been made". **Optional**.
- `welcomeText` **[string](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String)** Text displayed when form is initially displayed. Defaults to "Please pay for your order". **Optional**.

### Checkout Children

Children are **ignored**.

### `order` Action

Use this redux action to specify the particulars of the order. It takes one argument which is a javascript object. This object must contain key/value pairs of which `amount` key is the most important one. It should be an integer number corresponding to gross amount of the transaction, in pence. Other key/value pairs will be passed along to the RESTful endpoint. For example:

```javascript
import { order } from 'react-checkout'; 
order({ amount: 10000, description: 'Green widget' }); // ordering a green widget which costs 100.00
```

### Universal Rendering

This component is compatible with universal or server side rendering (SSR).

## Step by Step Instructions

In order to start from scratch we'll use Facebook react starter kit called [Create React App](https://github.com/facebookincubator/create-react-app). In the command prompt type:


```sh
npm install -g create-react-app

create-react-app my-app
cd my-app/
npm install react-checkout bootstrap@4.0.0-alpha.4 redux react-redux --save
subl src/App.js #open with Sublime Text. Or use any other text editor.
npm start

```

Replace `src/app.js` file contents with the following code:

```javascript
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css'; //import Bootstrap if you haven't done it already
import { createStore, combineReducers } from 'redux'; // redux store utilities
import Checkout, { formReducer, order } from 'react-checkout'; 
import logo from './logo.svg';
import './App.css';

const store = createStore(
  combineReducers({
    simpleform: formReducer,
  })
);
store.dispatch(order({ amount: 10000 }));

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="container">   
          <Checkout 
            store={store}
            testStripeKey="replace with your test public key"
            liveStripeKey="replace with your live public key"
            stripeEndpoint="https://example.com/"
            amountPrefix="Pay $"
            schema={{
              Name: {
                required: true,
                label: 'Name',
                placeholder: 'John Doe',
                autoComplete: 'cc-name',
              },
              Email: {
                required: true,
                type: 'email',
                placeholder: 'john@example.com',
              },
              Phone: {
                type: 'tel',
                placeholder: '+44 207 123 4567',
              },
              number: {
                label: 'Card Number',
                placeholder: '4242 4242 4242 4242',
                hint: 'Long number on the front of your card',
              },
              cvc: {
                label: 'CVC',
                placeholder: '123',
                hint: 'The 3 digits to the right of the signature strip located on the back of your card',
              },
              exp: {
                label: 'Expiry',
                placeholder: '10/17',
              },
              Address: {
                required: true,
                type: '6',
                placeholder: '1 Chapel Hill, Heswall, BOURNEMOUTH, UK, BH1 1AA',
                hint: 'The address where your order will be shipped',
              },
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
```

Save it, then open [http://localhost:3000/](http://localhost:3000/) to see the result.

## Forking This Package

Clone the this repository using the following command:

```sh
git clone https://github.com/rnosov/react-checkout.git
```

In the cloned directory, you can run following commands:

### `npm install`

Installs required node modules

### `npm run build`

Builds the package for production to the `dist` folder

### `npm test`

Runs tests

## License

Copyright © 2016 Roman Nosov. This source code is licensed under the MIT license.
