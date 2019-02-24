var uploadSection = document.querySelector('.upload');
var title = document.querySelector('.title-input');
var caption = document.querySelector('.caption-input');
var photoFile = document.querySelector('.input-file');
var favoriteCounterEl = document.querySelector('.favorite-counter');
var galleryFile = document.querySelector('.gallery-file');
var create = document.querySelector('.album-btn');
var viewFavoritesBtn = document.querySelector('.view-favorites');
var photoGallery = document.querySelector('.storage');
var cardList = document.querySelectorAll(".photo");
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();

window.addEventListener('load', appendPhotos);
create.addEventListener('click', loadImg);
uploadSection.addEventListener('change', buttenEnabler);
viewFavoritesBtn.addEventListener('click', viewFavorites);
photoGallery.addEventListener('keydown', saveOnReturn);
photoGallery.addEventListener('focusout', saveCard);
photoGallery.addEventListener('click', clickHandler);
// photoFile.addEventListener('change', updateImage);

function appendPhotos() {
  if (imagesArr.length === 0) {
    photoGallery.innerHTML += `<h1>PLEASE ADD A PHOTO</h1>`;
  } else if (imagesArr.length <= 10) {
    for (var i = 0; i < imagesArr.length; i++) {
      createPhoto(imagesArr[i]);
      checkFavorite(imagesArr[i], i);
    }  
  } else {
    for (var i = 0; i < imagesArr.length; i++) {
      createPhoto(imagesArr[i]);
      checkFavorite(imagesArr[i], i);
    }
  }
  favoriteCounter()
}

function buttenEnabler() {
  if (title && caption && photoFile.files[0]) {
    create.disabled = false;
    create.classList.remove('disabled');
  }
}

function viewFavorites(e) {
  e.preventDefault();
  clearDOM();
  var n = 0
  for (var i = 0; i < imagesArr.length; i++) {
    if (imagesArr[i].favorite === true) {
      createPhoto(imagesArr[i]);
      checkFavorite(imagesArr[i], n);
      n++;
    } 
  } 
}

function clickHandler(e) {
  photoTargeter(e);
  if (e.target.id === "delete") {
    deleteCard(e);
  } else if (e.target.id === "favorite") {
    favoriteCard(e, targetPhoto);
  } else if (e.target.id === "favorite-active") {
    unfavoriteCard(e, targetPhoto)
  }
}


// function updateImage(e) {
//   if (photoFile.files[0]) {
//     reader.readAsDataURL(photoFile.files[0]); 
//     reader.onload = test
//   }
// }

function favoriteCard(e, targetPhoto) {
  e.target.classList.add('hidden');
  e.target.nextElementSibling.classList.remove('hidden');
  Photo.favoritePhoto(targetPhoto);
  favoriteCounter()
}

function unfavoriteCard(e, targetPhoto) {
  e.target.classList.add('hidden');
  e.target.previousElementSibling.classList.remove('hidden');
  Photo.favoritePhoto(targetPhoto);
  favoriteCounter()
}

function favoriteCounter() {
  var favoriteCounter = 0;
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

function clearDOM() {
  var cardList = document.querySelectorAll(".photo");
  for (var i = 0; i < cardList.length; i++) {
    cardList[i].remove();
  }
}

function loadImg(e) {
  e.preventDefault();
  if (photoFile.files[0]) {
    reader.readAsDataURL(photoFile.files[0]); 
    reader.onload = addPhoto
  }
}

function addPhoto(e) {
  e.preventDefault();
  var newPhoto = new Photo(Date.now(), title.value, caption.value, e.target.result);
  imagesArr.push(newPhoto)
  Photo.saveToStorage(imagesArr)
  createPhoto(newPhoto);
}

function createPhoto(newPhoto) {
  var temp = document.getElementsByTagName("template")[0];
  temp.content.querySelector('.photo').setAttribute("data-id", newPhoto.id);
  temp.content.querySelector('.title').innerText = newPhoto.title;
  temp.content.querySelector('img').src = newPhoto.file;
  temp.content.querySelector('label').setAttribute("for", newPhoto.id);
  // temp.content.querySelector('input').id = newPhoto.id;
  temp.content.querySelector('.caption').innerText = newPhoto.caption;
  var clone = temp.content.cloneNode(true);
  photoGallery.appendChild(clone);
}

function checkFavorite(newPhoto, i) {
  if (newPhoto.favorite === true ) {
    var cardList = document.querySelectorAll(".photo");
    cardList[i].children[3].children[2].classList.add('hidden');
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