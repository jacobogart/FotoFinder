var uploadSection = document.querySelector('.upload');
var searchInput = document.querySelector('#search-input');
var searchBtn = document.querySelector('.search-btn');
var title = document.querySelector('.title-input');
var caption = document.querySelector('.caption-input');
var characterCount = document.querySelector('#character-count');
var photoFile = document.querySelector('.input-file');
var favoriteCounterEl = document.querySelector('.favorite-counter');
var galleryFile = document.querySelector('.gallery-file');
var create = document.querySelector('.album-btn');
var viewFavoritesBtn = document.querySelector('.view-favorites');
var photoGallery = document.querySelector('.storage');
var cardList = document.querySelectorAll(".photo");
var showBtn = document.querySelector('#show-btn');
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();

window.addEventListener('load', appendPhotos);
searchBtn.addEventListener('click', searchPhotos);
searchInput.addEventListener('keyup', searchPhotos);
create.addEventListener('click', loadImg);
uploadSection.addEventListener('change', buttenEnabler);
caption.addEventListener('input', characterCounter);
viewFavoritesBtn.addEventListener('click', viewFavorites);
photoGallery.addEventListener('keydown', saveOnReturn);
photoGallery.addEventListener('focusout', saveCard);
photoGallery.addEventListener('click', clickHandler);
photoGallery.addEventListener('change', updateImage);

function appendPhotos() {
  if (imagesArr.length === 0) {
    photoGallery.innerHTML += `<h1>PLEASE ADD A PHOTO</h1>`;
  } else if (imagesArr.length > 10) {
    appendPhotosJr(); 
    clearDOM(10) 
  } else {
    appendPhotosJr();
  }
}

function appendPhotosJr() {
  clearDOM(0);
  for (var i = 0; i < imagesArr.length; i++) {
  createPhoto(imagesArr[i]);
  }  
  checkFavorite();
  favoriteCounter()
}

function addPhoto(e) {
  e.preventDefault();
  var newPhoto = new Photo(Date.now(), title.value, caption.value, e.target.result);
  imagesArr.push(newPhoto)
  Photo.saveToStorage(imagesArr)
  createPhoto(newPhoto);
  title.value = '';
  caption.value = '';
}

function createPhoto(newPhoto) {
  var temp = document.getElementsByTagName("template")[0];
  temp.content.querySelector('.photo').setAttribute("data-id", newPhoto.id);
  temp.content.querySelector('.photo').setAttribute("data-fave", newPhoto.favorite);
  temp.content.querySelector('.title').innerText = newPhoto.title;
  temp.content.querySelector('img').src = newPhoto.file;
  temp.content.querySelector('label').setAttribute("for", newPhoto.id);
  temp.content.querySelector('input').id = newPhoto.id;
  temp.content.querySelector('.caption').innerText = newPhoto.caption;
  var clone = temp.content.cloneNode(true);
  photoGallery.prepend(clone);
}

function characterCounter() {
  characterCount.innerHTML = caption.value.length;
  if(caption.value.length < 70) {
    create.disabled = false;
    create.classList.remove('disabled');
    characterCount.style.color = "#FFFFFF";
    buttenEnabler();
  } else {
    create.disabled = true;
    create.classList.add('disabled');
    characterCount.style.color = 'red';
  }
}

function buttenEnabler() {
  if (title.value && caption.value && photoFile.files[0]) {
    create.disabled = false;
    create.classList.remove('disabled');
  } else {
    create.disabled = true;
    create.classList.add('disabled');
  }
}

function searchPhotos() {
  clearDOM(0);
  var searchQuery = searchInput.value.toLowerCase();
  if (viewFavoritesBtn.innerText.includes('All')) {
    searchFilter(searchQuery);
  } else {
    searchAll(searchQuery);
  }
}

function searchAll(searchQuery) {
  for (var i = 0; i < imagesArr.length; i++) {
    if(imagesArr[i].title.toLowerCase().includes(searchQuery) || imagesArr[i].caption.toLowerCase().includes(searchQuery)) {
      createPhoto(imagesArr[i]);
    }
  }
}

