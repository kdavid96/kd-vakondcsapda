import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class ReactionTimeServiceService {

  reactionTimesArray: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore) { }

  createReactionTimeResult(data) {
    if(data.length){
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection('reactionTimes')
          .add({data: data})
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

}
