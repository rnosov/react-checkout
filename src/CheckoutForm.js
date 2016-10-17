/*
 * Checkout Redux Container
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import StripeForm from './StripeForm';

const mapStateToProps = ({ simpleform: { checkout } }, { amountPrefix = 'Pay £' }) => (
checkout?{
  submitText: `${amountPrefix}${(checkout.order.amount/100).toFixed(2)}`,
  isDisplayed: (!!checkout.order.amount) || checkout.formStatus ==='success',
  formStatus: checkout.formStatus,
  formMsg: checkout.formMsg,
  order: checkout.order,
  formName: 'checkout',
}
:{ isDisplayed: false, formName: 'checkout', }
);

const mapDispatchToProps = (dispatch) => ({
  setStatus: (formStatus = '', formMsg = false, spinner = false) => dispatch({
    type: 'simpleform/SET_STATUS',
    formName: 'checkout',
    formStatus,
    formMsg,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StripeForm);

