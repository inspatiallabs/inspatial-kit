// import { SliderProps, SwitchProps } from "@inspatial/kit/input"; // TODO:(@benemma)
// import { BlockProps } from "@inspatial/kit/ornament"; // TODO:(@benemma)

/****************************************(VIEWPORT SETTINGS TEMPLATE)*****************************************/

export type SceneControlModeProps = "Select" | "Pan" | "Orbit";

export type SceneSettingsModeProps = "AllSettings" | "PostEffectSettings";

export type VirtualBackgroundProps = "None" | "Indoor" | "Outdoor";

export type CameraProjectionProps = "Perspective" | "Orthographic";

export type CameraDirectionProps =
  | "Top"
  | "Bottom"
  | "Left"
  | "Right"
  | "Front"
  | "Bottom";

export type CameraDollyCountProps = {
  distance: number;
  enableTransition: boolean;
};

export type InitialAssetPositionProps = "Auto" | "Manual";

export type CameraAngleGizmoProps = "CubeGizmo" | "AxesGizmo" | "CompassGizmo";

/****************************************(PRIMITIVE TRANSFORM TEMPLATE)*****************************************/

export type TransformModeProps = "Size" | "Rotate" | "Position";

export type Transform = {
  x?: number | undefined;
  y?: number | undefined;
  z?: number | undefined;
};

export type TransformProps = {
  // Transforms
  scale?: {
    x: number;
    y: number;
    z: number;
  };

  position?: {
    x: number;
    y: number;
    z: number;
  };
  rotate?: {
    x: number;
    y: number;
    z: number;
  };
};

/****************************************(PRIMITIVE LIGHT TEMPLATE)*****************************************/

//PRIMITIVE LIGHT SETTINGS PROPERTIES (DO NOT DELETE)
export interface PrimitiveLightSettingsProps {
  color?: string;
  intensity?: number;
}

//PRIMITIVE DIRECTIONAL LIGHT SETTINGS PROPERTIES
export interface PrimitiveDirectionalLightSettingsProps
  extends PrimitiveLightSettingsProps {}

//PRIMITIVE POINT LIGHT SETTINGS PROPERTIES
export interface PrimitivePointLightSettingsProps
  extends PrimitiveLightSettingsProps {
  distance: number;
  decay: number;
}

//PRIMITIVE SPOT LIGHT SETTINGS PROPERTIES
export interface PrimitiveSpotLightSettingsProps
  extends PrimitiveLightSettingsProps {
  //Important
  anglePower: number; // used in place of intensity
  distance: number;
  angle: number;
  attenuation: number; // range
  radiusTop: number; // top-width
  radiusBottom: number; // bottom-width

  //Optional
  penumbra?: number;
  decay?: number;
}

//PRIMITIVE HEMISPHERE LIGHT SETTINGS PROPERTIES
export interface PrimitiveRectSceneeaLightSettingsProps
  extends PrimitiveLightSettingsProps {
  width: number;
  height: number;
}

/****************************************(PRIMITIVE TEXT 3D TEMPLATE)*****************************************/

// PRIMITIVE TEXT-3D (TextGeometry) PROPERTIES
export interface PrimitiveText3dSettingsProps {
  text: string;
  fontFamily: string;
  fontThickness: number; // Font Thickness extrusion or (depth)
  curveSegments: number;

  smoothness?: number; // Smoothness of the font

  bevelEnabled?: boolean;
  bevelSegments?: number; // Round Corners
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
}

/****************************************(PRIMITIVE SVG)*****************************************/

// PRIMITIVE SVG PROPERTIES
export interface PrimitiveSvgSettingsProps {
  src: string;
}

/****************************************(PRIMITIVE SHAPES TEMPLATE)*****************************************/
// PRIMITIVE SHAPE PROPERTIES
export type ShapeProps =
  | "cube"
  | "sphere"
  | "cone"
  | "cylinder"
  | "rectangle"
  | "circle"
  | "triangle"
  | "ring"
  | "donut"
  | "pill"
  | "gem"
  | "tube";

// PRIMITIVE 3D VECTOR SETTINGS PROPERTIES (DO NOT DELETE)
export interface Primitive3DVectorToolSettingsProps {
  points?: Vector3[];
  color?: string;
  lineWidth?: number;
  closed?: boolean;
  smooth?: boolean;
  editable?: boolean;
  onPointsChange?: (points: Vector3[]) => void;
  onShapeComplete?: () => void;
}

// PRIMITIVE 3DFY SETTINGS PROPERTIES
export interface PrimitiveExtrudeSettingsProps {
  depth?: number;
  bevelEnabled?: boolean;
  bevelThickness?: number;
  bevelSize?: number;
  bevelOffset?: number;
  bevelSegments?: number;
  curveSegments?: number;
  steps?: number;

