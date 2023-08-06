import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/Auth';
import { db, auth } from './config/firebase';
import {
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';

interface Movie {
  id: string;
  receivedAnOscar: boolean;
  releaseDate: number;
  title: string;
}

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newReleaseDate, setNewReleaseDate] = useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar] = useState(false);

  const [updatedTitle, setUpdatedTitle] = useState('');

  const moviesCollectionRef = collection(db, 'movies');

  const getMovieList = async () => {
    try {
      const data = await getDocs(moviesCollectionRef);
      const filteredData = data.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as Movie[];
      setMovieList(filteredData);
    } catch (err) {
      console.error(err);
    }
  };

  const onSubmitMovie = async () => {
    try {
      await addDoc(moviesCollectionRef, {
        title: newMovieTitle,
        releaseDate: newReleaseDate,
        receivedAnOscar: isNewMovieOscar,
      });
      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMovie = async (id: string) => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await deleteDoc(movieDoc);

      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  const updateMovieTitle = async (id: string) => {
    try {
      const movieDoc = doc(db, 'movies', id);
      await updateDoc(movieDoc, { title: updatedTitle });

      getMovieList();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getMovieList();
  }, []);

  return (
    <>
      <div>
        <Auth />
        <div>
          <input
            placeholder="Movie title..."
            onChange={e => setNewMovieTitle(e.target.value)}
          />
          <input
            placeholder="Release Date..."
            type="number"
            onChange={e => setNewReleaseDate(+e.target.value)}
          />
          <input
            type="checkbox"
            checked={isNewMovieOscar}
            onChange={e => setIsNewMovieOscar(e.target.checked)}
          />
          <label> Received an Oscar</label>
          <button onClick={onSubmitMovie}>Submit Movie</button>
        </div>
        <div>
          {movieList.map(movie => {
            return (
              <div key={movie.title}>
                <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>
                  {movie.title}
                </h1>
                <p>Date: {movie.releaseDate}</p>
                <button onClick={() => deleteMovie(movie.id)}>
                  Delete Movie
                </button>
                <input
                  placeholder="new itle..."
                  onChange={e => setUpdatedTitle(e.target.value)}
                />
                <button onClick={() => updateMovieTitle(movie.id)}>
                  {' '}
                  Update title
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
