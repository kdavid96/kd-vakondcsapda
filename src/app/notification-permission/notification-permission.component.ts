import { Component } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';
import { MessagingService } from 'src/app/shared/messaging.service';


@Component({
  selector: 'notification-permission',
  template: `
  <div class="noti-button-container" [ngStyle]="{'display': isClicked ? 'none' : 'flex'}">
    <button (click)="requestPermission()" [ngStyle]="{'display': isClicked ? 'none' : 'block'}" class="noti-button">
      Értesítések<br/>engedélyezése
    </button>
  </div>
  `,
  styleUrls: ['notification-permission.css']
})
export class NotificationPermissionComponent {

  isClicked: boolean = false;
  currentMessage = new BehaviorSubject(null);
  currentToken = new BehaviorSubject(null);

  constructor(private afMessaging: AngularFireMessaging, private messagingService: MessagingService, private toast: ToastrService, private cookieService: CookieService) {}

  requestPermission() {
    this.isClicked = true;
    let token = this.messagingService.requestPermission();
    this.messagingService.receiveMessage();
    this.currentMessage = this.messagingService.currentMessage;
    this.currentToken = this.messagingService.currentToken;
    this.currentToken.subscribe(token => {
      if(token){
        this.cookieService.set(token, 'true');
      }
    })
    this.currentMessage.subscribe(message => {
      if(message){
        this.toast.info(message.notification.title, message.notification.body, {
          titleClass: "center",
          messageClass: "center"
        });
      }
    })
  }

}