  extrudePath?: Vector3[] | undefined;
  uvGenerator?: UVGenerator | undefined;

  // frames?: Object3D[];
  // bendPath?: Curve<Vector3>;
  // closePath?: boolean;
}

/*########################[2D SHAPES]########################*/

// PRIMITIVE CIRCLE SETTINGS PROPERTIES *2D/3D* (DO NOT DELETE)
export interface PrimitiveCircleSettingsProps
  extends PrimitiveExtrudeSettingsProps {
  radius?: number;
  segments?: number;
  angleX?: number; // thetaStscenet
  angleY?: number; // thetaLength
}

// PRIMITIVE RECTANGLE SETTINGS PROPERTIES *2D/3D* (DO NOT DELETE)
export interface PrimitiveRectangleSettingsProps
  extends PrimitiveExtrudeSettingsProps {
  width?: number;
  height?: number;
  widthSegments?: number;
  heightSegments?: number;
}

//PRIMITIVE TRIANGLE SETTINGS PROPERTIES *2D/3D* (DO NOT DELETE)
export interface PrimitiveTriangleSettingsProps
  extends PrimitiveExtrudeSettingsProps,
    Primitive3DVectorToolSettingsProps {}

//PRIMITIVE RING SETTINGS PROPERTIES *2D/3D* (DO NOT DELETE)
export interface PrimitiveRingSettingsProps
  extends PrimitiveExtrudeSettingsProps {
  innerRadius?: number;
  outerRadius?: number;
  thetaSegments?: number; // thetaSegments
  phiSegments?: number; // phiSegments
  angleX?: number; // thetaStscenet
  angleY?: number; // thetaLength
}

/*########################[3D SHAPES]########################*/

// PRIMITIVE CUBE (BoxGeometry) SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveCubeSettingsProps {
  width?: number;
  height?: number;
  /**
   * The depth of the cube.
   */
  depth?: number;
  /**
   * Radius of the rounded corners. Default is 0.05
   */
  radius?: number;
  /**
   * The number of curve segments. Default is 4
   */
  smoothness?: number;
  /**
   * Smooth normals everywhere except faces that meet at an angle greater than the crease angle
   */
  creaseAngle?: number;
  /**
   *  The number of segments to use
   */
  steps?: number;
}

// PRIMITIVE CONE SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveConeSettingsProps {
  radius?: number; //radius (Volume)
  /**
   * The height of the cone. The default value is 1.
   */
  height?: number; //height (Stretch)
  /**
   * The number of subdivisions sceneound the circumference of the cone. The default value is 8.
   */
  radialSegments?: number; //radialSegments (Corner Smoothness)
  /**
   * The number of subdivisions along the height of the cone. The default value is 8.
   */
  heightSegments?: number; //heightSegments (Resolution-Y)
  /**
   * Whether the cone is open (with top and bottom). The default value is false.
   */
  openEnded?: boolean | undefined; //open Cone

  /**
   * The central angle of the circulscene sector, in radians. The default value is 2 * Math.PI.
   */
  angleX?: number; // thetaStscenet (Spin-X)
  /**
   * The central angle of the circulscene sector, in radians. The default value is Math.PI * 2.
   */
  angleY?: number; // thetaLength (Corner Fill)
}

// PRIMITIVE CYLINDER SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveCylinderSettingsProps {
  radiusTop?: number; // Top Volume

  radiusBottom?: number; // Bottom Volume
  /**
   * The height of the cylinder. The default value is 1.
   */
  height?: number; //Stretch
  /**
   * The number of subdivisions sceneound the circumference of the cylinder. The default value is 8.
   */
  radialSegments?: number; //Corner Smoothness
  /**
   * The number of subdivisions along the height of the cylinder. The default value is 8.
   */
  heightSegments?: number; //Resolution-Y
  /**
   * Whether the cylinder is open (with top and bottom). The default value is false.
   */
  openEnded?: boolean; //Open Cylinder

  /**
   * The central angle of the circulscene sector, in radians. The default value is 2 * Math.PI.
   */
  angleX?: number; // thetaStscenet (Spin-X)

  /**
   * The central angle of the circulscene sector, in radians. The default value is Math.PI * 2.
   */
  angleY?: number; // thetaLength (Corner Fill)
}

//PRIMITIVE SPHERE SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveSphereSettingsProps {
  radius?: number;
  widthSegments?: number;
  heightSegments?: number;
  phiStscenet?: number;
  phiLength?: number;
  angleX?: number; // phiLength
  angleY?: number; // thetaLength
}

// PRIMITIVE DONUT (TorusGeometry) SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveDonutSettingsProps {
  radius?: number;
  tube?: number;
  radialSegments?: number;
  tubulsceneSegments?: number;
  scenec?: number; // corner fill
}

type Texture = unknown | undefined;
type Vector2 = [number, number] | undefined;

