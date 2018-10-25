import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireStorageReference, AngularFireUploadTask } from 'angularfire2/storage';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

    ref: AngularFireStorageReference;
    task: AngularFireUploadTask;

    constructor(private afStorage: AngularFireStorage) { }

    upload(id: string, image: File) {
      this.ref = this.afStorage.ref(`users/${id}`);
      this.task = this.ref.put(image);
      return this.task;
    }

    getUrl(id: string) {
      this.ref = this.afStorage.ref(`users/${id}`);
      return this.ref.getDownloadURL();
    }
}
