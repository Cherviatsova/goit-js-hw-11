import '../css/main.css';
import { searchImages } from './api';
import { Notify } from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import LoadMoreBtn from './load-more-btn';
import easyScroll from 'easy-scroll';
import { addBackToTop } from 'vanilla-back-to-top';

const searchForm = document.querySelector('[id="search-form"]');
const gallery = document.querySelector('.gallery');
const searchQueryInput = document.querySelector('[name="searchQuery"]');

let page = 1;
let perPage = 40;

const loadMoreBtn = new LoadMoreBtn({
  selector: '[data-action="load-more"]',
  hidden: true,
});

searchForm.addEventListener('submit', onSearchFormSubmit);
loadMoreBtn.refs.button.addEventListener('click', onLoadMoreBtn);

function onLoadMoreBtn() {
  loadMoreBtn.disable();
  page += 1;
  fetchImages();
  loadMoreBtn.enable();
  easyScroll({
    scrollableDomEle: window,
    direction: 'bottom',
    duration: 2000,
    easingPreset: 'easeInQuad',
    scrollAmount: 1000,
  });
}

function onSearchFormSubmit(evt) {
  evt.preventDefault();
  loadMoreBtn.hide();
  page = 1;
  gallery.innerHTML = '';
  fetchImages();
}

function fetchImages() {
  const searchQuery = searchQueryInput.value.trim();
  if (searchQuery === '') {
    Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    return;
  }
  console.log(searchQuery);
  searchImages(searchQuery, page, perPage)
    .then(({ data }) => {
      console.log(data.hits);
      console.log(data.hits.length);
      renderGallery(data.hits);

      if (data.hits.length !== 0) {
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        loadMoreBtn.show();
      }
      if (data.hits.length === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
        loadMoreBtn.hide();
        return;
      }
      if (data.hits.length > 40 && data.hits.length !== 0) {
        Notify.failure("We're sorry, but you've reached the end of search results.");
        loadMoreBtn.hide();
        return;
      }
    })
    .catch(error => console.log(error));
}

function renderGallery(images) {
  const markup = images
    .map(image => {
      return `
    <div class="photo-card">
    <a class="gallery-link" href="${image.largeImageURL}">
  <img src="${image.webformatURL}" class="gallery-image" alt="${image.tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b> <span>${image.likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b> <span>${image.views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b> <span>${image.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b> <span>${image.downloads}</span>
    </p>
  </div>
</div>
     `;
    })
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);

  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionData: 'alt',
  });
  lightbox.refresh();
}

addBackToTop({
  backgroundColor: 'white',
  textColor: 'black',
  scrollDuration: 100,
  showWhenScrollTopIs: 1,
  zIndex: 1,
});