// PRIMITIVE VASE (LatheGeometry) SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveGemSettingsProps {
  segments?: Vector2[] | undefined;
  phiStscenet?: number;
  phiLength?: number;
}

// PRIMITIVE TUBE (TorusKnotGeometry) SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveTubeSettingsProps {
  radius?: number;
  tube?: number;
  tubulsceneSegments?: number;
  radialSegments?: number;
  p?: number;
  q?: number;
}

// PRIMITIVE PILL (CapsuleGeometry) SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitivePillSettingsProps {
  radius?: number;
  length?: number;
  capSegments?: number;
  radialSegments?: number;
}

/****************************************(PRIMITIVE PSceneTICLE EMITTERS TEMPLATE)*****************************************/
export interface PrimitiveCloudPsceneticlesSettingsProps {
  color?: string;
  speed?: number;
  width?: number;
  depth?: number;
  depthTest?: boolean;
  segments?: number;
}

export interface PrimitiveSpscenekPsceneticlesSettingsProps {
  color?: string;
  count?: number;
  speed?: number;
  size?: number;
  scale?: number;
  noise?: number;
}

/****************************************(PRIMITIVE TEXTURE & COLOR TEMPLATE)*****************************************/
export interface SceneAssetTextureAndColorSettingsProps {
  mode?: "Generate" | "Texture" | "Color";
  type?: "All" | "Wood" | "Rock" | "Fabric" | "Plastic" | "Other";
  texture?: Texture | null | undefined;
  color?: Vector2 | undefined;
}

/****************************************(PRIMITIVE EFFECT TEMPLATE)*****************************************/
export type MaterialTypes = "Standscened" | "Physical";

export interface SceneAssetEffectSettingsProps {
  material: MaterialTypes;
  wireframe?: boolean;
  flatShading?: boolean;

  // BOTH: Standscened & Physical Material Settings
  envMapIntensity?: number | undefined; // envMapIntensity call it (refraction)
  roughness?: number | undefined; // roughnessMap
  metalness?: number | undefined; //  metalnessMap

  // ONLY: Physical Material Settings
  reflectivity?: number | undefined; // reflectivity
  clescenecoat?: number | undefined; // clesceneCoat
  clescenecoatRoughness?: number | undefined; // clesceneCoatRoughness
}

/****************************************(PRIMITIVE SHADOW & VISIBILITY TEMPLATE)*****************************************/
export interface SceneAssetShadowAndVisibilitySettingsProps {
  visible?: boolean;
  castShadow?: boolean;
  receiveShadow?: boolean;
  opacity?: number;
  side?: 0 | 1 | 2; // call it assetDisplay where 0: FrontSide, 1: BackSide, 2: BothSide
}

export interface ShapeShadowAndVisibilitySettingsProps
  extends SceneAssetShadowAndVisibilitySettingsProps {}

export interface LightShadowAndVisibilitySettingsProps
  extends Omit<
    SceneAssetShadowAndVisibilitySettingsProps,
    "assetVisibility" | "receiveShadow"
  > {}

export interface AvatsceneShadowAndVisibilitySettingsProps
  extends SceneAssetShadowAndVisibilitySettingsProps {}

/****************************************(PRIMITIVE INTERACTION TEMPLATE)*****************************************/
export type SceneAssetInteractionTrigger =
  | "None"
  | "AfterDelay"
  | "OnStscenet"
  | "OnPointerUp"
  | "ProximityEnter" // When a user moves close to the scene asset
  | "ProximityExit" // When a user moves away from the scene asset
  | "OnMove"
  | "OnScale"
  | "OnRotate";

export type SceneAssetInteractionAction =
  | "None"
  | "PlaySound"
  | "PlayVideo"
  | ("PlayAnimation" & {
      type:
        | "Linescene"
        | "Ease"
        | "EaseIn"
        | "EaseOut"
        | "EaseInOut"
        | "Bezier"
        | "Spring";
    });

export type SceneAssetInteractionActionPrimitive =
  | "None"
  | "RecordVideo"
  | "PauseVideo"
  | "TakePhoto"
  | "Shscenee"
  | "OpenURL"
  | "Exit"
  | "ClaimRewscened";

export interface SceneAssetInteractionSettingsProps {
  trigger?: SceneAssetInteractionTrigger;
  action?: SceneAssetInteractionAction;
  actionPrimitive?: SceneAssetInteractionActionPrimitive;
  duration?: number;
  delay?: number;
}

export interface SceneAssetPhysicsSettingsProps {
  isEnabled?: boolean;
  type?: "fixed" | "dynamic" | "kinematicPosition" | "kinematicVelocity";
  mass?: number; // Mass
  friction?: number; // Friction
  bounciness?: number; // Restitution
  gravity?: number; // GravityScale
  linesceneDamping?: number; // LinesceneDamping (Air Resistance)
  angulsceneDamping?: number; // AngulsceneDamping (Rotational Friction)
}

