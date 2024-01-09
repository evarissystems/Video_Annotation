import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoannotateComponent } from './videoannotate.component';

describe('VideoannotateComponent', () => {
  let component: VideoannotateComponent;
  let fixture: ComponentFixture<VideoannotateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoannotateComponent]
    });
    fixture = TestBed.createComponent(VideoannotateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
