import { useState, useEffect } from 'react';
import './App.css';

const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;

function App() {
  const [currentCat, setCurrentCat] = useState(null);
  const [banList, setBanList] = useState([]);
  const [breeds, setBreeds] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch all breeds and store them in the state
    const fetchBreeds = async () => {
      try {
        const response = await fetch(`https://api.thecatapi.com/v1/breeds?api_key=${CAT_API_KEY}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setBreeds(json);
      } catch (error) {
        console.error("Error during API call:", error);
        alert("An error occurred while fetching breeds.");
      }
    };

    fetchBreeds();
  }, []);

  const fetchCat = async () => {
    try {
      // Filter out banned breeds
      const availableBreeds = breeds.filter(breed => !banList.includes(breed.name) && !banList.includes(breed.origin) && !banList.includes(breed.weight.metric) && !banList.includes(breed.life_span));
      if (availableBreeds.length === 0) {
        alert("No more breeds available. Please remove some items from the ban list.");
        return;
      }

      // Select a random breed from the available breeds
      const randomBreed = availableBreeds[Math.floor(Math.random() * availableBreeds.length)];

      // Fetch a cat image for the selected breed
      const response = await fetch(`https://api.thecatapi.com/v1/images/search?breed_ids=${randomBreed.id}&api_key=${CAT_API_KEY}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const json = await response.json();
      const cat = json[0];

      setCurrentCat(cat);
      setHistory(prevHistory => [
        ...prevHistory,
        { description: `a ${randomBreed.name} cat from ${randomBreed.origin}`, imageUrl: cat.url }
      ]);
    } catch (error) {
      console.error("Error during API call:", error);
      alert("An error occurred while making the API call.");
    }
  };

  const addToBanList = (attribute) => {
    setBanList((prevList) => [...prevList, attribute]);
  };

  return (
    <div className="whole-page">
      <div className="history-sidebar">
        <h3>History:</h3>
        <ul>
          {history.map((item, index) => (
            <li key={index} className="history-item">
              <img src={item.imageUrl} alt="Cat" />
              {item.description}
            </li>
          ))}
        </ul>
      </div>
      <div className="main-content">
        <h1>Veni Vici!</h1>
        <h2>Discover cats from your wildest dreams!</h2>
        <h2>😺😸😹😻😼😽🙀😿😾</h2>
        <h3>Alexander Tertus z23630485</h3>
        <button className="discover-btn" onClick={fetchCat}>Get a Random Cat</button>
        <br></br>
        {currentCat ? (
          <div>
            <div className="attributes">
              <button className="attribute-buttons" onClick={() => addToBanList(currentCat.breeds[0].name)}>Breed: {currentCat.breeds[0].name}</button>
              <button className="attribute-buttons" onClick={() => addToBanList(currentCat.breeds[0].weight.metric)}>Weight: {currentCat.breeds[0].weight.metric} kg</button>
              <button className="attribute-buttons" onClick={() => addToBanList(currentCat.breeds[0].origin)}>Origin: {currentCat.breeds[0].origin}</button>
              <button className="attribute-buttons" onClick={() => addToBanList(currentCat.breeds[0].life_span)}>Lifespan: {currentCat.breeds[0].life_span} years</button>
            </div>
            <img
              className="cat-image"
              src={currentCat.url}
              alt="Random Cat"
            />
          </div>
        ) : (
          <div>Click the button to get a random cat!</div>
        )}
        <div className="sideNav">
          <h3>Ban List:</h3>
          <ul>
            {banList.map((item, index) => (
              <li key={index} className="banned-buttons">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;