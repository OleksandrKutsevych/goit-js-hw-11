export function getRefs() {
  return {
    searchForm: document.querySelector('.search-form'),
    formInpu: document.querySelector('input[name="searchQuery"]'),
    submitButton: document.querySelector('button[type="submit"]'),
    gallery: document.querySelector('.gallery'),
    loadMoreBtn: document.querySelector('.btn-load-more'),
  };
}
