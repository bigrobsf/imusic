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
        console.log(album);
        let $infoDiv = $('<div>');
        $infoDiv.addClass('album');

        let $albumImg = $('<img>');
        $albumImg.addClass('album-cover');
        $albumImg.attr('src', album.artworkUrl);

        let $albumP = $('<p>');
        $albumP.text(album.name);
        $albumP.css('font-weight', 'bold');

        let $artistP = $('<p>');
        $artistP.text(album.artist);

        let $dateP = $('<p>');
        $dateP.text('Released: ' + album.releaseDate);

        let $numTracksP = $('<p>');
        $numTracksP.text('Tracks: ' + album.trackCount);

        $infoDiv.append($albumImg);
        $infoDiv.append($albumP);
        $infoDiv.append($artistP);
        $infoDiv.append($dateP);
        $infoDiv.append($numTracksP);

        let $link = $('<a>');
        $link.attr('href', album.tracksUrl);
        $link.attr('target', '_blank');
        $link.append($infoDiv);

        let $cardDiv = $('<div>');
        $cardDiv.addClass('card');

        $cardDiv.append($link);

        // $cardDiv.append($infoDiv);

        $('main').append($cardDiv);
      });
    }).catch((error) => {
      console.log('Album retrieval error: ', error);
    });
  }).catch((error) => {
    console.log('Artist ID retrieval error:', error);
  });
} // end makeAjaxRequest








// end
