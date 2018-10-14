import { Injectable } from '@angular/core';

@Injectable()
export class ImageViewService {

  constructor() {}
  getReader(resolve, reject) {
    const reader = new FileReader();
    reader.onload = this.onload(reader, resolve);
    reader.onerror = this.onError(reader, reject);
    return reader;
  }
  readAsDataUrl(file) {
    const that = this;
    return new Promise(function(resolve, reject){
      const reader = that.getReader(resolve, reject);
      reader.readAsDataURL(file);
    });
  }

  onload(reader: FileReader, resolve) {
    return () => {
      resolve(reader.result);
    };
  }

  onError(reader: FileReader, reject) {
    return () => {
      reject(reader.result);
    };
  }
}

@Injectable()
export class ImagePreviewService {

  constructor() { }
  getReader(resolve, reject) {
    const reader = new FileReader();
    reader.onload = this.onLoad(reader, resolve);
    reader.onerror = this.onError(reader, reject);
    return reader;
  }
  readAsDataUrl(file) {
    const that = this;
    return new Promise(function(resolve, reject){
      const reader = that.getReader(resolve, reject);
      reader.readAsDataURL(file);
    });
  }

  onLoad(reader: FileReader, resolve) {
    return () => {
      resolve(reader.result);
    };
  }
  onError(reader: FileReader, reject) {
    return () => {
      reject(reader.result);
    };
  }
}

