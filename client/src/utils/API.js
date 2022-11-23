// divided into seperate js pages to assit with login and queiries for the applicaiton

// Google API to search books specifically on google

export const searchGoogleBooks = (query) => {
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};