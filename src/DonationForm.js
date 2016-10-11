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

const mapStateToProps = ({ simpleform: { donation } }) => ({
  order: { description: 'donation' },
  isDisplayed: true,
  status: donation? donation.status : '',
  msg: donation? donation.msg :  false,
  spinner: donation? donation.spinner: false,
  formType: 'donation',

});

const mapDispatchToProps = (dispatch) => ({
  setStatus: (status = '', msg = false, spinner = false) => dispatch({
    type: 'simpleform/SET_STATUS',
    formType: 'donation',
    status,
    msg,
    spinner,
  }),
});

export default connect(mapStateToProps, mapDispatchToProps)(StripeForm);

