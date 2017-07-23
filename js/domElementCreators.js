/* jshint esversion: 6 */
/* jshint jquery: true */

// =============================================================================
// populate DOM with album info
function createAlbumCards(albums) {

  albums.forEach((album) => {
    let $infoDiv = $('<div>');
    $infoDiv.addClass('album');

    let $albumImg = $('<img>');
    $albumImg.addClass('album-cover');
    $albumImg.attr('src', album.artworkUrl);

    let $albumP = $('<p>');
    $albumP.text(album.name);
    $albumP.addClass('album-name');

    let $artistP = $('<p>');
    $artistP.text(album.artist);

    let $dateP = $('<p>');
    $dateP.text('Released: ' + album.releaseDate);

    let $numTracksP = $('<p>');
    $numTracksP.text('Tracks: ' + album.trackCount);
    $numTracksP.addClass('tracks');
    $numTracksP.on('click', (event) => {
      event.preventDefault();
      getTracks(album.id, event);
    });

    let $link = $('<a>');
    $link.attr('href', album.tracksUrl);
    $link.attr('target', '_blank');

    $link.append($albumImg);

    $infoDiv.append($link);
    $infoDiv.append($albumP);
    $infoDiv.append($artistP);
    $infoDiv.append($dateP);
    $infoDiv.append($numTracksP);

    let $cardDiv = $('<div>');
    $cardDiv.addClass('card');

    $cardDiv.append($infoDiv);
    $('.row').append($cardDiv);
  });
}

// =============================================================================
// populate album card div with track info and add listener to "close" track
// list
function createTrackDiv(tracks) {
  let $tracksDiv = $('<div>');
  $tracksDiv.addClass('track-names');

  if (tracks.length) {
    let $trackList = $('<ol>');

    // $trackList.attr('data-target', '#preview');
    // $trackList.attr('data-toggle', 'modal');
    // $trackList.addClass('track-modal');
    //
    // $('.track-modal').on('click', function(event){
    //   console.log('TRACK EVENT:', event.target);
    //   event.preventDefault();
    //   $('#preview').modal('show').find('.modal-body').load($(this).attr('href'));
    // });

    $tracksDiv.append($trackList);

    tracks.forEach((track) => {
      let $trackItem = $('<li>');
      let $trackLink = $('<a>');
      $trackLink.attr('href', track.trackViewUrl);
      // $trackLink.attr('href', track.previewUrl);
      $trackLink.attr('target', '_blank');
      $trackLink.text(track.name);
      $trackItem.append($trackLink);
      $trackList.append($trackItem);
    });

  } else {
    let $noTracksP = $('<p>');
    $noTracksP.text('Track list unavailable.');
    $tracksDiv.append($noTracksP);
  }

  let $removeP = $('<p>');
  $removeP.text('CLOSE');
  $removeP.addClass('remove-tracks');
  $removeP.on('click', (event) => {
    event.preventDefault();
    $('.track-names').remove();
  });

  $tracksDiv.append($removeP);

  return $tracksDiv;
}
