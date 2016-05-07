/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/apps/app.runtime.html
 * @see http://developer.chrome.com/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 500;
  var height = 320;

  chrome.app.window.create('index.html', {
    id: "helloWorldID",
    outerBounds: {
      width: width,
      height: height,
      left: Math.round((screenWidth-width)/2),
      top: Math.round((screenHeight-height)/2)
      }
    });
  });

  const eddystone_url = {
    type: 'eddystone_url',
    ids: ['https://www.codesmith.io/'],
    advertisedTxPower: -20
  };
  const eddystone_uid = {
  type: 'eddystone_uid',
  ids: ['2F234454F4911BA9FFA6', '000000000001'],
  advertisedTxPower: -20
  };
  let adType = $("input[name='eddystone']:checked").val();

  $('#status').append('Not connected');

  // $(document).on('ready', function() {
  //
  // });

  $("input[name='eddystone']").on('click', (event) => {
    // console.log(event);
    let adTypeText = $("input[name='eddystone']:checked").val();
    if (adTypeText === 'UID') {
      adType = eddystone_uid;
      $('#urlInput').prop("disabled", true);
    }
    else {
      adType = eddystone_url;
      $('#urlInput').prop("disabled", false);
    }
  });

  // Starts Beacon
  let registered_adv;
  $("#start").click((event) => {
      event.preventDefault();
      let url = $('#urlInput').val();

      if(adType === eddystone_url) {
          eddystone_url.ids = [url];
        }

      beacon.registerAdvertisement(adType).then(advertisement => {
        registered_adv = advertisement;
        $('#status').text("Connected.");
        console.log('Advertising: ' + advertisement);
        $("#stop").prop("disabled", false);
        $("#stop").css("background-color","red");
      }).catch(error => {
          $('#status').text("Issue connecting. Unable to establish an advertisement.");
          $('#status').append('<br>');
          $('#status').append(error.message);
          console.log(error.message)});
    });

  //Stops Beacon
  $("#stop").click((event) => {
      event.preventDefault();

      registered_adv.unregisterAdvertisement().then(() => {
        $('#status').text("Advertisement unregistered successfully.");
        $("#stop").css("background-color","#eee");
          console.log('Advertisement unregistered successfully.');
      }).catch(error => {
          console.log('Not connected, therefore could not unregister.');
          console.log(error.message)});
  });
