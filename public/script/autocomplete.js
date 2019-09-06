const inputOrigin = document.getElementById('inputOrigin');
const inputDestination = document.getElementById('inputDestination');
const matchList = document.getElementById('origin');
const destinationSuggestions = document.getElementById('destination');
let cities;

// Get cities
const getCities = async () => {
 const res = await fetch('../data/cities.json');
 cities = await res.json();
};

// FIlter cities
const searchCities = (searchText, htmlToUpdate) => {
 // Get matches to current text input
    let matches = cities.filter(cities => {
    const regex = new RegExp(`^${searchText}`, 'gi');
    return cities.name.match(regex)
    });

    console.log(matches)
 // Clear when input or matches are empty
 if (searchText.length === 0) {
  matches = [];
  htmlToUpdate.innerHTML = '';
 }

 outputHtml(matches, htmlToUpdate);
};

// Show results in HTML
const outputHtml = (matches, htmlToUpdate) => {
 if (matches.length > 0) {
  const html = matches.map(match => 
    `<option value="${match.name}">
        ${match.name},${match.state}
    </option>`
   ).join('');
   htmlToUpdate.innerHTML = html;
 }
};

window.addEventListener('DOMContentLoaded', getCities);
inputOrigin.addEventListener('input', () => searchCities(inputOrigin.value, matchList));
inputDestination.addEventListener('input', () => searchCities(inputDestination.value, destinationSuggestions));
