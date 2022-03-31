import { NgModule } from '@angular/core';
import { environment } from 'src/environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { IconModule } from '@ant-design/icons-angular';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { CountdownComponent } from './countdown/countdown.component';
import { TimelineComponent } from './timeline/timeline.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TablesComponent } from './tables/tables.component';

import { CountdownPipe } from './pipes/countdown.pipe';
import { TimelinePipe } from './pipes/timeline.pipe';
import { UserComponent } from './user/user.component';
import { StartingGuideComponent } from './starting-guide/starting-guide.component';
import { AuthService } from './shared/auth.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    CountdownComponent,
    CountdownPipe,
    TimelineComponent,
    StatisticsComponent,
    TablesComponent,
    UserComponent,
    StartingGuideComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    BrowserAnimationsModule,
    IconModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule
  ],
  providers: [
    TimelinePipe,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
