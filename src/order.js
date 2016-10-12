export default function(order) {
  return {
    type: 'simpleform/checkout/ORDER_FILL',
    order,
  }
};
