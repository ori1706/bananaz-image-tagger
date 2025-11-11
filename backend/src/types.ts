export interface User {
  id: string;
  name: string;
}

export interface Image {
  id: string;
  url: string;
  createdBy: string;
}

export interface Thread {
  id: string;
  imageId: string;
  x: number;
  y: number;
  comment: string;
  createdBy: string;
}

