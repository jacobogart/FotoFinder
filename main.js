var title = document.querySelector('.title-input');
var caption = document.querySelector('.caption-input');
var photoFile = document.querySelector('.input-file');
var create = document.querySelector('.album-btn');
var photoGallery = document.querySelector('.storage');
var imagesArr = JSON.parse(localStorage.getItem('photos')) || [];
var reader = new FileReader();

window.addEventListener('load', appendPhotos);
create.addEventListener('click', loadImg);

function appendPhotos() {
  for (var i = 0; i < imagesArr.length; i++) {
    createPhoto(imagesArr[i]);
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
  newPhoto.saveToStorage(imagesArr)
  createPhoto(newPhoto);
}

function createPhoto(newPhoto) {
  var temp = document.getElementsByTagName("template")[0];
  temp.content.querySelector('.title').innerText = newPhoto.title;
  temp.content.querySelector('img').src = newPhoto.file;
  temp.content.querySelector('.caption').innerText = newPhoto.caption;
  var clon = temp.content.cloneNode(true);
  photoGallery.appendChild(clon);
}