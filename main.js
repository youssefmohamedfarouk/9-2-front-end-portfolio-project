const mediaType = {
  all: "https://api.themoviedb.org/3/trending/all/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  movie:
    "https://api.themoviedb.org/3/trending/movie/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
  tv: "https://api.themoviedb.org/3/trending/tv/day?api_key=b4f0bb28773f25e473bf71f5c8d38006",
};

const trending = document.querySelector(".trending");

fetch(mediaType["all"])
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
  for (const elem of movieArray) {
    const movieTitle = elem.original_title ? elem.original_title : elem.original_name;
    console.log(movieTitle);

    const posterContainer = document.createElement('div');
    posterContainer.classList.add('poster-container');

    const moviePoster = document.createElement('img');
    moviePoster.setAttribute('src' , `https://image.tmdb.org/t/p/w220_and_h330_face/${elem.backdrop_path}`);
    moviePoster.setAttribute('alt' , `${elem.original_title}`);
    moviePoster.classList.add('movie-poster');

    const hoverText = document.createElement('p');
    hoverText.classList.add('hover-text');
    hoverText.textContent = `${movieTitle}`

    posterContainer.append(moviePoster);
    posterContainer.append(hoverText);

    trending.append(posterContainer);
  }
}

// structure for poster links https://image.tmdb.org/t/p/w440_and_h660_face/jsoz1HlxczSuTx0mDl2h0lxy36l.jpg
