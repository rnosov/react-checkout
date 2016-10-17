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

describe('StripeForm', () => {
  it('renders a initial view', () => {
    const form = mount(
      <StripeForm
        Name="*|John Doe"
        Email="*email|john@example.com"
        Phone="tel|+44 207 123 4567"
        number="*|4242 4242 4242 4242|Long number on the front of your card|Card Number"
        cvc="*|123|The 3 digits to the right of the signature strip located on the back of your card|CVC"
        exp="*|10/17||Expiry Date"
        Address="*6|1 Chapel Hill, Heswall, BOURNEMOUTH, UK, BH1 1AA|The address where your order will be shipped"
        setStatus={ () => void 0 }
        testStripeKey="123"
        liveStripeKey="123"
        endpoint="https://example.com/"
        order={{ description: 'donation' }}
        isDisplayed={true}
      />
    );
    expect(form.html()).toMatchSnapshot();
  });
});
