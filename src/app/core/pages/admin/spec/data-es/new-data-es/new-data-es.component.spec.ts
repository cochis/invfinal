import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDataEsComponent } from './new-data-es.component';

describe('NewDataEsComponent', () => {
  let component: NewDataEsComponent;
  let fixture: ComponentFixture<NewDataEsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewDataEsComponent]
    });
    fixture = TestBed.createComponent(NewDataEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
