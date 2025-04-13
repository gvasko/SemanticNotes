import { Component, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
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
export class NoteMapComponent implements OnInit, AfterViewInit, OnDestroy {

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
      this.init();
      this.redraw();
    });
  }

  ngAfterViewInit() {
    this.init();
  }


  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.notesSubscription?.unsubscribe();
  }

  init() {
    const collectionId = this.noteRepositoryService.CurrentNoteCollection?.id ?? 0;
    if (!collectionId) {
      console.log("Could not init similarity matrix")
      return;
    }
    this.noteRepositoryService.getSimilarityMatrix(collectionId).then((matrix) => {
      this.similarityMatrix = matrix;
      this.notePoints = this.initNotePoints();
      this.initSVG();
      this.animate();
    });
  }

  redraw() {
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
      const svgHeight = svgWidth * 0.5;
      if (!this.draw) {
        this.draw = SVG().addTo(container).size(svgWidth, svgHeight);
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

    for (let i = 0; i < this.notePoints.length; i++) {
      let newPoint = new NotePoint(this.notePoints[i].x, this.notePoints[i].y, this.notePoints[i].noteId);
      for (let j = 0; j < this.notePoints.length; j++) {
        if (i === j) continue;
        const ijX = this.notePoints[i].x - this.notePoints[j].x;
        const ijY = this.notePoints[i].y - this.notePoints[j].y;
        const deltaIJX = ijX * 0.001;
        const deltaIJY = ijY * 0.001;
        const distance = Math.sqrt(Math.pow(ijX, 2) + Math.pow(ijY, 2));
        const expectedDistance = (1.0 - this.similarityMatrix.values[i][j]) * distanceUnit;
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

    return newPoints;
  }

  private animate() {
    this.notePoints = this.needsRedraw ? this.initNotePoints() : this.updateNotePoints();
    this.needsRedraw = false;
    this.updateSVG();
    if (this.frame++ < 1000) {
      this.animationFrameId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationFrameId = 0;
    }
  }
}
