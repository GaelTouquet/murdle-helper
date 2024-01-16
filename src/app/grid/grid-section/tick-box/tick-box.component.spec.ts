import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TickBoxComponent } from './tick-box.component';

describe('TickBoxComponent', () => {
  let component: TickBoxComponent;
  let fixture: ComponentFixture<TickBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TickBoxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TickBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
