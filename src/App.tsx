import { useEffect, useState } from 'react';
import './App.css';
import { Auth } from './components/Auth';
import { db } from './config/firebase';
import { getDocs, collection } from 'firebase/firestore';

interface Movie {
  id: string;
  receivedAnOscar: boolean;
  releaseDate: number;
  title: string;
}

function App() {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const moviesCollectionRef = collection(db, 'movies');

  useEffect(() => {
    const getMovieList = async () => {
      try {
        const data = await getDocs(moviesCollectionRef);
        const filteredData = data.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })) as Movie[]; // Use the 'as Movie[]' assertion to tell TypeScript the type of filteredData
        setMovieList(filteredData);
      } catch (err) {
        console.error(err);
      }
    };

    getMovieList();
  }, []);

  return (
    <>
      <div>
        <Auth />

        <div>
          {movieList.map(movie => {
            return (
              <div key={movie.title}>
                <h1 style={{ color: movie.receivedAnOscar ? 'green' : 'red' }}>
                  {movie.title}
                </h1>
                <p>Date: {movie.releaseDate}</p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
