export class Bookmark {
  containerName: string;
  containerIndex: number;
  items: [{
    linkName: string;
    linkIndex: number;
    linkUrl: string
  }]

  constructor(config) {
  }
}
