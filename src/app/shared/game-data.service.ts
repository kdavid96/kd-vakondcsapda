import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable()
export class GameDataService {
    private startOverlay = new BehaviorSubject<boolean>(true);
    currentStartOverlay = this.startOverlay.asObservable();

    private started = new BehaviorSubject<boolean>(false);
    currentStarted = this.started.asObservable();

    private difficulty = new BehaviorSubject<string>('easy');
    currentDifficulty = this.difficulty.asObservable();

    private level = new BehaviorSubject<number>(1);
    currentLevel = this.level.asObservable();

    private loggedIn = new BehaviorSubject<boolean>(false);
    currentLoggedIn = this.loggedIn.asObservable();

    private resultsShow = new BehaviorSubject<boolean>(true);
    currentResultsShow = this.resultsShow.asObservable();

    private savedLastLogin = new BehaviorSubject<Date>(null);
    currentSavedLastLogin = this.savedLastLogin.asObservable();

    private lastResultsList = new BehaviorSubject<any>(null);
    currentLastResultsList = this.lastResultsList.asObservable();

    private startTrialGame = new BehaviorSubject<any>(null);
    currentStartTrialGame = this.startTrialGame.asObservable();

    private showGuide = new BehaviorSubject<any>(true);
    currentShowGuide = this.showGuide.asObservable();

    constructor() { }

    changeStartOverlay(overlay: boolean){
        this.startOverlay.next(overlay);
    }

    changeStarted(started: boolean){
        this.started.next(started);
    }

    changeDifficulty(difficulty: string){
        this.difficulty.next(difficulty)
    }

    changeLevel(level: number){
        this.level.next(level);
    }

    changeLoggedIn(loggedIn: boolean){
        this.loggedIn.next(loggedIn);
    }

    changeResultsShow(resultsShow: boolean){
        this.resultsShow.next(resultsShow);
    }

    changeSavedLastLogin(savedLastLogin: Date){
        this.savedLastLogin.next(savedLastLogin);
    }

    changeLastResultsList(lastResultsList: any){
        this.lastResultsList.next(lastResultsList);
    }

    changeStartTrialGame(startTrialGame: any){
        this.startTrialGame.next(startTrialGame);
    }

    changeShowGuide(showGuide: any){
        this.showGuide.next(showGuide);
    }
}