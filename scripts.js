const apiKey = '4ba0b307'; // Replace with your actual API key
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

// Check if the search query is stored in local storage and set the input value accordingly
if (localStorage.getItem('searchQuery')) {
  searchInput.value = localStorage.getItem('searchQuery');
}

let currentPage = 1;
let totalResults = 0;
const resultsPerPage = 10;

// Add an input event listener to the search input
searchInput.addEventListener('input', () => {
  currentPage = 1;
  searchResults.innerHTML = '';

  // Store the search query in local storage
  localStorage.setItem('searchQuery', searchInput.value.trim());

  // Delay the API request by 300ms to avoid making too many requests while the user is typing
  setTimeout(() => {
    fetchMovies(searchInput.value.trim());
  }, 300);
});

searchForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    currentPage = 1;
    searchResults.innerHTML = '';

    // Store the search query in local storage
    localStorage.setItem('searchQuery', searchInput.value.trim());

    await fetchMovies(searchInput.value.trim());
  });

async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(query)}&page=${currentPage}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    totalResults = parseInt(data.totalResults);

    if (data.Search && data.Search.length > 0) {
      displayMovies(data.Search);
      addPaginationButtons();
    } else {
      searchResults.innerHTML = '<p>No results found.</p>';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

function displayMovies(movies) {
  movies.forEach((movie) => {
    const movieCard = document.createElement('div');
    movieCard.innerHTML = `<h3 onclick="fetchMovieDetails('${movie.imdbID}')">${movie.Title}</h3>
    <p>Year: ${movie.Year}</p>`;
    movieCard.setAttribute('id', movie.imdbID);
    searchResults.appendChild(movieCard);
  });
}

function addPaginationButtons() {
  const totalPages = Math.ceil(totalResults / resultsPerPage);

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination';

  if (currentPage > 1) {
    const prevButton = createPaginationButton('Prev', currentPage - 1);
    paginationContainer.appendChild(prevButton);
  }

  if (currentPage < totalPages) {
    const nextButton = createPaginationButton('Next', currentPage + 1);
    paginationContainer.appendChild(nextButton);
  }

  searchResults.appendChild(paginationContainer);
}

function createPaginationButton(label, page) {
  const button = document.createElement('button');
  button.innerText = label;
  button.addEventListener('click', () => {
    currentPage = page;
    searchResults.innerHTML = '';
    fetchMovies(searchInput.value.trim());
  });
  return button;
}


async function fetchMovieDetails(imdbId) {
const url = `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbId}`;
try {
    const response = await fetch(url);
    const data = await response.json();


//create a new div element with all the additional movie details and an option to rate out of 5
const movieDetails = document.createElement('div');
movieDetails.innerHTML = `<p>Rated: ${data.Rated}</p>
<p>Released: ${data.Released}</p>
<p>Runtime: ${data.Runtime}</p>
<p>Genre: ${data.Genre}</p>
<p>Director: ${data.Director}</p>
<p>Writer: ${data.Writer}</p>
<p>Actors: ${data.Actors}</p>
<p>Plot: ${data.Plot}</p>
<p>Language: ${data.Language}</p>
<p>Country: ${data.Country}</p>
<p>Awards: ${data.Awards}</p>
<p>Metascore: ${data.Metascore}</p>
<p>imdbRating: ${data.imdbRating}</p>
<p>imdbVotes: ${data.imdbVotes}</p>
<p>imdbID: ${data.imdbID}</p>
<p>Type: ${data.Type}</p>
<p>DVD: ${data.DVD}</p>
<p>BoxOffice: ${data.BoxOffice}</p>
<p>Production: ${data.Production}</p>
<p>Website: ${data.Website}</p>
<p>Response: ${data.Response}</p>`;

//if the movie has already been rated, display the rating and an option to change it else display an option to rate the movie
if (localStorage.getItem(imdbId)) {
    const rating = localStorage.getItem(imdbId);
    movieDetails.innerHTML += `<p id ="your_rating${imdbId}">Your rating: ${rating}</p>
    <label for="rating">Change your rating out of 5:</label>
    <input type="number" id="rating${imdbId}" name="rating" min="1" max="5">
    <button onclick="rateMovie('${imdbId}')">Rate</button>`;
} else {
    movieDetails.innerHTML += `<p id ="your_rating${imdbId}">You have not rated this movie yet.</p>
    <label for="rating">Rate this movie out of 5:</label>
    <input type="number" id="rating${imdbId}" name="rating" min="1" max="5">
    <button onclick="rateMovie('${imdbId}')">Rate</button>`;
}

//add a button to close the movie details
movieDetails.innerHTML += `<p><button onclick="closeMovieDetails('${imdbId}')">Close</button></p>`;



//append the new div element to the movie card
const movieCard = document.getElementById(imdbId);
movieCard.appendChild(movieDetails);

} catch (error) {
    console.error('Error fetching movie details:', error);
}
}

//create a function to rate the movie out of 5 and add the rating to the movie card and store it in local storage
function rateMovie(imdbId) {

    const rating = document.getElementById('rating' + imdbId).value;


    const yourRating = document.getElementById('your_rating' + imdbId);
    yourRating.innerHTML = `Your rating: ${rating}`;
    localStorage.setItem(imdbId, rating);
}

//create a function to close the movie details
function closeMovieDetails(imdbId) {
    const movieCard = document.getElementById(imdbId);
    movieCard.removeChild(movieCard.lastChild);
}
