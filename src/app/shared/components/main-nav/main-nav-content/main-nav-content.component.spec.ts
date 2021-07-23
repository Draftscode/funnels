import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNavContentComponent } from './main-nav-content.component';

describe('MainNavContentComponent', () => {
  let component: MainNavContentComponent;
  let fixture: ComponentFixture<MainNavContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MainNavContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
