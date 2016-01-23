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

// Make sure the DOM has fully loaded first
$(document).ready(function(){
  $('#data-table').remove();
  var parseData = function (data) {
    if (data.length > 0) {
      var $tableTitle = $('<h4>Previous Calls</h4>')
      $('.container').append($tableTitle,
        '<table id="data-table" class="table table-striped"> \
          <tr> \
            <th>ID</th> \
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
          $entry

      for (var i = data.length-1; i >= 0; i--) {
        var entry = data[i];

        $id = $('<td></td>');
        $number = $('<td></td>');
        $delay = $('<td></td>');
        $date = $('<td></td>');
        $digits = $('<td></td>');
        $button = $('<td><button></button></td>');
        $entry = $('<tr class="entry"></tr>');

        $id.text(entry.id);
        $number.text(entry.number);
        $delay.text(entry.delay);
        $date.text(entry.createdAt.substr(0, 19));
        $digits.text(entry.digits);

        $entry.append($id, $number, $delay, $date, $digits, $button);
        $dataTable.append($entry);
      }
    }
  };

  $.get({
    url: '/data',
    success: parseData
  });
});

// index = database.length - 1;
// while(index >= 0) {
//   var tweet = database[index];
//   var timeString = getTimeStamp(tweet.created_at);
//
//   var $time = $('<div class="time"></div>');
//   var $name = $('<button class="name"></button>');
//   var $tweet = $('<div class="tweet"></div>');
//
//   $time.text(timeString);
//   $tweet.text(' ' + tweet.message);
//   $name.text('@' + tweet.user + ':');
//   $name.data("user", tweet.user);
//
//   $tweet.prepend($name);
//   $tweet.prepend($time);
//
//   $('#tweetbox').append($tweet);
//
//   index -= 1;
// }
