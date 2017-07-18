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
  }).then(function(data) {
      console.log(data);
      let albums = [];

      for (var i = 0; i < data.results.length; i++) {
        let info = data.results[i];

        // eliminate singles with only one mix
        if (info.trackCount > 1) {
          let albumInfo = {};

          albumInfo.name = info.collectionName;
          albumInfo.artist = info.artistName;
          albumInfo.artworkUrl = info.artworkUrl100;
          albumInfo.releaseDate = info.releaseDate.split('T')[0];
          albumInfo.trackCount = info.trackCount;
          albumInfo.tracksUrl = `https://itunes.apple.com/lookup?id=${info.collectionId}&entity=song`;

          albums.push(albumInfo);
        }

      }

      console.log(albums);
      
  });

}








// end
