export type GridProps = "None" | "Line" | "Dot";

export interface RulerGuideProps {
  ref: JSX.SharedProps["$ref"];
  zoom: number;
  guidesZoom: number;
  unit: number;
  marks: number[];
  onChangeGuides: (guides: any) => void;
}

export interface ViewportProps {
  /************************(VIEWPORT)************************/
  showViewportElement?: boolean;
  // setViewportElement?: (value: boolean) => void;

  /************************(RULER GUIDE X)************************/
  showRulerGuideX?: boolean;
  // setRulerGuideX?: (value: boolean) => void;

  /************************(RULER GUIDE Y)************************/
  showRulerGuideY?: boolean;
  // setRulerGuideY?: (value: boolean) => void;

  /************************(GRID)************************/
  grid?: GridProps;
  // setGrid?: (value: GridProps) => void;

  gridSpacing?: number;
  // setGridSpacing?: (value: number) => void;

  gridThickness?: number;
  // setGridThickness?: (value: number) => void;

  gridSection?: number;
  // setGridSection?: (value: number) => void;

  gridFadeDistance?: number;
  // setGridFadeDistance?: (value: number) => void;

  gridFadeStrength?: number;
  // setGridFadeStrength?: (value: number) => void;

  gridColor?: string;
  // setGridColor?: (value: string) => void;
}
