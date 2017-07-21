/* jshint esversion: 6 */
/* jshint devel: true */
/* jshint node: true */
/* jshint browser: true */
/* jshint jquery: true */

'use strict';

$(function() {
  $('#search').focus();

  $('#search-btn').on('click', main);

  $('#search').on('keyup', (event) => {
    if (event.keyCode === '13') main();
  });
});

// main
function main() {
  let searchTerm = getSearchTerm();
  console.log("Search term is: ", searchTerm);
  if (searchTerm) {
    $('main').children().remove();
    makeAjaxRequest(searchTerm);
  }
}

// gets the search term entered into the search field, clears it, and restores focus
function getSearchTerm() {
  let searchTerm = $('#search').val();
  $('#search').val('');
  $('#search').focus();
  return searchTerm;
}



function makeAjaxRequest(searchTerm) {
  // performs ajax request to get artist id for artist searched
  $.ajax({
    url: `https://itunes.apple.com/search?term=${searchTerm}&entity=musicArtist&limit=1`,
    jsonp: "callback",
    dataType: "jsonp"
  }).then((artist) => {

    let artistId = artist.results[0].artistId;

    // performs ajax request to get albums for artist id found above
    $.ajax({
      url: `https://itunes.apple.com/lookup?id=${artistId}&entity=album`,
      jsonp: "callback",
      dataType: "jsonp"
    }).then((data) => {
      console.log('data: ', data);
      let albums = [];

      data.results.forEach((result) => {
        // eliminate singles with only one mix
        if (result.trackCount > 1) {
          let albumInfo = {};

          albumInfo.name = result.collectionName;
          albumInfo.artist = result.artistName;
          albumInfo.artworkUrl = result.artworkUrl100;
          albumInfo.releaseDate = result.releaseDate.split('T')[0];
          albumInfo.trackCount = result.trackCount;
          albumInfo.id = result.collectionId;
          // albumInfo.tracksUrl = `https://itunes.apple.com/lookup?id=${result.collectionId}&entity=song`;
          albumInfo.tracksUrl = result.collectionViewUrl;
          albums.push(albumInfo);
        }
      });

      // sort by release date
      albums.sort((b, a) => {
        var eleA = a.releaseDate;
        var eleB = b.releaseDate;

        return eleA > eleB ? 1 : eleA < eleB ? -1 : 0;
      });

      // console.log(albums);
      // populate DOM with album info
      albums.forEach((album) => {
        // console.log(album);
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

        // $cardDiv.append($link);

        $cardDiv.append($infoDiv);

        // $('main').append($cardDiv);
        $('.row').append($cardDiv);
      });
    }).catch((error) => {
      console.log('Album retrieval error: ', error);
    });
  }).catch((error) => {
    console.log('Artist ID retrieval error:', error);
  });
} // end makeAjaxRequest

function getTracks(id, event) {
  // performs ajax request to get artist id for artist searched
  $.ajax({
    url: `https://itunes.apple.com/lookup?id=${id}&entity=song`,
    jsonp: "callback",
    dataType: "jsonp"
  }).then((trackData) => {

    let tracks = [];

    trackData.results.forEach((track) => {
      if (track.kind === 'song') {
        let trackInfo = {};

        trackInfo.name = track.trackName;
        trackInfo.artist = track.artistName;
        trackInfo.previewUrl = track.previewUrl;
        trackInfo.releaseDate = track.trackViewUrl;
        trackInfo.trackNumber = track.trackNumber;
        tracks.push(trackInfo);
      }
    });

    // sort by track number
    tracks.sort((a, b) => {
      var eleA = a.trackNumber;
      var eleB = b.trackNumber;

      return eleA > eleB ? 1 : eleA < eleB ? -1 : 0;
    });

    let $tracksDiv = $('<div>');
    $tracksDiv.addClass('track-names');

    let $trackList = $('<ol>');
    $tracksDiv.append($trackList);

    tracks.forEach((track) => {
      let $trackItem = $('<li>');
      $trackItem.text(track.name);
      $trackList.append($trackItem);

      console.log(track);
    });

    $(event.target).parent().append($tracksDiv);

  });
}






// end
