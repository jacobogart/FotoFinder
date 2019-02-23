class Photo {
  constructor(id, title, caption, file) {
    this.id = Date.now();
    this.title = title;
    this. caption = caption;
    this.file = file;
    this.favorite = false;
  }

  saveToStorage() {
    localStorage.setItem('photos', JSON.stringify(imagesArr));
  }

  deleteFromStorage() {

  }

  updatePhoto() {

  }
}