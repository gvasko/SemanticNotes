export class Tag {
  name?: string;
  value?: string;

  constructor(source: Tag) {
    this.name = source.name;
    this.value = source.value;
  }
}
