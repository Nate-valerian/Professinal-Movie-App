import { useEffect, useState } from 'react';
import Search from './components/Search.jsx'
import Spinner from './components/Spinner.jsx'
import MovieCard from './components/MovieCard.jsx'
import { useDebounce } from 'react-use'
import { getTredingMovies, updateSearchCount } from './appwrite.js'


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  header: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}

const App = () => {
  const [debounceSeearchTerm, setDebounceSearchTerm] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const[movieList, setMovieList] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [getTredingMovies, setGetTredingMovies] = useState([]);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${query}&api_key=${API_KEY}`
        : `${API_BASE_URL}/movie/popular?api_key=${API_KEY}`;

      const response = await fetch(endpoint, API_OPTIONS);

      if(!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      if(data.Response === 'error') {
        setErrorMessage(data.Error || 'Something went wrong');
        setMovieList([]);
        return;
      }

      setMovieList(data.results||[]);

      if(query && data.results.length > 0) {
        await updateSearchCount(query, data.results.[0]);
      }
    } catch (error) {
       console.error(`Error fetching movies: ${error}`);
       setErrorMessage('Something went wrong. Please try again later.');
      } finally {
        setIsLoading(false);
    }
  };

  const loadTredingMovies = async () => {
    try {
      const movies = await getTredingMovies();

      setGetTredingMovies(movies);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
    }
  };

  useEffect(() => {
    fetchMovies(debounceSeearchTerm);
  }, [debounceSeearchTerm]);

  useEffect(() => {
    loadTredingMovies();
  }, []);

  return (
    <main>
      <div className="pattern"/>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className = "text-gradient">Movies</span> You'll Enjoy Without the Hassle </h1>

          <Search
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            fetchMovies={fetchMovies}
          />
        </header>

        {getTredingMovies.length > 0 && (
          <section className="treding-movies">
            <h2>Trending Movies</h2>

            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt={movie.title} />
                  </li>
              ))}
            </ul>
          </section>
        )}


        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
            ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
export default App;


