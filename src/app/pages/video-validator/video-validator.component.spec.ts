import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoValidatorComponent } from './video-validator.component';

describe('VideoValidatorComponent', () => {
  let component: VideoValidatorComponent;
  let fixture: ComponentFixture<VideoValidatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoValidatorComponent]
    });
    fixture = TestBed.createComponent(VideoValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
