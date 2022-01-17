import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = 'key=25268822-b28a4694ce5a9846b00732476';
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horisontal',
  safesearch: true,
});

async function fetchPhoto(search, page, perPage) {
  const response = await axios.get(`${BASE_URL}?${API_KEY}&q=${search}&${searchParams}&page=${page}&per_page=${perPage}`);
  return response;
}

export { fetchPhoto };