/*****************************************************************************/
/*******************************(SUB TYPES)*******************************/
/*****************************************************************************/
export type SceneEditorModeProps = "Design" | "Interact";
export type SceneAssetModalMenuProps = "Components" | "Store" | "Librsceney";
export type SceneEngineTypeProps = "web" | "mobile" | "sceneGlass";
export type SceneEngineProps = "InGPU" | "AndroidXR" | "HorizonOS" | "VisionOS";

export type ScenePlacementProps = "Surface" | "Image" | "Body"; //Add Plane Estimation, GeoSpatial, and Scene Reconstruction later
export type SurfacePlacementProps = "Horizontal" | "Vertical";
export type ImagePlacementProps = "Flat" | "Cylindrical" | "Conical";
export type BodyPlacementProps = "Head" | "Foot" | "Hand" | "Body";

export type SceneOccluderProps =
  | "None"
  | "HorizontalPlaneOccluder"
  | "VerticalPlaneOccluder"
  | "HeadOccluder"
  | "FootOccluder"
  | "FlatImageOccluder"
  | "CylindricalImageOccluder"
  | "ConicalImageOccluder"
  | "GeospatialOccluder";

export type SceneEditorMenuProps =
  | "AssetHierscenechy"
  | "Hotspots"
  | "Settings"
  | "PostEffectFilters"
  | "None";

// deno-lint-ignore no-empty-interface
export interface SceneEditorAssetHierarchyProps {}

export type InspectorPanelProps = "SceneSettings" | "AssetProperties";

export type PropertiesPanelProps = "Properties" | "Interaction";

export type SceneAssetTypeProps =
  | "3d-model"
  | "image"
  | "video"
  | "audio"
  | "text"
  | "svg"
  | "script"
  | "group"
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone"
  | "rectangle"
  | "circle"
  | "triangle"
  | "ring"
  | "donut"
  | "pill"
  | "gem"
  | "tube"
  | "directionalLight"
  | "pointLight"
  | "spotLight"
  | "rectAreaLight"
  | "cloudParticles"
  | "sparkParticles"
  | undefined;

/***********************************(Scene File Upload Properties)***********************************/

export type MediaFileTypes = "image" | "video" | "audio" | "3d-model";

// 3D Model File Upload Properties
export type ModelFileTypes = "gltf" | "glb" | "fbx";
// | 'obj' | 'stl';
export interface ModelProps {
  fileType: ModelFileTypes;
  src: string;
}

// // Image File Upload Properties
// export interface ImageProps {}

// // Video File Upload Properties
export type VideoFileTypes = "mp4" | "webm" | "ogg";
export interface PrimitiveSpatialVideoSettingsProps {
  src: MediaStream | string;
}

// Audio File Upload Properties
export type AudioFileTypes = "mp3" | "wav" | "ogg";
export interface PrimitiveSpatialAudioSettingsProps
  extends PrimitiveAudioSettingsProps {
  ref?: JSX.SharedProps["$ref"];
  src?: string;
  distance?: number;
  duration?: number;
  detune?: number;
}

// All File Types
export type FileTypes = ModelFileTypes | AudioFileTypes;

/***********************************(Scene Properties)***********************************/

export type ScenePropertiesProps =
  //   | SceneAssetMaterialSettingsProps
  | SceneAssetShadowAndVisibilitySettingsProps
  | SceneAssetTextureAndColorSettingsProps
  | SceneAssetInteractionSettingsProps;

/***********************************(Shape Props)***********************************/
export type CubeProps = ScenePropertiesProps & PrimitiveCubeSettingsProps;
export type SphereProps = ScenePropertiesProps & PrimitiveSphereSettingsProps;
export type ConeProps = ScenePropertiesProps & PrimitiveConeSettingsProps;
export type CylinderProps = ScenePropertiesProps &
  PrimitiveCylinderSettingsProps;
export type RectangleProps = ScenePropertiesProps &
  PrimitiveRectangleSettingsProps;
export type CircleProps = ScenePropertiesProps & PrimitiveCircleSettingsProps;
export type TriangleProps = ScenePropertiesProps &
  PrimitiveTriangleSettingsProps;
export type RingProps = ScenePropertiesProps & PrimitiveRingSettingsProps;
export type DonutProps = ScenePropertiesProps & PrimitiveDonutSettingsProps;
export type PillProps = ScenePropertiesProps & PrimitivePillSettingsProps;
export type GemProps = ScenePropertiesProps & PrimitiveGemSettingsProps;
export type TubeProps = ScenePropertiesProps & PrimitiveTubeSettingsProps;

/***********************************(Scene Asset Props)***********************************/
/**
 * The SceneAsset is the object that holds all of the assets properties in the scene
 */
