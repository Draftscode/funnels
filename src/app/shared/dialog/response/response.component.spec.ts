import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseDialogComponent } from './response.component';

describe('ResponseComponent', () => {
  let component: ResponseDialogComponent;
  let fixture: ComponentFixture<ResponseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResponseDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
