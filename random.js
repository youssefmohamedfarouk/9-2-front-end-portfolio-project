const trending = document.querySelector(".trending");

const genreDropdown = document.getElementById("genre");
const initialGenre = document.createElement("option");
initialGenre.value = "";
initialGenre.innerText = "---Please select a genre---";
genreDropdown.append(initialGenre);

const serviceDropdown = document.getElementById("service");
const initialService = document.createElement("option");
initialService.value = "";
initialService.innerText = "---Please select a streaming service---";
serviceDropdown.append(initialService);

const yearSelected = document.getElementById("year");

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "715caad85amsh7aa5f682ea5092fp16fc1cjsnaa96b8793391",
    "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
  },
};

const genres = {
  1: "Biography",
  2: "Film Noir",
  3: "Game Show",
  4: "Musical",
  5: "Sport",
  6: "Short",
  7: "Adult",
  12: "Adventure",
  14: "Fantasy",
  16: "Animation",
  18: "Drama",
  27: "Horror",
  28: "Action",
  35: "Comedy",
  36: "History",
  37: "Western",
  53: "Thriller",
  80: "Crime",
  99: "Documentary",
  878: "Science Fiction",
  9648: "Mystery",
  10402: "Music",
  10749: "Romance",
  10751: "Family",
  10752: "War",
  10763: "News",
  10764: "Reality",
  10767: "Talk Show",
};

const streamingServices = {
  netflix: "Netflix",
  prime: "Amazon Prime",
  disney: "Disney+",
  hbo: "HBO Max",
  hulu: "Hulu",
  peacock: "Peacock",
  paramount: "Paramount",
  starz: "Starz",
  showtime: "Showtime",
  apple: "Apple",
  mubi: "Mubi",
};

for (const [key, value] of Object.entries(genres)) {
  const genreOption = document.createElement("option");
  genreOption.value = key;
  genreOption.innerText = value;
  genreDropdown.append(genreOption);
}

for (const [key, value] of Object.entries(streamingServices)) {
  const streamingOption = document.createElement("option");
  streamingOption.value = key;
  streamingOption.innerText = value;
  serviceDropdown.append(streamingOption);
}

const searchForm = document.getElementById("search-criteria");
searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  console.log(serviceDropdown.value, year.value, genreDropdown.value);
  generateRandom();
});

// function getRandomMovie() {
//   fetch(
//     "https://api.themoviedb.org/3/movie/latest?api_key=b4f0bb28773f25e473bf71f5c8d38006&language=en-US"
//   )
//     .then((event) => {
//       return event.json();
//     })
//     .then((event) => {
//       console.log(Math.floor(Math.random() * event.id));
//       const movieID = Math.floor(Math.random() * event.id);
//       return movieID;
//     })
//     .catch((error) => console.log(error));
// }

function generateRandom() {
  if (!serviceDropdown.value) {
    trending.innerHTML = `<img src="./assets/aaaa.jpg" alt="why have you forsaken me" id="detail-poster">
        <div><h3 id="detail-title">You've angered him...</h3></div>
        <div id="description-container"><div><strong><em><p id="detail-tagline">Please select a streaming service before submitting</p></strong></em></div>`;
  } else {
    fetch(
      `https://streaming-availability.p.rapidapi.com/search/pro?country=us&service=${serviceDropdown.value}&type=movie&order_by=original_title&year_min=${year.value}&year_max=${year.value}&genre=${genreDropdown.value}&desc=true&language=en&output_language=en`,
      options
    )
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let randomSearchPage;
        if (!response.total_pages) {
          trending.innerHTML = `<img src="./assets/aaaa.jpg" alt="why have you forsaken me" id="detail-poster">
        <div><h3 id="detail-title">No results found...</h3></div>
        <div id="description-container"><div><strong><em><p id="detail-tagline">Please try changing your search criteria</p></strong></em></div>`;
        } else {
          if (response.total_pages > 1) {
            randomSearchPage = Math.floor(Math.random() * response.total_pages);
          } else {
            randomSearchPage = 1;
          }

          const yearParam = year.value ? `&year_min=${year.value}&year_max=${year.value}` : '';
          const genreParam = genreDropdown.value ? `&genre=${genreDropdown.value}` : '';

          fetch(
            `https://streaming-availability.p.rapidapi.com/search/pro?country=us&service=${serviceDropdown.value}&type=movie&order_by=original_title${yearParam}${genreParam}&page=${randomSearchPage}&desc=true&language=en&output_language=en`,
            options
          )
            .then((response) => response.json())
            .then((response) => {
              const randomMovieIndx = Math.floor(
                Math.random() * (response.results.length - 1)
              );
              getStreamingAvailability(
                response.results[randomMovieIndx].tmdbID
              );
            });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

function getStreamingAvailability(movieID) {
  fetch(
    `https://streaming-availability.p.rapidapi.com/get/basic?country=us&tmdb_id=movie%2F${movieID}&output_language=en`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      // return response;
      console.log(response);

      const posterFiveHundred = response.posterURLs[500] ? response.posterURLs[500] : "./assets/aaaa.jpg";

      trending.innerHTML = `<img src=${posterFiveHundred} alt="${
        response.title
      }" id="detail-poster">
          <div><h3 id="detail-title">${response.title} (${
        response.year
      })</h3></div>
          <div id="description-container"><div><strong><em><p id="detail-tagline">"${
            response.tagline || "In a world..."
          }"</p></strong></em></div>
          <div><strong><p id="detail-overview">${
            response.overview ||
            "Rob Schneider derp de derp. Derp de derpity derpy derp. Until one day, the derpa derpa derpaderp. Derp de derp. Da teedily dumb. From the creators of Der, and Tum Ta Tittaly Tum Ta Too, Rob Schneider is Da Derp Dee Derp Da Teetley Derpee Derpee Dumb. Rated PG-13."
          }</p><strong></div>
          <div><p id="detail-director"><strong>Directed by</strong> ${
            response.significants.length > 1
              ? response.significants.join(", ")
              : response.significants[0]
          } </p></div>
          <div><p id="detail-actors"><strong>Starring: </strong><br> ${
            response.cast.length > 1
              ? response.cast.join(", ")
              : response.cast[0]
          } </p></div>
          <div><p id="detail-runtime"><strong>Runtime:</strong> ${
            response.runtime
          } minutes</p></div>
          <div><p id="detail-rating"><strong>Average IMDB Rating:</strong> ${
            response.imdbRating
          }</p></div></div>`;
          if (response.streamingInfo) {
            const descriptionContainer = document.getElementById('description-container');
            descriptionContainer.innerHTML += "<div><p style='color: white'>Available to stream on: </p></div>"
            console.log(response.streamingInfo);
            const listOStreams = document.createElement("ul");
            listOStreams.setAttribute("id" , "stream-list")
            for (const [key, value] of Object.entries(response.streamingInfo)) {
              const streamLink = document.createElement('li');
              streamLink.innerHTML = `<p id="${key}-stream"><u><a href="${value.us.link}" style="color:white;text-decoration:underline">${streamingServices[key]}</a></u></p>`
              listOStreams.append(streamLink);
            }
            descriptionContainer.append(listOStreams);
          }
    })
    .catch((err) => console.error(err));
}
