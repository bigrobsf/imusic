# iMusic Search

A toy app that accepts an artist or group name as a search parameter and checks the iTunes API for the ID of the artist. If found, it then looks up albums associated with the artist ID and returns them, displaying each album as a div in the browser ordered by release date.

Each album includes the number of tracks, which when clicked will display the track names ordered by track number.

## Pending Features

When the user clicks on an album's track name, the goal is to have a modal pop up that plays a preview of the track - but for now I have it just open a new tab that takes the user to the album on iTunes.
