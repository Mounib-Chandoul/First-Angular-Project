import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingDetailsComponent } from './training-details';

describe('TrainingDetails', () => {
  let component: TrainingDetailsComponent;
  let fixture: ComponentFixture<TrainingDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainingDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainingDetailsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
