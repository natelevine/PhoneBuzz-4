// Clears the data-fields on submit and sends the data to the server
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
  };

  $.get({
    url: '/call?phone=' + number + '&delay=' + delay,
    success: success
  });

  return false;
};

/*
  I toyed with the idea of using a light front-end framework like Backbone to deal with storing data
  and displaying many similar elements. Ultimately I decided it would be unnecessary extra overhead and syntax
  for such a simple app. However, towards the end I started to regret that due to the large amounts
  of jquery manipulation and workarounds I was using.
*/

// Make sure the DOM has fully loaded first
$(document).ready(function(){
  var parseData = function (calls) {
    $('#data-table').remove();
    $('h4').remove();
    if (calls.length > 0) {
      var $tableTitle = $('<h4>Previous Calls</h4>')
      $('.container').append($tableTitle,
        '<table id="data-table" class="table table-striped"> \
          <tr> \
            <th>Phone</th> \
            <th>Delay (s)</th> \
            <th>Date (UTC)</th> \
            <th>Digit Input</th> \
            <th>Re-Call</th> \
          </tr> \
        </table>');
      var $dataTable = $('#data-table');

      var $id,
          $number,
          $delay,
          $date,
          $digits,
          $button,
          $row

      for (var i = calls.length-1; i >= 0; i--) {
        var entry = calls[i];

        $row = $('<tr class="entry"></tr>');
        $number = $('<td></td>');
        $delay = $('<td></td>');
        $date = $('<td></td>');
        $digits = $('<td></td>');
        // Attach each entry's database id to the button so that it can be easily sent on replay
        $button = $('<td><button> \
                      <span class="glyphicon glyphicon-repeat" aria-hidden="true"> \
                      </span> \
                     </button></td>').data('id', entry.id);

        $number.text(entry.number);
        $delay.text(entry.delay);
        $date.text(entry.createdAt.substr(0, 19));
        $digits.text(entry.digits);

        $row.append($number, $delay, $date, $digits, $button);
        $dataTable.append($row);
      }
      $dataTable.on('click', 'button', function () {
        $.get({
          url: '/replay?id=' + $(this).parent().data('id')
        });
      });
    }
  };
  var populateTable = function () {
    $.get({
      url: '/data',
      success: parseData
    });
  };

  // Non-ideal way of getting new data when it pops up in the database
  setInterval(populateTable, 5000);
  populateTable();
});
