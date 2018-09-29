import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MineComponent } from './Cell.component';

describe('MineComponent', () => {
  let component: MineComponent;
  let fixture: ComponentFixture<MineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
