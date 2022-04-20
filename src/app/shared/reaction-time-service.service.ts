import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Observable } from 'rxjs';
import { GameDataService } from './game-data.service';

@Injectable({
  providedIn: 'root'
})
export class ReactionTimeServiceService {

  reactionTimesArray: AngularFirestoreCollection<any>;

  constructor(private firestore: AngularFirestore, private database: AngularFireDatabase, private dataService: GameDataService) { }

  createReactionTimeResult(data, user, difficulty, points, level) {
    let date = new Date();
    let id = user.data.uid ? user.data.uid : 'noid';
    if(data.length && id !== 'noid'){
      return new Promise<any>((resolve, reject) => {
        this.firestore
          .collection('reactionTimes')
          .add({data, id, difficulty, date, points})
          .then(res => {}, err=> reject(err));
        this.database.list('reactionTimes').push({data, id, difficulty, date: date.getTime(), points, level});
      })
    }else{
      return null;
    }
  }

  getLastReactions(){
    let returnArray = [];
    this.dataService.currentSavedLastLogin.subscribe(value => {
      if(value){
        this.getReactionTimeResults().subscribe(values => {
          values.map((innerValue:any) => {
            innerValue.date.toMillis() > value.getTime() ? returnArray.push({date: innerValue.date, id: innerValue.id, difficulty: innerValue.difficulty, points: innerValue.points}) : ''
          })
        });
        this.dataService.changeLastResultsList(returnArray);
      }
    });
  }

  getReactionTimeResults(){
    this.reactionTimesArray = this.firestore.collection('reactionTimes');
    return this.reactionTimesArray.valueChanges();
  }

  getReactionTimeResultsRealtime(){
    return this.database.list('reactionTimes');
  }

}
