import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database'; 
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { IconModule } from '@ant-design/icons-angular';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu'; 
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ToastrModule } from 'ngx-toastr';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CountdownComponent } from './countdown/countdown.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TablesComponent } from './tables/tables.component';

import { CountdownPipe } from './pipes/countdown.pipe';
import { TimelinePipe } from './pipes/timeline.pipe';
import { DifficultyPipe } from './pipes/difficulty.pipe';
import { HitsPipe } from './pipes/hits.pipe';
import { UserComponent } from './user/user.component';
import { StartingGuideComponent } from './starting-guide/starting-guide.component';
import { AuthService } from './shared/auth.service';
import { NotificationPermissionComponent } from './notification-permission/notification-permission.component';
import { MessagingService } from './shared/messaging.service';
import { CookieService } from 'ngx-cookie-service';
import { FollowingComponent } from './following/following.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { SideToggleComponent } from './side-toggle/side-toggle.component';
import { MenuComponent } from './menu/menu.component';
import { GameDataService } from './shared/game-data.service';
import { MatIconModule } from '@angular/material/icon';
import { AppRoutingModule } from './app-routing.module';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { ErrorComponent } from './error/error.component';
import { LoginResultsComponent } from './login-results/login-results.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CountdownComponent,
    CountdownPipe,
    DifficultyPipe,
    HitsPipe,
    TimelineComponent,
    StatisticsComponent,
    TablesComponent,
    UserComponent,
    StartingGuideComponent,
    NotificationPermissionComponent,
    FollowingComponent,
    UserProfileComponent,
    EditProfileComponent,
    SideToggleComponent,
    MenuComponent,
    RegisterComponent,
    LoginComponent,
    DataProtectionComponent,
    ErrorComponent,
    LoginResultsComponent,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    BrowserAnimationsModule,
    IconModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    ToastrModule.forRoot(),
    AppRoutingModule,
    MatMenuModule
  ],
  providers: [
    TimelinePipe,
    AuthService,
    MessagingService,
    CookieService,
    GameDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