export interface SceneAssetProps {
  // Must Always Have
  id: string;
  name?: string;
  assetType?: SceneAssetTypeProps;
}

/**
 * Responsible for Processing the Media File (Image, Video, Audio, 3D Model, SVG etc)
 */
export interface FileUploadWrapperProps extends SceneAssetProps {
  file?: File;
  label?: string;
  accept?: string;
  onChange: (url: string) => void;
}

export interface RangeSliderWrapperProps extends SceneAssetProps, SliderProps {
  label?: string;
}

export interface SwitchWrapperProps extends SceneAssetProps, SwitchProps {
  label?: string;
}

/************************(Scene Asset Settings)************************/
/**
 *  The SceneAssetSettingsProps is the object that holds all of the settings for each asset
 */

/*########################[FOR VIDEOS]########################*/
//PRIMITIVE VIDEO SETTINGS PROPERTIES *2D* (DO NOT DELETE)
export interface PrimitiveVideoSettingsProps
  extends PrimitiveMediaSettingsProps {
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  start?: boolean;
  crossOrigin?: string;
  controls?: boolean;
  unsuspend?: "canplay" | "canplaythrough" | "loadedmetadata";
}

//PRIMITIVE VIDEO SETTINGS PROPERTIES *3D* (DO NOT DELETE)
export interface PrimitiveVideoSettings3DProps
  extends PrimitiveVideoSettingsProps {
  name?: string;
  showTransformControls?: boolean;
  isLocked?: boolean;
}

//PRIMITIVE AUDIO SETTINGS PROPERTIES *2D* (DO NOT DELETE)
export interface PrimitiveAudioSettingsProps
  extends PrimitiveVideoSettingsProps {}

/*########################[FOR 3D MODEL]########################*/
//PRIMITIVE 3D SETTINGS PROPERTIES (DO NOT DELETE)
export interface Primitive3DSettingsProps {
  name?: string;
  showTransformControls?: boolean;
  isVisible?: boolean;
  isLocked?: boolean;
  url?: string | null;
  flip?: {
    horizontal?: 1 | -1;
    vertical?: 1 | -1;
  };
}

type SceneAssetSettingsProps = {
  "3d-model": Primitive3DSettingsProps | undefined;
  image: unknown | undefined;
  video: PrimitiveVideoSettings3DProps | undefined;
  audio: PrimitiveSpatialAudioSettingsProps | undefined;
  text: PrimitiveText3dSettingsProps | undefined;
  svg: PrimitiveSvgSettingsProps | undefined;
  script: unknown | undefined;
  group: unknown | undefined;
  cube: PrimitiveCubeSettingsProps | undefined;
  sphere: PrimitiveSphereSettingsProps | undefined;
  cone: PrimitiveConeSettingsProps | undefined;
  cylinder: PrimitiveCylinderSettingsProps | undefined;
  rectangle: PrimitiveRectangleSettingsProps | undefined;
  circle: PrimitiveCircleSettingsProps | undefined;
  triangle: PrimitiveTriangleSettingsProps | undefined;
  ring: PrimitiveRingSettingsProps | undefined;
  donut: PrimitiveDonutSettingsProps | undefined;
  pill: PrimitivePillSettingsProps | undefined;
  gem: PrimitiveGemSettingsProps | undefined;
  tube: PrimitiveTubeSettingsProps | undefined;
  directionalLight: PrimitiveDirectionalLightSettingsProps;
  pointLight: PrimitivePointLightSettingsProps;
  spotLight: PrimitiveSpotLightSettingsProps;
  rectSceneeaLight: PrimitiveRectSceneeaLightSettingsProps;
  cloudPsceneticles: PrimitiveCloudPsceneticlesSettingsProps | undefined;
  spscenekPsceneticles: PrimitiveSpscenekPsceneticlesSettingsProps | undefined;
  // Add More Settings Here... e.g for InHumanic
};

/************************(Post Processing Effect Filters)************************/
/**
 */

type BlendFunctionProps = unknown | undefined;

type BloomPostEffectProps = {
  isEnabled?: boolean;
  intensity?: number;
  /** luminance threshold. Raise this value to mask out dsceneker elements in the scene.*/
  luminanceThreshold?: number;
  /** smoothness of the luminance threshold. Range is [0, 1]*/
  luminanceSmoothing?: number;
  /** Enables or disables mipmap blur. */
  mipmapBlur?: boolean;
  /**The horizontal resolution. */
  resolutionX?: number | undefined;
  /**The vertical resolution. */
  resolutionY?: number | undefined;
  kernelSize?: number;
  blurPass?: unknown;
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};
/**
 * Blur also know as Depth of Field (DOF)
 */
type BlurPostEffectProps = {
  isEnabled?: boolean;
  /** Where to focus the blur */
  focusDistance?: number;
  focalLength?: number;
  bokehScale?: number;
  blendFunction?: BlendFunctionProps;
};

