import axios from 'axios';
const KEY = '24522433-b765e3bcd233b8a39427fcc1c';
const BASE_URL = 'https://pixabay.com/api';

export async function searchImages(userRequest, page, perPage) {
  return await axios.get(
    `${BASE_URL}/?key=${KEY}&q=${userRequest}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${perPage}&page=${page}`,
  );
}
