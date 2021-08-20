import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFunnelDialogComponent } from './create-funnel-dialog.component';

describe('CreateFunnelDialogComponent', () => {
  let component: CreateFunnelDialogComponent;
  let fixture: ComponentFixture<CreateFunnelDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFunnelDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFunnelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
