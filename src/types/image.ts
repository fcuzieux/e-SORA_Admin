export interface ImageDimensions {
  width: number;
  height: number;
}

export interface ResizeOptions extends ImageDimensions {
  imageUrl: string;
}
