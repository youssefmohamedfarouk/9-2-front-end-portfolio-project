const mediaType = {
  all: "https://api.themoviedb.org/3/trending/all/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  movie:
    "https://api.themoviedb.org/3/trending/movie/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  tv: "https://api.themoviedb.org/3/trending/tv/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
};

const trending = document.querySelector(".trending");
const movieSearch = document.getElementById("movie-search");
const searchBar = document.getElementById("search-bar");

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
    console.log(elem.id);

    const posterContainer = document.createElement("div");
    posterContainer.classList.add("poster-container");

    const moviePoster = document.createElement("img");
    let movieImageLink = elem.poster_path
      ? elem.poster_path
      : "/8gdIKyQ587Gdo4XCc99usA1eyA7.jpg";
    moviePoster.setAttribute(
      "src",
      `https://image.tmdb.org/t/p/w220_and_h330_face/${movieImageLink}`
    );
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
      console.log(event);
      generateMovieDetails(event);
    });
}

function generateMovieDetails(event) {
  trending.innerHTML = `<img src='https://image.tmdb.org/t/p/w440_and_h660_face/${
    event.poster_path
  }' alt="${event.title}" id="detail-poster">
        <div><h3 id="detail-title">${event.title} (${event.release_date.slice(
    0,
    4
  )})</h3></div>
        <div><strong><em><p id="detail-tagline">"${
          event.tagline
        }"</p></strong></em></div>
        <div><strong><p id="detail-overview">${event.overview}</p><strong></div>
        <div><p id="detail-runtime"><strong>Runtime:</strong> ${
          event.runtime
        } minutes</p></div>
        <div><p id="detail-rating"><strong>Average Rating:</strong> ${
          event.vote_average
        }</p></div>`;
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

  //   let strQuery = searchBar.value.replace(" ", "%20");
  //   strQuery = strQuery.replace("?", "%3F");
  //   strQuery = strQuery.replace("!", "%21");
  //   strQuery = strQuery.replace(":", "%3A");
  //   strQuery = strQuery.replace(";", "%3B");
  //   strQuery = strQuery.replace("&", "%26");

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

// function generateSearchResults(movieArr) {
//   for (const elem of movieArr) {
//     const movieID = elem.id;

//     const movieTitle = elem.original_title
//       ? elem.original_title
//       : elem.original_name;
//     console.log(elem.id);

//     const posterContainer = document.createElement("div");
//     posterContainer.classList.add("poster-container");

//     const moviePoster = document.createElement("img");
//     moviePoster.setAttribute(
//       "src",
//       `https://image.tmdb.org/t/p/w220_and_h330_face/${movieImageLink}`
//     );
//     moviePoster.setAttribute("alt", `${elem.original_title}`);
//     moviePoster.classList.add("movie-poster");

//     const hoverText = document.createElement("p");
//     hoverText.classList.add("hover-text");
//     hoverText.textContent = `${movieTitle}`;

//     posterContainer.append(moviePoster);
//     posterContainer.append(hoverText);

//     trending.append(posterContainer);

//     makePosterClickable(posterContainer, movieID);
//   }
// }

// structure for poster links https://image.tmdb.org/t/p/w440_and_h660_face/jsoz1HlxczSuTx0mDl2h0lxy36l.jpg