/** The combination of Grid Effect & Dot Screen Post Effect */
type HalftonePostEffectProps = {
  isEnabled?: boolean;
  type?: "DotScreen" | "GridEffect";
  angle?: number;
  scale?: number;
  lineWidth?: number;
  size?: { width: number; height: number };
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};

interface GridPostEffectProps
  extends Omit<HalftonePostEffectProps, "type" | "angle"> {}
interface DotScreenPostEffectProps
  extends Omit<HalftonePostEffectProps, "type" | "lineWidth" | "Size"> {}

type GlitchPostEffectProps = {
  isEnabled?: boolean;
  /** min and max glitch delay  */
  delay?: (Vector2 & Vector2) | undefined;
  /** min and max glitch duration */
  duration?: (Vector2 & Vector2) | undefined;
  /** min and max glitch strength */
  strength?: (Vector2 & Vector2) | undefined;
  /** Glitch mode */
  mode?: unknown | undefined;
  /** turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED) */
  active?: boolean;
  /** Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches */
  ratio?: number;
  /** The blend mode of this blend function. */
  blendFunction?: BlendFunctionProps;
};

/** The combination of Brightness & Contrast Post Effects */
type LuminosityPostEffectProps = {
  isEnabled?: boolean | undefined;
  brightness?: number | undefined;
  contrast?: number | undefined;
  blendFunction?: BlendFunctionProps | undefined;
};

/** The Combination of Hue & Saturation Post Effects */
type SpectrumPostEffectProps = {
  isEnabled?: boolean;
  hue?: number;
  saturation?: number;
  blendFunction?: BlendFunctionProps;
};

type NoisePostEffectProps = {
  isEnabled?: boolean;
  premultiply?: boolean;
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};

type PixelationPostEffectProps = {
  isEnabled?: boolean;
  granulsceneity?: number;
};

type SepiaPostEffectProps = {
  isEnabled?: boolean;
  intensity?: number;
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};

type ScanlinePostEffectProps = {
  isEnabled?: boolean;
  density?: number;
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};

type VignettePostEffectProps = {
  isEnabled?: boolean;
  offset?: number;
  dscenekness?: number;
  eskil?: boolean;
  opacity?: number;
  blendFunction?: BlendFunctionProps;
};

type AllPostProcessingEffectFiltersProps = {
  bloom?: BloomPostEffectProps;
  blur?: BlurPostEffectProps;
  glitch?: GlitchPostEffectProps;
  halftone?: HalftonePostEffectProps; // dot screen & grid
  luminosity?: LuminosityPostEffectProps; // brightnessContrast
  spectrum?: SpectrumPostEffectProps; // hue saturation
  pixelation?: PixelationPostEffectProps; // pixelation
  noise?: NoisePostEffectProps;
  vignette?: VignettePostEffectProps;
  sepia?: SepiaPostEffectProps;
  scanline?: ScanlinePostEffectProps;
};

/******************************************************************************************************************************/
/*****************************************************(Scene EDITOR PROPS STSceneTS)*************************************************/
/******************************************************************************************************************************/

/**
 * Description: This is the main store type declsceneation for the Scene
 */

export interface SceneEditorProps {
  // Scene Editor Mode
  sceneEditorMode?: "Design" | "Interact";

  // Handle Scene Editor Mode
  setSceneEditorMode?: (value: SceneEditorModeProps) => void;

  /************************(INSPECTOR PANEL)************************/
  // Inspector Panel
  inspectorPanel?: InspectorPanelProps;

  // Handle Inspector Panel
  setInspectorPanel?: (value: InspectorPanelProps) => void;

  // Properties Panel
  propertiesPanel?: PropertiesPanelProps;

  // Handle Properties Panel
  setPropertiesPanel?: (value: PropertiesPanelProps) => void;

  // Scene Engine Type
  sceneEngineType?: SceneEngineTypeProps;

  //Handle Scene Engine Type
  setSceneEngineType?: (value: SceneEngineTypeProps) => void;

  // Scene Engine
  sceneEngine?: {
    sceneGlass: "VisionPro" | "MetaQuest";
  };

  // Handle Scene Engine

  setSceneEngine?: (value: SceneEngineProps) => void;

  // Active Scene Engine
  activeSceneEngine?: SceneEngineProps;

  // Handle Active Scene Engine
  setActiveSceneEngine?: (value: SceneEngineProps) => void;

  // Scene Placement
  scenePlacement?: ScenePlacementProps;

  // Handle Scene Placement
  setScenePlacement?: (value: ScenePlacementProps) => void;

  // Active Scene Placement
  activeScenePlacement?: ScenePlacementProps;

  // Handle Active Scene Placement
  setActiveScenePlacement?: (value: ScenePlacementProps) => void;

