import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';

import { Subject } from 'rxjs';
declare var webkitSpeechRecognition: any;

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = ['en', 'es', 'de', 'it', 'ru'];

  constructor(public translate: TranslateService, private cookieService: CookieService) {
    let browserLang;
    this.translate.addLangs(this.languages);
    if (this.cookieService.check('lang')) {
      browserLang = this.cookieService.get('lang');
    }
    else {
      this.setLanguage('en');
      browserLang = translate.getBrowserLang();
    }
    translate.use(browserLang.match(/en|es|de|it|ru/) ? browserLang : 'en');
  }

  public setLanguage(lang) {
    this.translate.use(lang);
    this.cookieService.set('lang', lang);
  }

  // Voice input
recognition: any;
isStoppedSpeechRecog = false;
public text = '';
private voiceToTextSubject: Subject<string> = new Subject();
private speakingPaused: Subject<any> = new Subject();
private tempWords: string = '';
// isRecording:boolean=false;
// recognition: SpeechRecognition | null = null;
speechInput() {
  return this.voiceToTextSubject.asObservable();
}
init() {
  this.recognition = new webkitSpeechRecognition();
  this.recognition.interimResults = true;
  this.recognition.lang = 'hi-IN';

  this.recognition.addEventListener('result', (e: any) => {
    const transcript = Array.from(e.results)
      .map((result: any) => result[0])
      .map((result) => result.transcript)
      .join('');
    this.tempWords = transcript;
    this.voiceToTextSubject.next(this.text || transcript);
  });
  return this.initListeners();
}

initListeners() {
  this.recognition.addEventListener('end', (condition: any) => {
    this.recognition.stop();
  });
  return this.speakingPaused.asObservable();
}

/**
 * @description Function to mic on to listen.
 */
start() {
  this.text = '';
  this.isStoppedSpeechRecog = false;
  this.recognition.start();
  this.recognition.addEventListener('end', (condition: any) => {
    if (this.isStoppedSpeechRecog) {
      this.recognition.isActive = true;
      this.recognition.stop();
    } else {
      this.isStoppedSpeechRecog = false;
      this.wordConcat();
      // Checked time with last api call made time so we can't have multiple start action within 200ms for countinious listening
      // Fixed : ERROR DOMException: Failed to execute 'start' on 'SpeechRecognition': recognition has already started.
      if (!this.recognition.lastActiveTime || (Date.now() - this.recognition.lastActive) > 200) {
        this.recognition.start();
        this.recognition.lastActive = Date.now();
      }
    }
    this.voiceToTextSubject.next(this.text);
  });
}
stop() {
  // this.text = '';
  this.isStoppedSpeechRecog = true;
  this.wordConcat()
  this.recognition.stop();
  this.recognition.isActive = false;
  this.speakingPaused.next('Stopped speaking');
}

/**
 * @description Merge previous input with latest input.
 */
wordConcat() {
  this.text = this.text.trim() + ' ' + this.tempWords;
  this.text = this.text.trim();
  this.tempWords = '';
}
}
