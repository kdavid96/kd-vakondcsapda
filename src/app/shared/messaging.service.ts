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
    this.afMessaging.messages.subscribe((message) => { console.log(message); this.currentMessage.next(message); });
  }

  requestPermission(): string {
    this.afMessaging.requestToken.subscribe(
      (token) => {
        this.currentToken.next(token);
        this.updateToken(token);
        return token;
      },
      (err) => {
        console.error('Unable to get permission to notify', err);
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
      console.log('Üzenet érkezett', payload);
      this.currentMessage.next(payload);
    })
  }
}