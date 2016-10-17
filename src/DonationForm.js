/*
 * Donation Redux Container
 *
 * Copyright © Roman Nosov 2016
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import { connect } from 'react-redux';
import StripeForm from './StripeForm';
const order = { description: 'donation' };
const mapStateToProps = ({ simpleform: { donation } }) => ({
  order,
  isDisplayed: true,
  formStatus: donation? donation.formStatus : '',
  formMsg: donation? donation.formMsg :  false,
  formName: 'donation',
});

const mapDispatchToProps = (dispatch) => ({
  setStatus: (formStatus = '', formMsg = false) => dispatch({
    type: 'simpleform/SET_STATUS',
    formName: 'donation',
    formStatus,
    formMsg,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StripeForm);

