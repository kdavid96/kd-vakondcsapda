import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from '@firebase/util';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn = false;
    user = new Subject<Object>();

    public getUser(): Observable<Object> {
        return this.user.asObservable();
    }

    constructor(public firebaseAuth: AngularFireAuth, private firestore: AngularFirestore) {}

    async signIn(email: string, password: string) {
        await this.firebaseAuth.signInWithEmailAndPassword(email, password)
        .then(res=>{
            this.isLoggedIn = true;
            this.getUserData(res.user.uid);
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

    async signUp(username: string, email: string, password: string, ageGroup: string, education: string) {
        await this.firebaseAuth.createUserWithEmailAndPassword(email, password)
        .then(res=>{
            this.isLoggedIn = true;
            localStorage.setItem('user', JSON.stringify(res.user));
            let uid = res.user.uid;
            this.addUserData({uid, username, email, ageGroup, education});
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

    async getUserData(uid){
        if(uid.length){
            try {
                const docRef = this.firestore.doc(`users/${uid}`);
                docRef.get().toPromise().then((doc) => {
                    if (doc.exists) {
                        localStorage.setItem('user', JSON.stringify(doc.data()));
                        this.user.next(JSON.stringify(doc.data()));
                    } else {
                        console.log("No such document!");
                        localStorage.setItem('user', null);
                        this.user.next(null);
                    }
                }).catch((error) => {
                    console.log("Error getting document:", error);
                    localStorage.setItem('user', null);
                    this.user.next(null);
                    return null;
                });
            } catch (err) {
                console.error(err);
                localStorage.setItem('user', null);
                this.user.next(null);
                return null;
            }
        } else return null;
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

    signOut() {
        this.firebaseAuth.signOut();
        localStorage.removeItem('user');
    }
}