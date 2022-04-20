import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { BehaviorSubject } from 'rxjs'
import { getMessaging } from 'firebase/messaging';
import { AuthService } from './auth.service';
import { take } from 'rxjs';

@Injectable()
export class MessagingService {
  currentMessage = new BehaviorSubject(null);
  currentToken = new BehaviorSubject(null);
  messaging = getMessaging();

  constructor(private afMessaging: AngularFireMessaging, private authService: AuthService) {
    this.afMessaging.messages.subscribe((message) => { this.currentMessage.next(message); });
  }

  getCurrentMessage() {
    return this.currentMessage;
  }

  requestPermission(): string {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        this.currentToken.next(token);
        this.updateToken(token);
        this.authService.getUser().subscribe(user => this)
        return token;
      },
      (err) => {
        console.error('Nem sikerült a hozzáférés megszerzése', err);
        return null;
      }
    );
    return null;
  }

  updateToken(token) {
    this.authService.getAuth().authState.pipe(take(1)).subscribe(user => {
      if (!user) return;
      const data = { [user.uid]: token };
      this.authService.addToken(data);
    })
  }

  receiveMessage(): any {
    this.afMessaging.onMessage((payload) => {
      this.currentMessage.next(payload);
    })
  }
}