import type { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import SummarizerComponent from './summarizer.component';

describe('SummarizerComponent', () => {
  let component: SummarizerComponent;
  let fixture: ComponentFixture<SummarizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SummarizerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SummarizerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
