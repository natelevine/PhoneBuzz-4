var submitForm = function() {
  var form = $('#main-form')
  var phoneField = form.children('.phone-field');
  var delayField = form.children('.delay-field');

  var number = phoneField.val();
  var delay = delayField.val();

  phoneField.val('');
  delayField.val('');

  var success = function(data) {
    console.log('successfully sent request to /call: ', data);
  }
  $.get({
    url: '/call?phone=' + number + '&delay=' + delay,
    success: success
  });

  return false;
};

// This isn't necessary yet!
// $(document).ready(function(){
//
//
// });
