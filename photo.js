class Photo {
  constructor(id, title, caption, file) {
    this.id = Date.now();
    this.title = title;
    this.caption = caption;
    this.file = file;
    this.favorite = false;
  }

  static saveToStorage(e, targetPhoto) {
    localStorage.clear();
    localStorage.setItem('photos', JSON.stringify(imagesArr));
  }

  static deleteFromStorage() {
    var i = imagesArr.findIndex(i => i.id === targetPhoto.id);
    imagesArr.splice(i, 1);
    this.saveToStorage();
  }

  static updatePhoto(e, targetPhoto) {
    if (e.target.className === "title") {
      targetPhoto.title = e.target.innerText;
    } else if (e.target.className === "caption") {
      targetPhoto.caption = e.target.innerText;
    }
    this.saveToStorage();
  }

  static favoritePhoto(targetPhoto) {
    targetPhoto.favorite = !targetPhoto.favorite;
    this.saveToStorage();
  }
}