function searchFilter(searchQuery) {
  for (var i = 0; i < imagesArr.length; i++) {
    if(imagesArr[i].favorite === true && (imagesArr[i].title.toLowerCase().includes(searchQuery) || imagesArr[i].caption.toLowerCase().includes(searchQuery))) {
      createPhoto(imagesArr[i]);
    }
  }
}

function viewFavorites(e) {
  e.preventDefault();
  clearDOM(0);
  if (viewFavoritesBtn.innerText.includes('Favorite')) {
    viewFaveFave()
  } else if (viewFavoritesBtn.innerText.includes('All')) {
    viewFaveAll()
  }
  checkFavorite();
}

function viewFaveFave() {
  for (var i = 0; i < imagesArr.length; i++) {
      if (imagesArr[i].favorite === true) {
      createPhoto(imagesArr[i]);  
      }
    }  
  viewFavoritesBtn.innerText = 'View All';
}

function viewFaveAll() {
  appendPhotosJr();
  clearDOM(10)
  viewFavoritesBtn.innerHTML = `View <span class="favorite-counter">0</span> Favorites`;
  favoriteCounter();
}

function clickHandler(e) {
  if (e.target.id === "delete-active") {
    deleteCard(e);
  } else if (e.target.id === "favorite-passive") {
    favoriteCard(e);
  } else if (e.target.id === "favorite-active") {
    unfavoriteCard(e);
  } else if (e.target.id === "show-btn") {
    showMoreLess();
  }
}

function updateImage(e) {
  if (e.target.files[0]) {
    photoTargeter(e);
    reader.readAsDataURL(e.target.files[0]); 
    reader.onload = updateImageJr;
  }
}

function updateImageJr(e) {
  var newPhotoURL = e.target.result;
  Photo.updatePhoto(e, targetPhoto, newPhotoURL);
  appendPhotos();
}

function favoriteCard(e) {
  photoTargeter(e);
  e.target.classList.add('hidden');
  // e.target.nextElementSibling.classList.remove('hidden');
  Photo.favoritePhoto(targetPhoto);
  favoriteCounter()
}

function unfavoriteCard(e) {
  photoTargeter(e);
  // e.target.classList.add('hidden');
  e.target.previousElementSibling.classList.remove('hidden');
  Photo.favoritePhoto(targetPhoto);
  favoriteCounter()
}

function favoriteCounter() {
  var favoriteCounter = 0;
  var favoriteCounterEl = document.querySelector('.favorite-counter') || 'poop';
  for (var i = 0; i < imagesArr.length; i++) {
    if (imagesArr[i].favorite === true) {
      favoriteCounter++
    }
  }
  favoriteCounterEl.innerText = favoriteCounter;
}

function deleteCard(e) {
  photoTargeter(e);
  var card = e.target.closest('.photo'); 
  card.remove();
  Photo.deleteFromStorage(targetPhoto);
}

function clearDOM(n) {
  var cardList = document.querySelectorAll(".photo");
  for (var i = n; i < cardList.length; i++) {
    cardList[i].remove();
  }
}

function loadImg(e) {
  e.preventDefault();
  reader.readAsDataURL(photoFile.files[0]); 
  reader.onload = addPhoto;
}

function checkFavorite() {
  var cardList = document.querySelectorAll(".photo");
  for (var i = 0; i < cardList.length; i++) {
    if (cardList[i].dataset.fave === 'true') {
      cardList[i].children[3].children[2].classList.add('hidden');
    } 
  }
}

function saveOnReturn(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    saveCard(e);
    e.target.blur();
  } 
}

function photoTargeter(e) {
  targetPhoto = imagesArr.find(function(item) {
    return item.id == e.target.closest('.photo').dataset.id;
  });
  return targetPhoto;
}

function saveCard(e) {
  photoTargeter(e);
  Photo.updatePhoto(e, targetPhoto);
}

function showMoreLess() {
  if (showBtn.innerText === 'Show More') {
    appendPhotosJr();
    showBtn.innerText = 'Show Less';
  } else if (showBtn.innerText === 'Show Less') {
    clearDOM(10)
    showBtn.innerText = 'Show More';
  }
}