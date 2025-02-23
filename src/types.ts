export interface TextLayer {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fontFamily: string;
  color: string;
  rotation: number;
  opacity: number;
  outlineWidth: number;
  outlineColor: string;
  shadowBlur: number;
  shadowColor: string;
  textAlign: 'left' | 'center' | 'right';
}

export interface ImageState {
  file: File | null;
  preview: string | null;
  mask: ImageData | null;
}

export interface TextHistory {
  past: TextLayer[][];
  present: TextLayer[];
  future: TextLayer[][];
}