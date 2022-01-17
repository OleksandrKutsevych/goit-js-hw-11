import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchPhoto } from './js/fetchPhoto';
import { getRefs } from './js/getRefs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreBtn);

let page = 1;
let perPage = 40;
let searchQueryValue = '';

function onSearch(e) {
  e.preventDefault();

  const form = e.currentTarget;
  const searchQueryValue = form.elements.searchQuery.value;

  page = 1;
  refs.gallery.innerHTML = '';
  refs.loadMoreBtn.classList.add('is-hidden');

  if (searchQueryValue === '') {
    noticeEnterSearchWord();
    return;
  }

  fetchPhoto(searchQueryValue, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        notiseWrongNameError();
        return;
      }
      renderGaleryCard(data.hits);
      let lightbox = new SimpleLightbox('.gallery a', {
        /* options */
        captionsData: 'alt',
        captionDelay: 250,
        captionType: 'attr',
      });
      noticsFoundingSuccess(data);
      if (data.totalHits > perPage) {
        refs.loadMoreBtn.classList.remove('is-hidden');
      }
    })
    .catch(error => console.log(error));
}

function onLoadMoreBtn() {
  page += 1;

  fetchPhoto(searchQueryValue, page, perPage)
    .then(({ data }) => {
      renderGaleryCard(data.hits);
      let lightbox = new SimpleLightbox('.gallery a', {
        /* options */
        captionsData: 'alt',
        captionDelay: 250,
        captionType: 'attr',
      });
      let allPages = data.totalHits / perPage;

      if (page > allPages) {
        noticeEndOfSearchResults();
        refs.loadMoreBtn.classList.add('is-hidden');
      }
    })
    .catch(error => console.log(error));
}

function renderGaleryCard(images) {
  let galeryCardsMarkup = images
    .map(image => {
      let { webformatURL, largeImageURL, tags, likes, views, comments, downloads } = image;
      return `
    <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
    `;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', galeryCardsMarkup);
}

function notiseWrongNameError() {
  Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
}

function noticeEndOfSearchResults() {
  Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
}

function noticsFoundingSuccess(data) {
  Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
}

function noticeEnterSearchWord() {
  Notiflix.Notify.warning('Please, enter a search word');
}
