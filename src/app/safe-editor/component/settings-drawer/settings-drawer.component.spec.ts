import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsDrawerComponent } from './settings-drawer.component';

describe('SetingsDrawerComponent', () => {
  let component: SettingsDrawerComponent;
  let fixture: ComponentFixture<SettingsDrawerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsDrawerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsDrawerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
