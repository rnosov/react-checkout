/*
 * StripeForm React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { Component, PropTypes } from 'react';
import RestForm from 'simpleform/dist/RestForm';

const
  propTypes = {
    schema: PropTypes.object.isRequired,
    setStatus: PropTypes.func.isRequired,
    testStripeKey: PropTypes.string.isRequired,
    stripeEndpoint: PropTypes.string.isRequired,
    liveStripeKey: PropTypes.string.isRequired,
    zeroAmountText: PropTypes.string,
    stripeNotLoadedText: PropTypes.string,
    waitText: PropTypes.string,
    errorText: PropTypes.string,
    successText: PropTypes.string,
    welcomeText: PropTypes.string,
  },
  defaultProps = {
    zeroAmountText: 'Your order is empty',
    stripeNotLoadedText: 'Unfortunately we are unable to process your payment',
    waitText: 'Processing your payment. Please wait ...',
    errorText: 'Houston, we have a problem!',
    successText: 'Your payment has been made',
    welcomeText: 'Please pay for your order',
  };

class StripeForm extends Component {

  state = {
    isStripe: typeof Stripe !== 'undefined',
  };

  static isStripeLoading = false;

  componentDidMount() {
    if (this.state.isStripe) return;
    if (typeof Stripe !== 'undefined') return this.setState({ isStripe: true });
    if (StripeForm.isStripeLoading) return;
    StripeForm.isStripeLoading = true;
    setTimeout( () => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v2/';
      script.async = true;
      script.onload = () => this.setState({ isStripe: typeof Stripe !== 'undefined' });
      document.body.appendChild(script);
    }, 500);
  }

  getStripeToken(card) {
    return new Promise((resolve, reject) => {
      Stripe.card.createToken(card, (status, { error, id }) => {
        if (error) {
          reject(error);
        } else {
          resolve(id);
        }
      });
    });
  }

  async handleFormWillFetch(form) {
    if (!this.state.isStripe)
      throw new Error( this.props.stripeNotLoadedText || 'Could not load Stripe.js' );
    const { number, cvc, exp, ...data } = form;
    const [ mode, stripeKey ] = process.env.NODE_ENV === 'production' ? ['live', this.props.liveStripeKey] : ['test', this.props.testStripeKey];
    Stripe.setPublishableKey(stripeKey);
    const token = await this.getStripeToken({ number, cvc, exp });
    return { mode, token, data: { ...data, ...this.props.order } };
  }

  async handleResponseReceived(response) {
    const payload = await response.json();
    if (!payload.success)
      throw new Error(payload.errorMessage || payload.message || 'Unknown error');
    return this.props.successText;
  }

  render() {
    if (!this.props.isDisplayed)
      return <div className="alert alert-info"><p>{this.props.zeroAmountText}</p></div>;
    for (let [key, field] of Object.entries(this.props.schema)) {
      //if (process.env.NODE_ENV !== 'production')
      //  this.props.schema[key].required =  false;
      if (typeof field.type === 'undefined') this.props.schema[key].type = false;
      if (this.state.isStripe) {
        switch (key) {
          case 'number':
            this.props.schema[key].required = true;
            this.props.schema[key].validate = Stripe.card.validateCardNumber;
            this.props.schema[key].onChange = (newVal, oldVal) => {
              if (newVal && oldVal && newVal.length>oldVal.length) {
                if (/^\d{4}$/.test(newVal) || /^\d{4}\s\d{4}$/.test(newVal) || /^\d{4}\s\d{4}\s\d{4}$/.test(newVal))
                  return newVal + ' ';
              }
              return /^[\d\s]*$/.test(newVal)?newVal:oldVal;
            };
            this.props.schema[key].type = 'tel';
            this.props.schema[key].autoComplete = 'cc-number';
            break;
          case 'cvc':
            this.props.schema[key].required = true;
            this.props.schema[key].validate = Stripe.card.validateCVC;
            this.props.schema[key].type = 'number';
            this.props.schema[key].autoComplete = 'cc-csc';
            break;
          case 'exp':
            this.props.schema[key].required = true;
            this.props.schema[key].validate = Stripe.card.validateExpiry;
            this.props.schema[key].type = 'tel';
            this.props.schema[key].autoComplete = 'cc-exp';
            this.props.schema[key].onChange = (newVal, oldVal) => {
              if (newVal && oldVal && newVal.length>oldVal.length) {
                if (/^\d{2}$/.test(newVal))
                  return newVal + '/';
                if (/^\d{2}\/\/$/.test(newVal))
                  return oldVal;
              }
              return /^[\d\/]*$/.test(newVal)?newVal:oldVal;
            };

            break;
        }
      }
    }
    return(
      <RestForm
        endpoint={ this.props.stripeEndpoint }
        schema={ this.props.schema }
        setStatus={ this.props.setStatus }
        onFormWillFetch={ ::this.handleFormWillFetch }
        onResponseReceived={ ::this.handleResponseReceived }
        submitText={ this.props.submitText }
        waitText={ this.props.waitText }
        errorText={ this.props.errorText }
        welcomeText={ this.props.welcomeText }
        status={ this.props.status }
        msg={ this.props.msg }
        spinner={ this.props.spinner }
      />
    );
  }

}

StripeForm.propTypes = propTypes;
StripeForm.defaultProps = defaultProps;

export default StripeForm;
