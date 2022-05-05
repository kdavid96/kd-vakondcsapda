import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from '@firebase/util';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { GameDataService } from './game-data.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn = false;
    isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
    user$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    userStats$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    userList$: BehaviorSubject<any> = new BehaviorSubject<any>({});
    userScoreList$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    bestFollowingResult$: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    currentUid: string = '';
    playedGames: number = 0;
    avgTimePlayed: number = 0;
    bestScore: number = 0;
    avgScore: number = 0;
    allMolesHit: number = 0;
    allMolesMissed: number = 0;

    public getUser(): Observable<any> {
        return this.user$;
    }

    public getUserList(): Observable<any> {
        return this.userList$;
    }

    public getAuth(): AngularFireAuth {
        return this.firebaseAuth;
    }

    public getStats(): Observable<any> {
        return this.userStats$;
    }

    public getLoggedIn(): Observable<any> {
        return this.isLoggedIn$;
    }

    public getUserScoreList(): Observable<any> {
        return this.userScoreList$;
    }

    public getBestFollowingResult(): Observable<any> {
        return this.bestFollowingResult$;
    }

    constructor(public firebaseAuth: AngularFireAuth, private firestore: AngularFirestore, private database: AngularFireDatabase, private dataService: GameDataService) {
        this.getUsers();
        this.firebaseAuth.onAuthStateChanged(async user => {
            if(user){
                this.currentUid = user.uid;
                this.getUserStats();
                const userRef = this.firestore.collection('users').doc(user.uid).get();
                userRef.subscribe(user => this.user$.next(user.data()));
                this.isLoggedIn$.next(false);
            }else{
                this.isLoggedIn$.next(false);
                localStorage.removeItem('user');
                this.user$.next({});
            }
        })
    }

    async signIn(email: string, password: string) {
        await this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(async res=>{
            this.isLoggedIn = true;
            this.isLoggedIn$.next(true);
            this.editLoginDate(res.user.uid);
        }).catch(error => {
            if(error instanceof FirebaseError){
                switch(error.code){
                    case 'auth/invalid-email': throw 'Helytelen email cím vagy jelszó!';
                    case 'auth/user-disabled': throw 'A felhasználói fiók pillanatnyilag nem elérhető!';
                    case 'auth/wrong-password': throw 'Helytelen email cím vagy jelszó!';
                    case 'auth/user-not-found': throw 'Nem létezik ilyen felhasználói fiók!';
                }
            }
        });
    }

    async signUp(username: string, email: string, password: string, ageGroup: string, education: string, name:string, isPublic: string, gender: string) {
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(res=>{
            this.isLoggedIn = true;
            this.isLoggedIn$.next(true);
            let uid = res.user.uid;
            this.addUserData({uid, username, ageGroup, education, name, isPublic});
            this.database.object(`users/${uid}`).set({data: {uid, username, ageGroup, education, name, isPublic, gender}})
        }).catch(error => {
            if(error instanceof FirebaseError){
                switch(error.code){
                    case 'auth/weak-password': throw 'A jelszó túl gyenge!';
                    case 'auth/email-already-in-use': throw 'Az email cím már használatban van!';
                    case 'auth/invalid-email': throw 'Az email cím nem megfelelő!';
                    case 'auth/operation-not-allowed': throw 'A regisztráció pillanatnyilag nem elérhető!';
                }
            }
        });
    }

    addUserData(data) {
        if(data){
          return new Promise<any>((resolve, reject) => {
            this.firestore
              .collection('users')
              .doc(data.uid)
              .set({data})
              .then(res => {}, err => reject(err))      
          })
        }else{
          return null;
        }
    }

    addToken(data){
        if(data){
            this.database.object(`users/${this.getKeyByValue(data, data[Object.keys(data)[0]])}`).update({token: data})
            this.database.object('tokens/').update(data); 
            return new Promise<any>((resolve, reject) => {
                this.firestore
                    .collection('tokens')
                    .doc(this.getKeyByValue(data, data[Object.keys(data)[0]]))
                    .set(data)
                    .then(res => {}, err => reject(err))
                }
            );

        }else{
            return null;
        }
    }

    getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    }

    signOut() {
        this.isLoggedIn = false;
        this.isLoggedIn$.next(false);
        this.firebaseAuth.signOut();
        this.dataService.changeResultsShow(true);
        this.user$.next({});
    }

    getUsers() {
        let tempUserList;
        const valueChanges = this.database.list('users').valueChanges().pipe(
            map(users => tempUserList = users)
        )

        valueChanges.subscribe(() => {
            this.userList$.next(tempUserList);
        });
    }

    async getUserStats() {
        const valueChanges = this.firestore.collection('reactionTimes').valueChanges().pipe(
            map(reactionTimes => reactionTimes.map(reactionTimeMap => {
                let reactionTime: any = reactionTimeMap
                if(reactionTime.id === this.currentUid){
                    this.playedGames++;
                    this.avgTimePlayed = reactionTime.data.reduce((avgTimePlayed,a) => avgTimePlayed + a.miliseconds, 0);
                    this.bestScore = this.bestScore < reactionTime.points ? reactionTime.points : this.bestScore;
                    this.avgScore += reactionTime.points;
                    reactionTime.data.map(data => this.allMolesHit += data.hit ? 1 : 0);
                    reactionTime.data.map(data => this.allMolesMissed += data.hit ? 0 : 1);
                }
            }))
        );

        valueChanges.subscribe(() => {
            this.avgTimePlayed /= this.playedGames;
            this.avgTimePlayed = parseFloat(Math.floor(this.avgTimePlayed / 1000).toFixed(2));
            this.avgScore = parseFloat((this.avgScore / this.playedGames).toFixed(2));
            this.userStats$.next({playedGames: this.playedGames, avgTimePlayed: this.avgTimePlayed, bestScore: this.bestScore,avgScore: this.avgScore,allMolesHit: this.allMolesHit,allMolesMissed: this.allMolesMissed});
        });
    }

    async editProfile(username, ageGroup, education, name, isPublic, uid) {
        let date = new Date();
        this.database.object(`users/${uid}`).update({data: {uid, username, ageGroup, education, name, isPublic, date}});
        this.firestore.collection('users').doc(uid).set({data: {uid, username, ageGroup, education, name, isPublic}}).then(err => console.log(err));
    }

    editLoginDate(uid){
        let date = new Date();
        this.dataService.changeSavedLastLogin(date);
        this.database.object(`users/${uid}`).update({lastLogin: date})
    }

    getUserResults(uid) {
        let bestScore;
        const valueChanges = this.firestore.collection('reactionTimes').valueChanges().pipe(
            map((reactionTimes:any) => bestScore = reactionTimes.filter((res:any) => res.id === uid).sort((a:any,b:any) => a.points - b.points).reverse()[0].points)
        )
        valueChanges.subscribe(() => {
            const tempArray = this.userScoreList$.value;
            this.userScoreList$.next([...tempArray, {uid, score: bestScore}]);
        })
    }


    loadBestFollowingResult(uid) {
        let uids;
        let newestScore;
        this.database.object(`following/${uid}`).valueChanges().subscribe((users:any) => {
            if(users) uids = Object.keys(users);
            const valueChanges = this.firestore.collection('reactionTimes').valueChanges().pipe(
                map((reactionTimes:any) => {
                    uids.map(uid => {
                        newestScore = reactionTimes.filter((res:any) => res.id === uid).sort((a:any,b:any) => a.date - b.date).reverse()[0];
                    })
                }
            ));
            valueChanges.subscribe(() => {
                this.bestFollowingResult$.next({id: newestScore.id, points: newestScore.points});
            })
        });
    }

    getFollowers(uid: string) {
        return this.database.object(`followers/${uid}`);
    }

    getFollowing(followerId: string, followedId: string) {
        return this.database.object(`following/${followerId}/${followedId}`)
    }

    follow(followerId: string, followedId: string){
        this.database.object(`followers/${followedId}`).update({[followerId]: true});
        this.database.object(`following/${followerId}`).update({[followedId]: true});
    }

    unfollow(followerId: string, followedId: string){
        this.database.object(`followers/${followedId}/${followerId}`).remove();
        this.database.object(`following/${followerId}/${followedId}`).remove();
    }

    registerUser(userId){
        this.database.object(`followers/${userId}`).update({});
    }
}