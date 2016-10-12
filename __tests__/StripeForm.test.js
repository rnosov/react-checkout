/*
 * StripeForm Test Suite
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import StripeForm from '../src/StripeForm';

const schema = {
  Amount: {
    required: true,
    type: '£',
    hint: 'Amount of money that you wish to donate',
    placeholder: 20,
  },
  Frequency: {
    required: true,
    type: '[One off, Weekly, Monthly]',
    hint: 'How often do you wish to donate?'
  },
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
    hint: 'The 3 digits to the right of the signature strip located on the back of your card.',
  },
  exp: {
    label: 'Expiry',
    placeholder: '10/17',
  },
  Comment: {
    label: 'Leave a Note',
    type: '6',
    placeholder: 'Hello there, I\'d like to donate you some money',
  }
};

describe('StripeForm', () => {
  it('renders a initial view', () => {
    const form = mount(
      <StripeForm
        schema={schema}
        setStatus={ () => void 0 }
        testStripeKey="123"
        liveStripeKey="123"
        stripeEndpoint="https://example.com/"
        order={{ description: 'donation' }}
        isDisplayed={true}
      />
    );
    expect(form.html()).toMatchSnapshot();
  });
});
