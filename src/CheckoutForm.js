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
  isDisplayed: (!!checkout.order.amount) || checkout.status ==='success',
  status: checkout.status,
  msg: checkout.msg,
  spinner: checkout.spinner,
  order: checkout.order,
  formType: 'checkout',
}
:{ isDisplayed: false, formType: 'checkout', }
);

const mapDispatchToProps = (dispatch) => ({
  setStatus: (status = '', msg = false, spinner = false) => dispatch({
    type: 'simpleform/SET_STATUS',
    formType: 'checkout',
    status,
    msg,
    spinner,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StripeForm);

