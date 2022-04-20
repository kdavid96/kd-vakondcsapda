import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { BoardComponent } from './board/board.component';
import { TablesComponent } from './tables/tables.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DataProtectionComponent } from './data-protection/data-protection.component';
import { UserComponent } from './user/user.component';
import { ErrorComponent } from './error/error.component';
import { IsAuthenticatedGuard } from './is-authenticated.guard';

const routes: Routes = [
  {path: '', component: MenuComponent},
  {path: 'play', component: BoardComponent, canActivate: [IsAuthenticatedGuard]},
  {path: 'play_test', component: BoardComponent},
  {path: 'tables', component: TablesComponent},
  {path: 'diagrams', component: StatisticsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dataprotection', component: DataProtectionComponent},
  {path: 'profile', component: UserComponent, canActivate: [IsAuthenticatedGuard]},
  {path: '**', component: ErrorComponent}
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
