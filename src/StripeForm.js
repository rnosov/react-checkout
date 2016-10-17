/*
 * StripeForm React Component
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */
import React, { Component, PropTypes } from 'react';
import RestForm from 'redux-simpleform/dist/RestForm';

const
  propTypes = {
    endpoint: PropTypes.string.isRequired,
    testStripeKey: PropTypes.string.isRequired,
    liveStripeKey: PropTypes.string.isRequired,
    zeroAmountText: PropTypes.string,
    stripeNotLoadedText: PropTypes.string,
    waitText: PropTypes.string,
    errorText: PropTypes.string,
    successText: PropTypes.string,
    welcomeText: PropTypes.string,
    invalidFieldText: PropTypes.string,
    setStatus: PropTypes.func.isRequired,
  },
  defaultProps = {
    zeroAmountText: 'Your order is empty',
    stripeNotLoadedText: 'Unfortunately we are unable to process your payment',
    waitText: 'Processing your payment. Please wait ...',
    errorText: 'Houston, we have a problem!',
    successText: 'Your payment has been made',
    welcomeText: 'Please pay for your order',
    invalidFieldText: 'This field is invalid',
  };

class StripeForm extends Component {

  static isStripeLoading = false;

  static isStripe() {
    return typeof Stripe !== 'undefined';
  }

  componentDidMount() {
    if (StripeForm.isStripeLoading) return;
    StripeForm.isStripeLoading = true;
    setTimeout( () => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v2/';
      script.async = true;
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
    if (!StripeForm.isStripe())
      throw new Error( this.props.stripeNotLoadedText || 'Could not load Stripe.js' );
    const { number, cvc, exp, ...data } = form;
    const [ mode, stripeKey ] = process.env.NODE_ENV === 'production' ? ['live', this.props.liveStripeKey] : ['test', this.props.testStripeKey];
    Stripe.setPublishableKey(stripeKey);
    const token = await this.getStripeToken({ number, cvc, exp });
    return { mode, token, data: { ...data, ...this.props.order } };
  }

  async handleResponse(response) {
    const payload = await response.json();
    if (!payload.success)
      throw new Error(payload.errorMessage || payload.message || 'Unknown error');
    return this.props.successText;
  }

  handleParsingComplete(fields) {
    return fields.map( field => {
      switch (field.name) {
        case 'number': return field.merge({
          required: true,
          type: 'tel',
          autoComplete: 'cc-number',
          validate:  field => StripeForm.isStripe() ? this.validate(field, Stripe.card.validateCardNumber) : field,
          onChange: (newVal, oldVal) => {
            if (newVal && oldVal && newVal.length>oldVal.length) {
              if (/^\d{4}$/.test(newVal) || /^\d{4}\s\d{4}$/.test(newVal) || /^\d{4}\s\d{4}\s\d{4}$/.test(newVal))
                return newVal + ' ';
            }
            return /^[\d\s]*$/.test(newVal)?newVal:oldVal;
          },
        });
        case 'cvc': return field.merge({
          required: true,
          type: 'number',
          autoComplete: 'cc-csc',
          validate: field => StripeForm.isStripe() ? this.validate(field, Stripe.card.validateCVC) : field,
        });
        case 'exp': return field.merge({
          required: true,
          type: 'tel',
          autoComplete: 'cc-exp',
          validate: field => StripeForm.isStripe() ? this.validate(field, Stripe.card.validateExpiry) : field,
          onChange: (newVal, oldVal) => {
            if (newVal && oldVal && newVal.length>oldVal.length) {
              if (/^\d{2}$/.test(newVal))
                return newVal + '/';
              if (/^\d{2}\/\/$/.test(newVal))
                return oldVal;
            }
            return /^[\d\/]*$/.test(newVal)?newVal:oldVal;
          },
        });
      }
      return field;
    });
  }

  validate(field, func) {
    return func(field.value) ? field.set('error', false) : field
    .set('error', true)
    .set('message', this.props.invalidFieldText );
  }

  render() {
    const {
      testStripeKey,
      liveStripeKey,
      zeroAmountText,
      stripeNotLoadedText,
      amountPrefix,
      isDisplayed,
      invalidFieldText,
      order,
      ...props
    } = this.props;
    if (!isDisplayed)
      return <div className="alert alert-info"><p>{zeroAmountText}</p></div>;
    return(
      <RestForm
        {...props}
        onFormWillFetch={::this.handleFormWillFetch}
        onResponse={::this.handleResponse}
        onParsingComplete={::this.handleParsingComplete}
      />
    );
  }

}

StripeForm.propTypes = propTypes;
StripeForm.defaultProps = defaultProps;

export default StripeForm;