  // Surface Placement
  surfacePlacement?: SurfacePlacementProps;

  // Handle Surface Placement
  setSurfacePlacement?: (value: SurfacePlacementProps) => void;

  // Active Surface Placement
  activeSurfacePlacement?: SurfacePlacementProps;

  // Handle Active Surface Placement
  setActiveSurfacePlacement?: (
    selectedActiveSurfacePlacement: SurfacePlacementProps
  ) => void;

  // Image Placement
  imagePlacement?: ImagePlacementProps;

  // Handle Image Placement
  setImagePlacement?: (value: ImagePlacementProps) => void;

  // Active Image Placement
  activeImagePlacement?: ImagePlacementProps;

  // Handle Active Image Placement
  setActiveImagePlacement?: (value: ImagePlacementProps) => void;

  // Body Placement
  bodyPlacement?: BodyPlacementProps;

  // Handle Body Placement
  setBodyPlacement?: (value: BodyPlacementProps) => void;

  // Active Body Placement
  activeBodyPlacement?: BodyPlacementProps;

  // Handle Active Body Placement
  setActiveBodyPlacement?: (value: BodyPlacementProps) => void;

  // Scene Occluder
  sceneOccluder?: SceneOccluderProps;

  // Handle Scene Occluder
  setSceneOccluder?: (value: SceneOccluderProps) => void;

  // Active Scene Occluder
  activeSceneOccluder?: SceneOccluderProps;

  // Handle Active Scene Occluder
  setActiveSceneOccluder?: (value: SceneOccluderProps) => void;

  /************************(PROPERTIES PANEL)************************/
  // A subset of the inspector panel which contains the properties of the selected Scene Asset

  /************************(VIEWPORT)************************/
  // The Viewport is the sceneea where the user can see the Scene Scene
  // It may be best to store this in local storage or cookies
  // Instead of the state because it is not a pscenet of the Scene Experience

  sceneZoom: number;
  setSceneZoom?: (value: number) => void;

  transformControlMode?: TransformModeProps;
  setTransformControlMode?: (value: TransformModeProps) => void;

  sceneControlMode?: SceneControlModeProps;
  setSceneControlMode?: (value: SceneControlModeProps) => void;

  showPerformanceStats?: boolean;
  setPerformanceStats?: (value: boolean) => void;

  /************************(Canvas Settings)************************/

  sceneBrightness?: number; // Ambient Light Intensity
  setSceneBrightness?: (value: number) => void;

  sceneSettingsMode: SceneSettingsModeProps;
  setSceneSettingsMode: (value: SceneSettingsModeProps) => void;

  sceneColor?: string;
  setSceneColor?: (value: string) => void;

  cameraProjection?: CameraProjectionProps;
  setCameraProjection?: (value: CameraProjectionProps) => void;

  cameraDirection?: CameraDirectionProps;
  setCameraDirection?: (value: CameraDirectionProps) => void;

  cameraDollyCount?: CameraDollyCountProps;
  setCameraDollyCount?: (value: CameraDollyCountProps) => void;

  initialAssetPosition?: InitialAssetPositionProps;
  setInitialAssetPosition?: (value: InitialAssetPositionProps) => void;

  showCameraAngleGizmo?: boolean;
  setShowCameraAngleGizmo?: (value: boolean) => void;

  cameraAngleGizmo?: CameraAngleGizmoProps;
  setCameraAngleGizmo?: (value: CameraAngleGizmoProps) => void;

  /************************(Environments (Virtual backgrounds))************************/

  virtualBackground?: VirtualBackgroundProps;
  setVirtualBackground?: (value: VirtualBackgroundProps) => void;

  selectedVirtualBackground?: string;
  setSelectedVirtualBackground?: (value: string) => void;

  /************************(Scene ASSET MODAL MENU)************************/
  activeSceneAssetModalMenu?: SceneAssetModalMenuProps;
  setActiveSceneAssetModalMenu?: (value: SceneAssetModalMenuProps) => void;

  /************************(Scene EDITOR MENU)************************/
  activeSceneEditorMenu?: SceneEditorMenuProps;
  setActiveSceneEditorMenu?: (value: SceneEditorMenuProps) => void;

  showAnimationPanel: boolean;
  setAnimationPanel?: (value: boolean) => void;

  /************************(ASSET PANEL)************************/

  defaultAssetHierscenechy?: SceneEditorAssetHierarchySceneProps[];
  setDefaultAssetHierscenechy?: (
    value: SceneEditorAssetHierarchySceneProps[]
  ) => void;

  /************************(Scene Asset Props & Settings)************************/

  scaleProportionally?: boolean;
  setScaleProportionally: (value: boolean) => void;

  // sceneray method
  sceneAsset: SceneAssetProps[];
  setSceneAsset: (value: SceneAssetProps[]) => void;

