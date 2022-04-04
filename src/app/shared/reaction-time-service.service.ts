import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReactionTimeServiceService {

  reactionTimesArray: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) { }

  createReactionTimeResult(data, id, difficulty, score) {
    let date = this.formatDate(new Date().toISOString());
    if(data.length && id !== null && id !== 0 && id !== 'noid'){
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection('reactionTimes')
          .add({data, id, difficulty, date, score})
          .then(res => {}, err=> reject(err))      
      })
    }else{
      return null;
    }
  }

  getReactionTimeResults(){
    this.reactionTimesArray = this.firestore.collection('reactionTimes');
    return this.reactionTimesArray.valueChanges();
  }

  formatDate(date){
    var [datePart, timePart] = date.split('T');
    var returnString = datePart.split('-')[0] + "." + datePart.split('-')[1] + "." + datePart.split('-')[2] + " " + timePart.split(':')[0] + ":" + timePart.split(':')[1] + ":" + timePart.split(':')[2].split('.')[0];
    return returnString;
  }

}
