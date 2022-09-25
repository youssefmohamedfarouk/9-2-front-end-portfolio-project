const mediaType = {
  all: "https://api.themoviedb.org/3/trending/all/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  movie:
    "https://api.themoviedb.org/3/trending/movie/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  tv: "https://api.themoviedb.org/3/trending/tv/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
};

const trending = document.querySelector(".trending");
const movieSearch = document.getElementById("movie-search");
const searchBar = document.getElementById("search-bar");
const trendingNowH2 = document.getElementById("trending-h2");

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

const options = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": "715caad85amsh7aa5f682ea5092fp16fc1cjsnaa96b8793391",
    "X-RapidAPI-Host": "streaming-availability.p.rapidapi.com",
  },
};

fetch(mediaType["movie"])
  .then((event) => {
    // console.log(event.json());
    return event.json();
  })
  .then((movieObj) => {
    displayMovie(movieObj.results);
  })
  .catch((err) => {
    console.log(err);
  });

function displayMovie(movieArray) {
  trending.innerHTML = "";
  for (const elem of movieArray) {
    const movieID = elem.id;

    const movieTitle = elem.original_title
      ? elem.original_title
      : elem.original_name;
    // console.log(elem.id);

    const posterContainer = document.createElement("div");
    posterContainer.classList.add("poster-container");

    const moviePoster = document.createElement("img");
    // console.log(elem);

    let movieImageLink = elem.poster_path || elem.backdrop_path;
    if (movieImageLink) {
      moviePoster.setAttribute(
        "src",
        `https://image.tmdb.org/t/p/w220_and_h330_face/${movieImageLink}`
      );
    } else {
      moviePoster.setAttribute("src", `./assets/aaaa but smaller.jpg`);
    }

    moviePoster.setAttribute("alt", `${elem.original_title}`);
    moviePoster.classList.add("movie-poster");

    const hoverText = document.createElement("p");
    hoverText.classList.add("hover-text");
    hoverText.textContent = `${movieTitle}`;

    posterContainer.append(moviePoster);
    posterContainer.append(hoverText);

    trending.append(posterContainer);

    makePosterClickable(posterContainer, movieID);
  }
}

function makePosterClickable(movieContainer, movieID) {
  movieContainer.addEventListener("click", (event) => {
    trending.innerHTML = "";
    trendingNowH2.textContent = "Details";

    getMovieByID(movieID);
  });
}

function getMovieByID(id) {
  fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=b4f0bb28773f25e473bf71f5c8d38006&language=en-US`
  )
    .then((event) => {
      return event.json();
    })
    .then((event) => {
      // console.log(event);
      // getStreamingAvailability(event.id);
      // generateMovieDetails(event);
      fetch(
        `https://streaming-availability.p.rapidapi.com/get/basic?country=us&tmdb_id=movie%2F${event.id}&output_language=en`,
        options
      ).then(getStreamingAvailability(event.id))
      .catch(generateMovieDetails(event))
    });
}

function generateMovieDetails(event) {
  // const streamingAvail = getStreamingAvailability(event.id);
  const posterLink = event.poster_path ? `https://image.tmdb.org/t/p/w440_and_h660_face/${event.poster_path}` : "./assets/aaaa.jpg";

  trending.innerHTML = `<img src=${posterLink} alt="${event.title}" id="detail-poster">
        <div><h3 id="detail-title">${event.title} (${event.release_date.slice(
    0,
    4
  )})</h3></div>
        <div id="description-container"><div><strong><em><p id="detail-tagline">"${
          event.tagline || "In a world..."
        }"</p></strong></em></div>
        <div><strong><p id="detail-overview">${
          event.overview ||
          "Rob Schneider derp de derp. Derp de derpity derpy derp. Until one day, the derpa derpa derpaderp. Derp de derp. Da teedily dumb. From the creators of Der, and Tum Ta Tittaly Tum Ta Too, Rob Schneider is Da Derp Dee Derp Da Teetley Derpee Derpee Dumb. Rated PG-13."
        }</p><strong></div>
        <div><p id="detail-runtime"><strong>Runtime:</strong> ${
          event.runtime
        } minutes</p></div>
        <div><p id="detail-rating"><strong>Average Rating:</strong> ${
          event.vote_average
        }</p></div></div>`;
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

      trending.innerHTML = `<img src=${response.posterURLs[500]} alt="${
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
          response.cast.length > 1 ? response.cast.join(", ") : response.cast[0]
        } </p></div>
        <div><p id="detail-runtime"><strong>Runtime:</strong> ${
          response.runtime
        } minutes</p></div>
        <div><p id="detail-rating"><strong>Average IMDB Rating:</strong> ${
          response.imdbRating
        }</p></div></div>`;
        if (Object.keys(response.streamingInfo).length) {
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
    .catch((err) => isGetStreamingBroken = true);
}

movieSearch.addEventListener("submit", (event) => {
  event.preventDefault();

  const chars = {
    " ": "%20",
    "?": "%3F",
    "!": "%21",
    ":": "%3A",
    ";": "%3B",
    "&": "%26",
  };
  let strQuery = searchBar.value;
  strQuery = strQuery.replace(/[ ?!:;&]/g, (m) => chars[m]);
  console.log(strQuery);

  console.log(strQuery);

  if (!strQuery) {
    window.alert("Please enter a search result");
  }
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=b4f0bb28773f25e473bf71f5c8d38006&language=en-US&query=${strQuery}&page=1&include_adult=false`
  )
    .then((event) => {
      return event.json();
    })
    .then((event) => {
      console.log(event.results);
      displayMovie(event.results);
    });
});

// structure for poster links https://image.tmdb.org/t/p/w440_and_h660_face/jsoz1HlxczSuTx0mDl2h0lxy36l.jpg
