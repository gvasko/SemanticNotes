import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { SVG } from '@svgdotjs/svg.js';
import { NoteRepositoryService } from '../services/note-repository.service';
import { SimilarityMatrix } from '../model/similarity-matrix';
import { Subscription } from 'rxjs';

class NotePoint {
  constructor(public x: number, public y: number, public noteId: number) { }
}

@Component({
  selector: 'lantor-note-map',
  standalone: false,
  templateUrl: './note-map.component.html',
  styleUrl: './note-map.component.scss'
})
export class NoteMapComponent implements OnInit, OnDestroy {

  private similarityMatrix: SimilarityMatrix | undefined = undefined;
  private notePoints: NotePoint[] = [];
  private draw: any;
  private animationFrameId: number | undefined;
  private needsRedraw = false;
  private frame = 0;

  private notesSubscription: Subscription | undefined;

  constructor(private noteRepositoryService: NoteRepositoryService) {

  }

  ngOnInit() {
    this.notesSubscription = this.noteRepositoryService.NotesSubject.subscribe((notes) => {
      this.stopAnimation();
      this.init().then(() => {
        this.redraw();
      });
    });
  }

  ngOnDestroy() {
    this.notesSubscription?.unsubscribe();
    this.stopAnimation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.redraw();
  }

  init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const collectionId = this.noteRepositoryService.CurrentNoteCollection?.id ?? 0;
      if (!collectionId) {
        console.log("Could not init similarity matrix")
        reject("Could not init similarity matrix");
        return;
      }
      this.noteRepositoryService.getSimilarityMatrix(collectionId).then((matrix) => {
        this.similarityMatrix = matrix;
        this.notePoints = this.initNotePoints();
        this.initSVG();
        this.animate();
        resolve();
      });
    });
  }

  redraw() {
    this.initSVG();
    this.needsRedraw = true;
    this.frame = 0;
    if (this.animationFrameId === 0) {
      this.animate();
    }
  }

  private initNotePoints(radius = 300): NotePoint[] {
    let points: NotePoint[] = [];

    if (!this.similarityMatrix) return points;

    for (let i = 0; i < this.similarityMatrix.noteIds.length; i++) {
      const angle = (i / this.similarityMatrix.noteIds.length) * 2 * Math.PI;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);
      points.push(new NotePoint(x, y, this.similarityMatrix.noteIds[i]));
    }

    return points;
  }

  private initSVG() {
    const container = document.getElementById('svgContainer');
    if (container) {
      const svgWidth = container.clientWidth;
      const svgHeight = container.clientHeight;
      if (!this.draw) {
        this.draw = SVG().addTo(container).size(svgWidth, svgHeight);
      } else {
        this.draw.size(svgWidth, svgHeight);
      }
    }
  }

  private updateSVG() {
    if (!this.draw) return;

    this.draw.clear();
    const centerX = this.draw.width() / 2;
    const centerY = this.draw.height() / 2;
    const circleDiameter = 20;

    for (let i = 0; i < this.notePoints.length; i++) {
      const x = centerX + this.notePoints[i].x;
      const y = centerY + this.notePoints[i].y;
      this.draw.circle(circleDiameter).attr({ cx: x, cy: y, fill: '#f06' });
      const circle = this.draw.circle(circleDiameter).attr({ cx: x, cy: y, fill: '#f06' });
      this.draw.text(this.similarityMatrix?.noteNames[i]).attr({ x: x, y: y, 'text-anchor': 'middle', 'dominant-baseline': 'middle', fill: '#000' });
    }
  }

  updateNotePoints(): NotePoint[] {
    const distanceUnit = 400;
    const epsilon = 10;
    let newPoints: NotePoint[] = [];

    if (!this.similarityMatrix) return newPoints;

    //const scaledValues = this.similarityMatrix.getScaledValues();
    const scaledValues = this.similarityMatrix.getRowBasedScaledValues();

    const order: number[] = Array.from({ length: this.notePoints.length }, (_, i) => i)
      .sort(() => Math.random() - 0.5);

    for (let ii = 0; ii < this.notePoints.length; ii++) {
      const i = order[ii];
      let newPoint = new NotePoint(this.notePoints[i].x, this.notePoints[i].y, this.notePoints[i].noteId);
      for (let jj = 0; jj < this.notePoints.length; jj++) {
        const j = order[jj];
        if (i === j) continue;
        const ijX = this.notePoints[i].x - this.notePoints[j].x;
        const ijY = this.notePoints[i].y - this.notePoints[j].y;
        const deltaIJX = ijX * 0.001;
        const deltaIJY = ijY * 0.001;
        const distance = Math.sqrt(Math.pow(ijX, 2) + Math.pow(ijY, 2));
        const expectedDistance = (1.0 - scaledValues[i][j]) * distanceUnit;
        if (Math.abs(distance - expectedDistance) < epsilon) continue;
        else if (distance > expectedDistance) {
          newPoint.x -= deltaIJX;
          newPoint.y -= deltaIJY;
        } else {
          newPoint.x += deltaIJX;
          newPoint.y += deltaIJY;
        }

      }
      newPoints.push(newPoint);
    }

    newPoints.sort((a, b) => a.noteId - b.noteId);

    let centerX = 0.0;
    let centerY = 0.0;

    newPoints.forEach((p) => {
      centerX += p.x;
      centerY += p.y;
    });

    centerX /= newPoints.length;
    centerY /= newPoints.length;

    newPoints.forEach((p) => {
      p.x -= centerX;
      p.y -= centerY;
    });

    return newPoints;
  }

  private animate() {
    this.notePoints = this.needsRedraw ? this.initNotePoints() : this.updateNotePoints();
    this.needsRedraw = false;
    this.updateSVG();
    //if (this.frame++ < 5000) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    //} else {
    //  this.animationFrameId = 0;
    //}
  }

  stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0
    }
  }

}
