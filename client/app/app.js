var submitForm = function() {
  var form = $('#main-form')
  var field = form.children('.field');
  var number = field.val();

  field.val('');
  var success = function(data) {
    console.log('it worked! ', data);
  }

  $.get({
    url: '/call?phone=' + number,
    success: success
  });

  return false;
};

$(document).ready(function(){


});
