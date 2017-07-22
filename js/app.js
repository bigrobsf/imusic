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

// =============================================================================
// calls search term function, clears results of previous search, launches ajax
// request for new search
function main() {
  let searchTerm = getSearchTerm();

  if (searchTerm) {
    $('.row').children().remove();
    makeAjaxRequest(searchTerm);
  }
}

// =============================================================================
// gets the search term entered into the search field, clears it, and restores
// focus
function getSearchTerm() {
  let searchTerm = $('#search').val();

  $('#search').val('');
  $('#search').focus();

  return searchTerm;
}

// =============================================================================
// makes ajax requests for artist id and related albums and populates ablums
// array with retrieved information
function makeAjaxRequest(searchTerm) {
  // gets artist id for artist searched
  $.ajax({
    url: `https://itunes.apple.com/search?term=${searchTerm}&entity=musicArtist&limit=1`,
    jsonp: "callback",
    dataType: "jsonp"
  }).then((artist) => {

    let artistId = artist.results[0].artistId;

    // gets albums for artist id found above
    $.ajax({
      url: `https://itunes.apple.com/lookup?id=${artistId}&entity=album`,
      jsonp: "callback",
      dataType: "jsonp"
    }).then((data) => {

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

      createAlbumCards(albums);

    }).catch((error) => {
      console.log('Album retrieval error: ', error);
    });
  }).catch((error) => {
    console.log('Artist ID retrieval error:', error);
  });
}

// =============================================================================
// performs ajax request to get artist id for artist searched and populates
// tracks array with track information
function getTracks(id, event) {
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
        trackInfo.trackViewUrl = track.trackViewUrl;
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

    let $tracksDiv = createTrackDiv(tracks, event);

    // only append div with list of tracks if not already present
    if ($(event.target).parent().has('div').length === 0) {
      $(event.target).parent().append($tracksDiv);
    }
  });
}






// end
