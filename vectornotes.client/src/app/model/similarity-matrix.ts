export class SimilarityMatrix {
  noteIds: number[] = [];
  noteNames: string[] = [];
  values: number[][] = [];

  constructor(source: SimilarityMatrix) {
    this.noteIds = [...source.noteIds];
    this.noteNames = [...source.noteNames];
    this.values = source.values.map(innerArray => [...innerArray]);
  }

  getScaledValues(): number[][] {
    let minSimilarity = 1.0;
    let maxSimilarity = 0.0;

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values.length; j++) {
        if (i === j) continue;
        const matrixValue = this.values[i][j];
        if (matrixValue < minSimilarity) minSimilarity = matrixValue;
        if (matrixValue > maxSimilarity) maxSimilarity = matrixValue;
      }
    }

    const scaledValues: number[][] = this.values.map(innerArray => [...innerArray]);
    const original100 = maxSimilarity - minSimilarity;

    for (let i = 0; i < this.values.length; i++) {
      for (let j = 0; j < this.values.length; j++) {
        if (i === j) continue;
        const factor = (this.values[i][j] - minSimilarity) / original100;
        scaledValues[i][j] = factor;
      }
    }
    return scaledValues;
  }

  getRowBasedScaledValues(): number[][] {

    const scaledValues: number[][] = this.values.map(innerArray => [...innerArray]);

    for (let i = 0; i < this.values.length; i++) {
      let minSimilarity = 1.0;
      let maxSimilarity = 0.0;

      for (let j = 0; j < this.values.length; j++) {
        if (i === j) continue;
        const matrixValue = this.values[i][j];
        if (matrixValue < minSimilarity) minSimilarity = matrixValue;
        if (matrixValue > maxSimilarity) maxSimilarity = matrixValue;
      }

      const original100 = maxSimilarity - minSimilarity;
      for (let j = 0; j < this.values.length; j++) {
        if (i === j) continue;
        const factor = (this.values[i][j] - minSimilarity) / original100;
        scaledValues[i][j] = factor;
      }
    }
    return scaledValues;
  }
}
