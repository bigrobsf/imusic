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
  if (searchTerm) makeAjaxRequest(searchTerm);
}

// gets the search term entered into the search field, clears it, and restores focus
function getSearchTerm() {
  let searchTerm = $('#search').val();
  $('#search').val('');
  $('#search').focus();
  return searchTerm;
}

// performs ajax request to get albums by artist searched
function makeAjaxRequest(searchTerm) {
  $.ajax({
      url: `https://itunes.apple.com/search?term=${searchTerm}&entity=album&limit=25`,
      jsonp: "callback",
      dataType: "jsonp"
  }).then((data) => {
      // console.log(data);
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
          albumInfo.tracksUrl = `https://itunes.apple.com/lookup?id=${result.collectionId}&entity=song`;

          albums.push(albumInfo);
        }
      });

      // console.log(albums);

      albums.forEach((album) => {
        console.log(album);
        let $infoDiv = $('<div>');
        $infoDiv.addClass('album');

        let $newImg = $('<img>');
        $newImg.addClass('album-cover');
        $newImg.attr('src', album.artworkUrl);

        let $albumP = $('<p>');
        $albumP.text(album.name);
        $albumP.css('font-weight', 'bold');

        let $artistP = $('<p>');
        $artistP.text(album.artist);

        let $dateP = $('<p>');
        $dateP.text('Released: ' + album.releaseDate);

        let $numTracksP = $('<p>');
        $numTracksP.text('Tracks: ' + album.trackCount);

        $infoDiv.append($newImg);
        $infoDiv.append($albumP);
        $infoDiv.append($artistP);
        $infoDiv.append($dateP);
        $infoDiv.append($numTracksP);

        let $cardDiv = $('<div>');
        $cardDiv.addClass('card');

        $cardDiv.append($infoDiv);

        $('main').append($cardDiv);
      });
  });

} // end makeAjaxRequest








// end
