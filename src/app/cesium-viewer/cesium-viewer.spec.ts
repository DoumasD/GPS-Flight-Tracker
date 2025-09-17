import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CesiumViewer } from './cesium-viewer';

describe('CesiumViewer', () => {
  let component: CesiumViewer;
  let fixture: ComponentFixture<CesiumViewer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CesiumViewer]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CesiumViewer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
