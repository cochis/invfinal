import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDataEsComponent } from './edit-data-es.component';

describe('EditDataEsComponent', () => {
  let component: EditDataEsComponent;
  let fixture: ComponentFixture<EditDataEsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditDataEsComponent]
    });
    fixture = TestBed.createComponent(EditDataEsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
