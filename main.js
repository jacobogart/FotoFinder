var title = document.querySelector('.title-input');
var caption = document.querySelector('.caption-input');
var photoFile = document.querySelector('.input-file');
var galleryFile = document.querySelector('.gallery-file');
var create = document.querySelector('.album-btn');
var photoGallery = document.querySelector('.storage');
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();

window.addEventListener('load', appendPhotos);
create.addEventListener('click', loadImg);
photoGallery.addEventListener('keydown', saveOnReturn);
photoGallery.addEventListener('focusout', saveCard);
photoGallery.addEventListener('click', clickHandler);
// photoFile.addEventListener('change', updateImage);

function appendPhotos() {
  for (var i = 0; i < imagesArr.length; i++) {
    createPhoto(imagesArr[i]);
    checkFavorite(imagesArr[i]);
  }
}

function clickHandler(e) {
  console.log(e);
  photoTargeter(e);
  if (e.target.id === "delete") {
    deleteCard(e);
  } else if (e.target.id === "favorite") {
    favoriteCard(e, targetPhoto);
  }
}


// function updateImage(e) {
//   console.log(e);
//   if (photoFile.files[0]) {
//     console.log('test')
//     reader.readAsDataURL(photoFile.files[0]); 
//     reader.onload = test
//   }
// }

function favoriteCard(e) {
  e.target.classList.add('hidden');
  Photo.favoritePhoto(targetPhoto);
}

function deleteCard(e) {
  photoTargeter(e);
  var card = e.target.closest('.photo'); 
  card.remove();
  Photo.deleteFromStorage(targetPhoto);
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

function checkFavorite(newPhoto) {
  if (newPhoto.favorite === true) {
    var cardList = document.querySelectorAll("section[data-id]");
    for (var i = 0; i < cardList.length; i++) {
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