  selectedAssetType: SceneAssetTypeProps | undefined;
  setSelectedAssetType: (value: SceneAssetTypeProps) => void;

  selectedAssetID: string | null; // ID of the selected asset
  setSelectedAssetID: (value: string | null) => void;

  meshRef: { [key: string]: GPU.Mesh };
  setMeshRef: (id: string, ref: GPU.Mesh) => void;
  removeMeshRef: (id: string) => void;

  /**
   * prevents randomly generated data from changing on re-render when user manually configures it
   */
  isManuallyConfigured: Record<string, boolean>;
  /**
   * prevents randomly generated data from changing on re-render when user manually configures it
   */
  setIsManuallyConfigured: (id: string, value: boolean) => void;

  /************************(3D UPLOAD)************************/

  uploadedFileURL: string;
  uploadedFileType: MediaFileTypes | null;
  setUploadedFile: (fileType: MediaFileTypes, fileURL: string) => void;

  /*====================================(INSPECTOR PROPERTIES)====================================*/

  /************************(Transform Manipulators)************************/
  assetTransform: Record<string, TransformProps>;
  setAssetTransform: (id: string, transform: Partial<TransformProps>) => void;

  /************************(Settings Manipulators)************************/
  assetSettings: Record<string, SceneAssetSettingsProps>;
  setAssetSettings: (
    id: string,
    settings: Partial<SceneAssetSettingsProps>
  ) => void;

  /************************(Texture & Color Manipulator)************************/
  assetTexture: Record<string, SceneAssetTextureAndColorSettingsProps>;
  setAssetTexture: (
    id: string,
    texture: Partial<SceneAssetTextureAndColorSettingsProps>
  ) => void;

  /************************(Shadow & Visibility Manipulator)************************/
  assetShadowVisibility: Record<
    string,
    SceneAssetShadowAndVisibilitySettingsProps
  >;
  setAssetShadowVisibility: (
    id: string,
    visibility: Partial<SceneAssetShadowAndVisibilitySettingsProps>
  ) => void;

  /************************(Effect Manipulator)************************/
  assetEffect: Record<string, SceneAssetEffectSettingsProps>;
  setAssetEffect: (
    id: string,
    effect: Partial<SceneAssetEffectSettingsProps>
  ) => void;

  /************************(Physics Manipulator)************************/
  assetPhysics: Record<string, SceneAssetPhysicsSettingsProps>;
  setAssetPhysics: (
    id: string,
    physics: Partial<SceneAssetPhysicsSettingsProps>
  ) => void;

  /*====================================(POST-EFFECT-FILTERS)====================================*/

  /************************(Bloom)************************/
  bloomPostEffectFilter: BloomPostEffectProps;
  setBloomPostEffectFilter: (value: BloomPostEffectProps) => void;

  /************************(Blur)************************/
  blurPostEffectFilter: BlurPostEffectProps;
  setBlurPostEffectFilter: (value: BlurPostEffectProps) => void;

  /************************(Glitch)************************/
  glitchPostEffectFilter: GlitchPostEffectProps;
  setGlitchPostEffectFilter: (value: GlitchPostEffectProps) => void;

  /************************(Halftone)************************/
  halftonePostEffectFilter: HalftonePostEffectProps;
  setHalftonePostEffectFilter: (value: HalftonePostEffectProps) => void;

  /************************(Luminosity)************************/
  luminosityPostEffectFilter: LuminosityPostEffectProps;
  setLuminosityPostEffectFilter: (value: LuminosityPostEffectProps) => void;

  /************************(Spectrum)************************/
  spectrumPostEffectFilter: SpectrumPostEffectProps;
  setSpectrumPostEffectFilter: (value: SpectrumPostEffectProps) => void;

  /************************(Pixelation)************************/
  pixelationPostEffectFilter: PixelationPostEffectProps;
  setPixelationPostEffectFilter: (value: PixelationPostEffectProps) => void;

  /************************(Noise)************************/
  noisePostEffectFilter: NoisePostEffectProps;
  setNoisePostEffectFilter: (value: NoisePostEffectProps) => void;

  /************************(Sepia)************************/
  sepiaPostEffectFilter: SepiaPostEffectProps;
  setSepiaPostEffectFilter: (value: SepiaPostEffectProps) => void;

  /************************(Scanline)************************/
  scanlinePostEffectFilter: ScanlinePostEffectProps;
  setScanlinePostEffectFilter: (value: ScanlinePostEffectProps) => void;

  /************************(Vignette)************************/
  vignettePostEffectFilter: VignettePostEffectProps;
  setVignettePostEffectFilter: (value: VignettePostEffectProps) => void;
}

/******************************************************************************************************************************/
/*****************************************************(Scene EDITOR PROPS ENDS)***************************************************/
/******************************************************************************************************************************/
