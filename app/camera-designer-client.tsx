"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type CameraModel = {
  id: string;
  name: string;
  category: string;
  description: string;
  manufacturer?: string;
  sensorWidthMm: number;
  sensorHeightMm: number;
  resolutionWidth: number;
  resolutionHeight: number;
  lensMinMm: number;
  lensMaxMm: number;
  defaultLensMm: number;
  defaultMountHeightFt: number;
  defaultTiltDeg: number;
  defaultRotationDeg: number;
  accent: string;
};

type Placement = {
  id: string;
  modelId: string;
  x: number;
  y: number;
  lensMm: number;
  mountHeightFt: number;
  tiltDeg: number;
  rotationDeg: number;
  heads?: CameraHead[];
};

type StageSize = {
  width: number;
  height: number;
};

type MapSlot = {
  file: File | null;
  url: string | null;
  aspect: number;
  widthFt: number;
  name: string;
  placements: Placement[];
};

type CameraHead = {
  id: string;
  label: string;
  lensMm: number;
  tiltDeg: number;
  rotationOffsetDeg: number;
};

type DrawableHead = CameraHead & {
  rotationDeg: number;
};

const cameraModelsCatalog: CameraModel[] = [
  {
    id: "oe-c1011d4-s",
    name: "OE-C1011D4-S",
    category: "Dome",
    description: "4MP dome with a fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c1012d2-s",
    name: "OE-C1012D2-S",
    category: "Dome",
    description: "2MP dome with a fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 3.15,
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c1013d4-s",
    name: "OE-C1013D4-S",
    category: "Dome",
    description: "4MP dome with a fixed 4.0mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 4,
    lensMaxMm: 4,
    defaultLensMm: 4,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c1014d4-s",
    name: "OE-C1014D4-S",
    category: "Dome",
    description: "4MP dome with a fixed 2.8mm lens and wider coverage.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c3011d4-s",
    name: "OE-C3011D4-S",
    category: "Dome",
    description: "4MP varifocal dome with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c3212d4-s",
    name: "OE-C3212D4-S",
    category: "Dome",
    description: "4MP varifocal dome with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c3212d8-s",
    name: "OE-C3212D8-S",
    category: "Dome",
    description: "8MP varifocal dome with AF zoom lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 7.2,
    sensorHeightMm: 4.05,
    resolutionWidth: 3840,
    resolutionHeight: 2160,
    lensMinMm: 2.8,
    lensMaxMm: 12,
    defaultLensMm: 7.4,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c8312p2",
    name: "OE-C8312P2",
    category: "PTZ",
    description: "2MP PTZ with 40x zoom and endless pan.",
    manufacturer: "OpenEye",
    sensorWidthMm: 6.4,
    sensorHeightMm: 4.8,
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    lensMinMm: 4.3,
    lensMaxMm: 170,
    defaultLensMm: 40,
    defaultMountHeightFt: 18,
    defaultTiltDeg: 25,
    defaultRotationDeg: 0,
    accent: "from-amber-400 to-orange-500",
  },
  {
    id: "oe-c9912m20",
    name: "OE-C9912M20",
    category: "Multisensor",
    description: "4x5MP multisensor with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 8.8,
    sensorHeightMm: 4.95,
    resolutionWidth: 2592,
    resolutionHeight: 1944,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 20,
    defaultTiltDeg: 25,
    defaultRotationDeg: 0,
    accent: "from-fuchsia-400 to-violet-500",
  },
  {
    id: "oe-cc3020d5",
    name: "OE-CC3020D5",
    category: "Dome",
    description: "5MP dome with a fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2592,
    resolutionHeight: 1944,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-cc51d5",
    name: "OE-CC51D5",
    category: "Dome",
    description: "5MP dome with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2592,
    resolutionHeight: 1944,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-cc51d8",
    name: "OE-CC51D8",
    category: "Dome",
    description: "8MP dome with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 7.2,
    sensorHeightMm: 4.05,
    resolutionWidth: 3840,
    resolutionHeight: 2160,
    lensMinMm: 3,
    lensMaxMm: 9,
    defaultLensMm: 6,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-cc3214f12",
    name: "OE-CC3214F12",
    category: "Fisheye",
    description: "12MP fisheye with dewarping.",
    manufacturer: "OpenEye",
    sensorWidthMm: 8.8,
    sensorHeightMm: 8.8,
    resolutionWidth: 4000,
    resolutionHeight: 3000,
    lensMinMm: 1.95,
    lensMaxMm: 1.95,
    defaultLensMm: 1.95,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 0,
    defaultRotationDeg: 0,
    accent: "from-fuchsia-400 to-violet-500",
  },
  {
    id: "oe-c9112f12",
    name: "OE-C9112F12",
    category: "Fisheye",
    description: "12MP fisheye with dewarping.",
    manufacturer: "OpenEye",
    sensorWidthMm: 8.8,
    sensorHeightMm: 8.8,
    resolutionWidth: 4000,
    resolutionHeight: 3000,
    lensMinMm: 1.65,
    lensMaxMm: 1.65,
    defaultLensMm: 1.65,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 0,
    defaultRotationDeg: 0,
    accent: "from-fuchsia-400 to-violet-500",
  },
  {
    id: "oe-c2012b4-s",
    name: "OE-C2012B4-S",
    category: "Bullet",
    description: "4MP bullet with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c2012b8-s",
    name: "OE-C2012B8-S",
    category: "Bullet",
    description: "8MP bullet with AF zoom lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 7.2,
    sensorHeightMm: 4.05,
    resolutionWidth: 3840,
    resolutionHeight: 2160,
    lensMinMm: 2.8,
    lensMaxMm: 12,
    defaultLensMm: 7.4,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c2212b4",
    name: "OE-C2212B4",
    category: "Bullet",
    description: "4MP bullet with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.8,
    lensMaxMm: 12,
    defaultLensMm: 7.4,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c2214b4",
    name: "OE-C2214B4",
    category: "Bullet",
    description: "4MP bullet with fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 3.15,
    resolutionWidth: 2560,
    resolutionHeight: 1440,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-cc52b5",
    name: "OE-CC52B5",
    category: "Bullet",
    description: "5MP bullet with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2592,
    resolutionHeight: 1944,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-cc53b5",
    name: "OE-CC53B5",
    category: "Bullet",
    description: "8MP bullet with motorized zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 7.2,
    sensorHeightMm: 4.05,
    resolutionWidth: 3840,
    resolutionHeight: 2160,
    lensMinMm: 3,
    lensMaxMm: 9,
    defaultLensMm: 6,
    defaultMountHeightFt: 12,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-cyan-400 to-blue-500",
  },
  {
    id: "oe-c1016t2-s",
    name: "OE-C1016T2-S",
    category: "Turret",
    description: "2MP turret with fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 3.15,
    resolutionWidth: 1920,
    resolutionHeight: 1080,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c1018t4",
    name: "OE-C1018T4",
    category: "Turret",
    description: "4MP turret with fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c1024t5-s",
    name: "OE-C1024T5-S",
    category: "Turret",
    description: "5MP turret with fixed 1.68mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 4.8,
    sensorHeightMm: 3.6,
    resolutionWidth: 2880,
    resolutionHeight: 1620,
    lensMinMm: 1.68,
    lensMaxMm: 1.68,
    defaultLensMm: 1.68,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c3012t4-s",
    name: "OE-C3012T4-S",
    category: "Turret",
    description: "4MP turret with varifocal zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c3012t4b-s",
    name: "OE-C3012T4B-S",
    category: "Turret",
    description: "4MP turret with varifocal zoom.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2688,
    resolutionHeight: 1520,
    lensMinMm: 2.7,
    lensMaxMm: 13.5,
    defaultLensMm: 8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 30,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-c3012t8-s",
    name: "OE-C3012T8-S",
    category: "Turret",
    description: "8MP turret with AF zoom lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 7.2,
    sensorHeightMm: 4.05,
    resolutionWidth: 3840,
    resolutionHeight: 2160,
    lensMinMm: 2.8,
    lensMaxMm: 12,
    defaultLensMm: 7.4,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
  {
    id: "oe-cc3022t5",
    name: "OE-CC3022T5",
    category: "Turret",
    description: "5MP turret with fixed 2.8mm lens.",
    manufacturer: "OpenEye",
    sensorWidthMm: 5.6,
    sensorHeightMm: 4.2,
    resolutionWidth: 2592,
    resolutionHeight: 1944,
    lensMinMm: 2.8,
    lensMaxMm: 2.8,
    defaultLensMm: 2.8,
    defaultMountHeightFt: 10,
    defaultTiltDeg: 28,
    defaultRotationDeg: 0,
    accent: "from-emerald-400 to-teal-500",
  },
];

const cloudCameraModelIds = new Set([
  "oe-cc3020d5",
  "oe-cc3022t5",
  "oe-cc3214f12",
  "oe-cc51d5",
  "oe-cc51d8",
  "oe-cc52b5",
  "oe-cc53b8",
]);

function isCloudCameraModel(model: CameraModel) {
  return cloudCameraModelIds.has(model.id);
}

const recognitionBands = [
  { label: "Detection", ppf: 4 },
  { label: "Identification", ppf: 19 },
  { label: "Recognition", ppf: 38 },
] as const;

const modelFovSpecs: Record<string, { wideDeg: number; teleDeg?: number }> = {
  "oe-c1011d4-s": { wideDeg: 103 },
  "oe-c1012d2-s": { wideDeg: 105 },
  "oe-c1013d4-s": { wideDeg: 84 },
  "oe-c1014d4-s": { wideDeg: 101 },
  "oe-c3011d4-s": { wideDeg: 103, teleDeg: 32 },
  "oe-c3212d4-s": { wideDeg: 104, teleDeg: 30 },
  "oe-c3212d8-s": { wideDeg: 109, teleDeg: 31 },
  "oe-c8312p2": { wideDeg: 65.5, teleDeg: 2 },
  "oe-c9912m20": { wideDeg: 103, teleDeg: 34 },
  "oe-cc3020d5": { wideDeg: 97 },
  "oe-cc51d5": { wideDeg: 100, teleDeg: 30 },
  "oe-cc51d8": { wideDeg: 115, teleDeg: 36 },
  "oe-cc3214f12": { wideDeg: 180 },
  "oe-c9112f12": { wideDeg: 180 },
  "oe-c2012b4-s": { wideDeg: 103, teleDeg: 30 },
  "oe-c2012b8-s": { wideDeg: 105, teleDeg: 31 },
  "oe-c2212b4": { wideDeg: 86, teleDeg: 36 },
  "oe-c2214b4": { wideDeg: 101.5 },
  "oe-cc52b5": { wideDeg: 100, teleDeg: 30 },
  "oe-cc53b5": { wideDeg: 115, teleDeg: 36 },
  "oe-c1016t2-s": { wideDeg: 106 },
  "oe-c1018t4": { wideDeg: 107.5 },
  "oe-c1024t5-s": { wideDeg: 180 },
  "oe-c3012t4-s": { wideDeg: 103, teleDeg: 29 },
  "oe-c3012t4b-s": { wideDeg: 103, teleDeg: 29 },
  "oe-c3012t8-s": { wideDeg: 105, teleDeg: 31 },
  "oe-cc3022t5": { wideDeg: 97 },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number) {
  return (radians * 180) / Math.PI;
}

function formatNumber(value: number, digits = 1) {
  return value.toFixed(digits);
}

function classifyPixelsPerFoot(ppf: number) {
  if (ppf >= recognitionBands[2].ppf) return recognitionBands[2].label;
  if (ppf >= recognitionBands[1].ppf) return recognitionBands[1].label;
  if (ppf >= recognitionBands[0].ppf) return recognitionBands[0].label;
  return "Below detection";
}

function getHorizontalFov(model: CameraModel, lensMm: number) {
  const modelFov = modelFovSpecs[model.id];

  if (modelFov) {
    if (!modelFov.teleDeg || model.lensMinMm === model.lensMaxMm) {
      return modelFov.wideDeg;
    }

    const wideTan = Math.tan(toRadians(modelFov.wideDeg / 2));
    const teleTan = Math.tan(toRadians(modelFov.teleDeg / 2));
    const lensProgress = clamp((lensMm - model.lensMinMm) / Math.max(model.lensMaxMm - model.lensMinMm, 0.01), 0, 1);
    const interpolatedTan = wideTan + (teleTan - wideTan) * lensProgress;

    return toDegrees(2 * Math.atan(interpolatedTan));
  }

  return toDegrees(2 * Math.atan(model.sensorWidthMm / (2 * lensMm)));
}

function getVerticalFov(model: CameraModel, horizontalFovDeg: number, lensMm: number) {
  const cappedHorizontalFovDeg = Math.min(horizontalFovDeg, 170);
  const aspectRatio = model.resolutionHeight / Math.max(model.resolutionWidth, 1);

  if (modelFovSpecs[model.id]) {
    return toDegrees(2 * Math.atan(Math.tan(toRadians(cappedHorizontalFovDeg / 2)) * aspectRatio));
  }

  return toDegrees(2 * Math.atan(model.sensorHeightMm / (2 * lensMm)));
}

function getCoverageWidthFt(distanceFt: number, horizontalFovDeg: number) {
  const calculationFovDeg = Math.min(horizontalFovDeg, 170);

  return 2 * distanceFt * Math.tan(toRadians(calculationFovDeg / 2));
}

function getThresholdDistanceFt(model: CameraModel, horizontalFovDeg: number, targetPpf: number) {
  const calculationFovDeg = Math.min(horizontalFovDeg, 170);

  return model.resolutionWidth / Math.max(2 * targetPpf * Math.tan(toRadians(calculationFovDeg / 2)), 0.1);
}

function getThresholdGroundDistanceFt(model: CameraModel, horizontalFovDeg: number, targetPpf: number, mountHeightFt: number) {
  const slantDistanceFt = getThresholdDistanceFt(model, horizontalFovDeg, targetPpf);

  return Math.sqrt(Math.max(slantDistanceFt ** 2 - mountHeightFt ** 2, 0));
}

function getTargetThreshold(label: string) {
  return recognitionBands.find((band) => band.label === label)?.ppf ?? recognitionBands[2].ppf;
}

function isFisheyeModel(model: CameraModel) {
  return model.category === "Fisheye";
}

function isMultisensorModel(model: CameraModel) {
  return model.category === "Multisensor";
}

function hasAdjustableLens(model: CameraModel) {
  return model.lensMaxMm - model.lensMinMm > 0.05;
}

function normalizeAngle(degrees: number) {
  return ((degrees % 360) + 360) % 360;
}

function getDefaultHeads(model: CameraModel): CameraHead[] | undefined {
  if (!isMultisensorModel(model)) return undefined;

  return [-135, -45, 45, 135].map((rotationOffsetDeg, index) => ({
    id: `head-${index + 1}`,
    label: `Head ${index + 1}`,
    lensMm: model.defaultLensMm,
    tiltDeg: model.defaultTiltDeg,
    rotationOffsetDeg,
  }));
}

function getDrawableHeads(placement: Placement, model: CameraModel): DrawableHead[] {
  const heads = isMultisensorModel(model) ? placement.heads ?? getDefaultHeads(model) ?? [] : [];

  if (heads.length > 0) {
    return heads.map((head) => ({
      ...head,
      rotationDeg: normalizeAngle(placement.rotationDeg + head.rotationOffsetDeg),
    }));
  }

  return [
    {
      id: "main",
      label: model.category === "Fisheye" ? "Fisheye" : "Lens",
      lensMm: placement.lensMm,
      tiltDeg: placement.tiltDeg,
      rotationOffsetDeg: 0,
      rotationDeg: placement.rotationDeg,
    },
  ];
}

function createPlacement(model: CameraModel, x: number, y: number): Placement {
  return {
    id: crypto.randomUUID(),
    modelId: model.id,
    x,
    y,
    lensMm: model.defaultLensMm,
    mountHeightFt: model.defaultMountHeightFt,
    tiltDeg: model.defaultTiltDeg,
    rotationDeg: model.defaultRotationDeg,
    heads: getDefaultHeads(model),
  };
}

function buildCameraStats(
  placement: Placement,
  model: CameraModel,
  stageSize: StageSize,
  mapWidthFt: number,
  targetPpf: number,
  head = getDrawableHeads(placement, model)[0],
) {
  const horizontalFovDeg = isFisheyeModel(model) ? 180 : getHorizontalFov(model, head.lensMm);
  const verticalFovDeg = isFisheyeModel(model) ? 180 : getVerticalFov(model, horizontalFovDeg, head.lensMm);
  const feetPerPixel = mapWidthFt / Math.max(stageSize.width, 1);
  const tiltDeg = isFisheyeModel(model) ? 0 : clamp(head.tiltDeg, 0, 90);
  const aimDistanceFt = getTiltAimDistanceFt(placement.mountHeightFt, tiltDeg);
  const groundFootprint = getOpticalGroundFootprintFt(placement.mountHeightFt, verticalFovDeg, tiltDeg);
  const coverageWidthFt = isFisheyeModel(model)
    ? getFisheyeRadiusFt(model, recognitionBands[0].ppf) * 2
    : getCoverageWidthFt(Math.max(groundFootprint.aimFt, placement.mountHeightFt), horizontalFovDeg);
  const pixelsPerFoot = model.resolutionWidth / Math.max(coverageWidthFt, 1);
  const zoneBands = recognitionBands.map((band) => {
    const ppfRangeFt = isFisheyeModel(model)
      ? getFisheyeRadiusFt(model, band.ppf)
      : getThresholdGroundDistanceFt(model, horizontalFovDeg, band.ppf, placement.mountHeightFt);
    const radiusFt = isFisheyeModel(model) ? ppfRangeFt : Math.min(ppfRangeFt, groundFootprint.farFt);

    return {
      ...band,
      radiusFt,
      ppfRangeFt,
      radiusPx: radiusFt / Math.max(feetPerPixel, 0.001),
      pathD: isFisheyeModel(model)
        ? buildCirclePath(placement.x * stageSize.width, placement.y * stageSize.height, radiusFt / Math.max(feetPerPixel, 0.001))
        : buildStableFovPath({
            placement,
            stageSize,
            feetPerPixel,
            horizontalFovDeg,
            verticalFovDeg,
            tiltDeg,
            rotationDeg: head.rotationDeg,
            minRangeFt: groundFootprint.nearFt,
            maxRangeFt: radiusFt,
            opticalRangeFt: groundFootprint.farFt,
          }),
    };
  });
  const targetDistanceFt = zoneBands.find((band) => band.label === "Recognition")?.radiusFt ??
    getThresholdGroundDistanceFt(model, horizontalFovDeg, targetPpf, placement.mountHeightFt);
  const coneRadiusFt = clamp(Math.max(aimDistanceFt, zoneBands[0]?.radiusFt ?? targetDistanceFt), 8, mapWidthFt * 1.5);
  const coneRadiusPx = coneRadiusFt / Math.max(feetPerPixel, 0.001);

  return {
    horizontalFovDeg,
    verticalFovDeg,
    feetPerPixel,
    aimDistanceFt,
    coverageWidthFt,
    pixelsPerFoot,
    targetDistanceFt,
    coneRadiusFt,
    coneRadiusPx,
    zoneBands,
    recognitionType: classifyPixelsPerFoot(pixelsPerFoot),
  };
}

function getFisheyeRadiusFt(model: CameraModel, targetPpf: number) {
  return model.resolutionWidth / Math.max(targetPpf * 2, 1);
}

function getTiltAimDistanceFt(heightFt: number, tiltDeg: number) {
  return heightFt * Math.tan(toRadians(clamp(tiltDeg, 0, 89.5)));
}

function getOpticalGroundFootprintFt(heightFt: number, verticalFovDeg: number, tiltDeg: number) {
  const aimFt = getTiltAimDistanceFt(heightFt, tiltDeg);
  const verticalHalfDeg = Math.min(verticalFovDeg, 150) / 2;

  if (tiltDeg <= 2) {
    const halfDepthFt = heightFt * Math.tan(toRadians(Math.min(verticalFovDeg, 170) / 2));

    return {
      aimFt: 0,
      nearFt: 0,
      farFt: Math.max(halfDepthFt, heightFt * 0.5),
    };
  }

  const nearAngleDeg = Math.max(tiltDeg - verticalHalfDeg, 0);
  const farAngleDeg = tiltDeg + verticalHalfDeg;
  const nearFt = heightFt * Math.tan(toRadians(clamp(nearAngleDeg, 0, 89.5)));
  const farFt = farAngleDeg >= 89.5 ? Number.POSITIVE_INFINITY : heightFt * Math.tan(toRadians(farAngleDeg));

  return {
    aimFt,
    nearFt,
    farFt: Math.max(nearFt + 1, farFt),
  };
}

function buildStableFovPath({
  placement,
  stageSize,
  feetPerPixel,
  horizontalFovDeg,
  verticalFovDeg,
  tiltDeg,
  rotationDeg,
  minRangeFt,
  maxRangeFt,
  opticalRangeFt,
}: {
  placement: Placement;
  stageSize: StageSize;
  feetPerPixel: number;
  horizontalFovDeg: number;
  verticalFovDeg: number;
  tiltDeg: number;
  rotationDeg: number;
  minRangeFt: number;
  maxRangeFt: number;
  opticalRangeFt: number;
}) {
  const originX = placement.x * stageSize.width;
  const originY = placement.y * stageSize.height;
  const maxVisibleRangeFt = Math.max(stageSize.width, stageSize.height) * feetPerPixel * 1.5;
  const innerRangeFt = Math.max(0, Math.min(minRangeFt, maxVisibleRangeFt));
  const rangeFt = Math.min(maxRangeFt, opticalRangeFt, maxVisibleRangeFt);

  if (tiltDeg <= 2) {
    const widthFt = Math.min(getCoverageWidthFt(placement.mountHeightFt, horizontalFovDeg), rangeFt * 2);
    const heightFt = Math.min(getCoverageWidthFt(placement.mountHeightFt, verticalFovDeg), rangeFt * 2);

    return buildRotatedRectanglePath(originX, originY, widthFt / Math.max(feetPerPixel, 0.001), heightFt / Math.max(feetPerPixel, 0.001), rotationDeg);
  }

  return buildConePath(
    originX,
    originY,
    innerRangeFt / Math.max(feetPerPixel, 0.001),
    rangeFt / Math.max(feetPerPixel, 0.001),
    rotationDeg,
    horizontalFovDeg,
  );
}

function buildConePath(x: number, y: number, innerRadius: number, outerRadius: number, centerAngleDeg: number, horizontalFovDeg: number) {
  if (outerRadius <= innerRadius + 0.5) return "";

  const baseAngle = toRadians(centerAngleDeg - 90);
  const halfSpan = toRadians(Math.min(horizontalFovDeg, 170) / 2);
  const leftAngle = baseAngle - halfSpan;
  const rightAngle = baseAngle + halfSpan;
  const outerLeftX = x + Math.cos(leftAngle) * outerRadius;
  const outerLeftY = y + Math.sin(leftAngle) * outerRadius;
  const outerRightX = x + Math.cos(rightAngle) * outerRadius;
  const outerRightY = y + Math.sin(rightAngle) * outerRadius;
  const largeArc = horizontalFovDeg >= 170 ? 1 : 0;

  if (horizontalFovDeg >= 150) {
    if (innerRadius <= 0.5) {
      return [
        `M ${x} ${y}`,
        `L ${outerLeftX} ${outerLeftY}`,
        `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerRightX} ${outerRightY}`,
        "Z",
      ].join(" ");
    }

    const innerLeftX = x + Math.cos(leftAngle) * innerRadius;
    const innerLeftY = y + Math.sin(leftAngle) * innerRadius;
    const innerRightX = x + Math.cos(rightAngle) * innerRadius;
    const innerRightY = y + Math.sin(rightAngle) * innerRadius;

    return [
      `M ${innerLeftX} ${innerLeftY}`,
      `L ${outerLeftX} ${outerLeftY}`,
      `A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${outerRightX} ${outerRightY}`,
      `L ${innerRightX} ${innerRightY}`,
      `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${innerLeftX} ${innerLeftY}`,
      "Z",
    ].join(" ");
  }

  if (innerRadius <= 0.5) {
    return [`M ${x} ${y}`, `L ${outerLeftX} ${outerLeftY}`, `L ${outerRightX} ${outerRightY}`, "Z"].join(" ");
  }

  const innerLeftX = x + Math.cos(leftAngle) * innerRadius;
  const innerLeftY = y + Math.sin(leftAngle) * innerRadius;
  const innerRightX = x + Math.cos(rightAngle) * innerRadius;
  const innerRightY = y + Math.sin(rightAngle) * innerRadius;

  return [
    `M ${innerLeftX} ${innerLeftY}`,
    `L ${outerLeftX} ${outerLeftY}`,
    `L ${outerRightX} ${outerRightY}`,
    `L ${innerRightX} ${innerRightY}`,
    "Z",
  ].join(" ");
}

function buildRotatedRectanglePath(x: number, y: number, width: number, height: number, rotationDeg: number) {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const angle = toRadians(rotationDeg);
  const corners = [
    { x: -halfWidth, y: -halfHeight },
    { x: halfWidth, y: -halfHeight },
    { x: halfWidth, y: halfHeight },
    { x: -halfWidth, y: halfHeight },
  ].map((corner) => ({
    x: x + corner.x * Math.cos(angle) - corner.y * Math.sin(angle),
    y: y + corner.x * Math.sin(angle) + corner.y * Math.cos(angle),
  }));

  return `${corners.map((corner, index) => `${index === 0 ? "M" : "L"} ${corner.x} ${corner.y}`).join(" ")} Z`;
}

function buildCirclePath(x: number, y: number, radius: number) {
  return [
    `M ${x - radius} ${y}`,
    `A ${radius} ${radius} 0 1 0 ${x + radius} ${y}`,
    `A ${radius} ${radius} 0 1 0 ${x - radius} ${y}`,
    "Z",
  ].join(" ");
}

function createEmptyMapSlot(index: number): MapSlot {
  return {
    file: null,
    url: null,
    aspect: 16 / 10,
    widthFt: 160,
    name: `Floor ${index + 1}`,
    placements: [],
  };
}

function escapeCsvValue(value: string | number) {
  const text = String(value);

  if (!/[",\n\r]/.test(text)) {
    return text;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function getHoverReadout(
  hoverPoint: { x: number; y: number },
  placement: Placement,
  model: CameraModel,
  stageSize: StageSize,
  mapWidthFt: number,
) {
  const feetPerPixel = mapWidthFt / Math.max(stageSize.width, 1);
  const dxPx = (hoverPoint.x - placement.x) * stageSize.width;
  const dyPx = (hoverPoint.y - placement.y) * stageSize.height;
  const distanceFt = Math.hypot(dxPx, dyPx) * feetPerPixel;
  const heads = getDrawableHeads(placement, model);
  const matchingHeads = heads
    .map((head) => {
      const horizontalFovDeg = isFisheyeModel(model) ? 180 : getHorizontalFov(model, head.lensMm);
      const verticalFovDeg = isFisheyeModel(model) ? 180 : getVerticalFov(model, horizontalFovDeg, head.lensMm);
      const tiltDeg = isFisheyeModel(model) ? 0 : clamp(head.tiltDeg, 0, 90);
      const groundFootprint = getOpticalGroundFootprintFt(placement.mountHeightFt, verticalFovDeg, tiltDeg);
      const slantDistanceFt = Math.hypot(distanceFt, placement.mountHeightFt);
      const coverageWidthFt = isFisheyeModel(model)
        ? Math.max(distanceFt * 2, 1)
        : getCoverageWidthFt(Math.max(slantDistanceFt, 0.1), horizontalFovDeg);
      const pixelsPerFoot = model.resolutionWidth / Math.max(coverageWidthFt, 1);
      const insideFov = isFisheyeModel(model)
        ? distanceFt <= getFisheyeRadiusFt(model, recognitionBands[0].ppf)
        : distanceFt >= groundFootprint.nearFt &&
          distanceFt <= groundFootprint.farFt &&
          Math.abs(((toDegrees(Math.atan2(dyPx, dxPx)) - (head.rotationDeg - 90) + 540) % 360) - 180) <= horizontalFovDeg / 2;

      return {
        head,
        distanceFt,
        pixelsPerFoot,
        recognitionType: classifyPixelsPerFoot(pixelsPerFoot),
        insideFov,
      };
    })
    .filter((readout) => readout.insideFov);

  return matchingHeads.sort((a, b) => b.pixelsPerFoot - a.pixelsPerFoot)[0] ?? null;
}

export default function CameraDesignerClient() {
  const [maps, setMaps] = useState<MapSlot[]>([createEmptyMapSlot(0), createEmptyMapSlot(1)]);
  const [activeMapIndex, setActiveMapIndex] = useState(0);
  const targetBand: (typeof recognitionBands)[number]["label"] = "Recognition";
  const cameraModels = cameraModelsCatalog;
  const [activeStyle, setActiveStyle] = useState<string>("All styles");
  const [activeModelId, setActiveModelId] = useState<string | null>(cameraModelsCatalog[0]?.id ?? null);
  const [selectedPlacementId, setSelectedPlacementId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 0, height: 0 });
  const [draggingPlacementId, setDraggingPlacementId] = useState<string | null>(null);
  const [isMeasuringScale, setIsMeasuringScale] = useState(false);
  const [scaleMeasurePoints, setScaleMeasurePoints] = useState<Array<{ x: number; y: number }>>([]);
  const [scaleMeasureFeet, setScaleMeasureFeet] = useState(6);
  const [hoverPoint, setHoverPoint] = useState<{ x: number; y: number } | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pendingImportMapIndexRef = useRef<number | null>(null);
  const mapUrlsRef = useRef<Array<string | null>>([]);
  const activeMap = maps[activeMapIndex] ?? maps[0];
  const mapFile = activeMap.file;
  const mapUrl = activeMap.url;
  const mapAspect = activeMap.aspect;
  const mapWidthFt = activeMap.widthFt;
  const mapName = activeMap.name;
  const placements = activeMap.placements;
  const hasAnyPlacements = maps.some((map) => map.placements.length > 0);

  function selectFloor(index: number) {
    setActiveMapIndex(index);
    setSelectedPlacementId(null);
    setScaleMeasurePoints([]);
    setIsMeasuringScale(false);
  }

  function addFloor() {
    const nextIndex = maps.length;

    setMaps((currentMaps) => [...currentMaps, createEmptyMapSlot(currentMaps.length)]);
    selectFloor(nextIndex);
  }

  function updateActiveMap(updater: (map: MapSlot) => MapSlot) {
    setMaps((currentMaps) => currentMaps.map((map, index) => (index === activeMapIndex ? updater(map) : map)));
  }

  function updateActivePlacements(updater: (placements: Placement[]) => Placement[]) {
    updateActiveMap((map) => ({ ...map, placements: updater(map.placements) }));
  }

  useEffect(() => {
    mapUrlsRef.current = maps.map((map) => map.url);
  }, [maps]);

  useEffect(() => {
    return () => {
      mapUrlsRef.current.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  useEffect(() => {
    const stage = stageRef.current;

    if (!stage) return;

    const updateSize = () => {
      const rect = stage.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    };

    updateSize();

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(stage);
    window.addEventListener("resize", updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, [mapAspect]);

  useEffect(() => {
    if (!draggingPlacementId) return;

    const handlePointerMove = (event: PointerEvent) => {
      const stage = stageRef.current;

      if (!stage) return;

      const rect = stage.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0.03, 0.97);
      const y = clamp((event.clientY - rect.top) / rect.height, 0.03, 0.97);

      setMaps((currentMaps) =>
        currentMaps.map((map, index) =>
          index === activeMapIndex
            ? {
                ...map,
                placements: map.placements.map((placement) => (placement.id === draggingPlacementId ? { ...placement, x, y } : placement)),
              }
            : map,
        ),
      );
    };

    const stopDragging = () => setDraggingPlacementId(null);

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", stopDragging);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", stopDragging);
    };
  }, [activeMapIndex, draggingPlacementId]);

  const activeModel = useMemo(
    () => (activeModelId ? cameraModels.find((model) => model.id === activeModelId) ?? null : null),
    [activeModelId, cameraModels],
  );

  const selectedPlacement = useMemo(
    () => placements.find((placement) => placement.id === selectedPlacementId) ?? null,
    [placements, selectedPlacementId],
  );

  const selectedModel = useMemo(
    () => (selectedPlacement ? cameraModels.find((model) => model.id === selectedPlacement.modelId) ?? null : null),
    [selectedPlacement, cameraModels],
  );

  const activeThreshold = getTargetThreshold(targetBand);
  const activeCameraLabel = activeModel ? activeModel.name : "No camera loaded";
  const activeCameraCategory = activeModel ? activeModel.category : "Pick a camera to begin";

  const scaleMeasureDistancePx = useMemo(() => {
    if (scaleMeasurePoints.length < 2 || stageSize.width <= 0 || stageSize.height <= 0) {
      return null;
    }

    const [startPoint, endPoint] = scaleMeasurePoints;
    const dx = (endPoint.x - startPoint.x) * stageSize.width;
    const dy = (endPoint.y - startPoint.y) * stageSize.height;

    return Math.hypot(dx, dy);
  }, [scaleMeasurePoints, stageSize.height, stageSize.width]);

  const scaleMeasureFeetPerPixel = useMemo(() => {
    if (!scaleMeasureDistancePx || scaleMeasureFeet <= 0) {
      return null;
    }

    return scaleMeasureFeet / scaleMeasureDistancePx;
  }, [scaleMeasureDistancePx, scaleMeasureFeet]);

  const scaleMeasureMapWidthFt = useMemo(() => {
    if (!scaleMeasureFeetPerPixel || stageSize.width <= 0) {
      return null;
    }

    return scaleMeasureFeetPerPixel * stageSize.width;
  }, [scaleMeasureFeetPerPixel, stageSize.width]);

  const inspectedStats = useMemo(() => {
    if (!selectedPlacement || !selectedModel) return null;

    return buildCameraStats(selectedPlacement, selectedModel, stageSize, mapWidthFt, activeThreshold);
  }, [selectedPlacement, selectedModel, stageSize, mapWidthFt, activeThreshold]);

  const hoverStats = useMemo(() => {
    if (!hoverPoint || !selectedPlacement || !selectedModel || stageSize.width <= 0 || stageSize.height <= 0) {
      return null;
    }

    return getHoverReadout(hoverPoint, selectedPlacement, selectedModel, stageSize, mapWidthFt);
  }, [hoverPoint, mapWidthFt, selectedModel, selectedPlacement, stageSize]);

  function openMapImport(index = activeMapIndex) {
    pendingImportMapIndexRef.current = index;

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.click();
    }
  }

  function handleImportMap(file: File | null) {
    const importMapIndex = pendingImportMapIndexRef.current ?? activeMapIndex;
    pendingImportMapIndexRef.current = null;

    setMaps((currentMaps) =>
      currentMaps.map((map, index) => {
        if (index !== importMapIndex) {
          return map;
        }

        if (map.url) {
          URL.revokeObjectURL(map.url);
        }

        return {
          ...map,
          file,
          url: file ? URL.createObjectURL(file) : null,
          name: file ? file.name.replace(/\.[^.]+$/, "") : map.name,
        };
      }),
    );
  }

  function clearScaleMeasurement() {
    setIsMeasuringScale(false);
    setScaleMeasurePoints([]);
  }

  function applyScaleMeasurement() {
    if (!scaleMeasureMapWidthFt || scaleMeasureFeet <= 0) {
      return;
    }

    updateActiveMap((map) => ({ ...map, widthFt: scaleMeasureMapWidthFt }));
    clearScaleMeasurement();
  }

  function handleStageClick(event: React.MouseEvent<HTMLDivElement>) {
    if (!isMeasuringScale) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const point = {
      x: clamp((event.clientX - rect.left) / rect.width, 0.03, 0.97),
      y: clamp((event.clientY - rect.top) / rect.height, 0.03, 0.97),
    };

    setScaleMeasurePoints((currentPoints) => {
      const nextPoints = currentPoints.length >= 2 ? [point] : [...currentPoints, point];

      if (nextPoints.length === 2) {
        const [startPoint, endPoint] = nextPoints;
        const dx = (endPoint.x - startPoint.x) * stageSize.width;
        const dy = (endPoint.y - startPoint.y) * stageSize.height;
        const distancePx = Math.hypot(dx, dy);

        if (distancePx > 0 && scaleMeasureFeet > 0) {
          updateActiveMap((map) => ({ ...map, widthFt: (scaleMeasureFeet / distancePx) * stageSize.width }));
        }

        setIsMeasuringScale(false);
      }

      return nextPoints;
    });
  }

  function handleStageMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();

    if (rect.width <= 0 || rect.height <= 0) {
      setHoverPoint(null);
      return;
    }

    setHoverPoint({
      x: clamp((event.clientX - rect.left) / rect.width, 0, 1),
      y: clamp((event.clientY - rect.top) / rect.height, 0, 1),
    });
  }

  function handleStageMouseLeave() {
    setHoverPoint(null);
  }

  function placeCamera(model: CameraModel, clientX: number, clientY: number) {
    const stage = stageRef.current;

    if (!stage) return;

    const rect = stage.getBoundingClientRect();
    const x = clamp((clientX - rect.left) / rect.width, 0.05, 0.95);
    const y = clamp((clientY - rect.top) / rect.height, 0.05, 0.95);
    const nextPlacement = createPlacement(model, x, y);

    updateActivePlacements((currentPlacements) => [...currentPlacements, nextPlacement]);
    setSelectedPlacementId(nextPlacement.id);
    setActiveModelId(model.id);
  }

  function updateSelectedPlacement(updater: (placement: Placement) => Placement) {
    if (!selectedPlacement) return;

    updateActivePlacements((currentPlacements) =>
      currentPlacements.map((placement) => (placement.id === selectedPlacement.id ? updater(placement) : placement)),
    );
  }

  function updateSelectedHead(headId: string, updater: (head: CameraHead) => CameraHead) {
    if (!selectedPlacement || !selectedModel) return;

    updateSelectedPlacement((placement) => {
      const heads = placement.heads ?? getDefaultHeads(selectedModel) ?? [];

      return {
        ...placement,
        heads: heads.map((head) => (head.id === headId ? updater(head) : head)),
      };
    });
  }

  function duplicateSelectedPlacement() {
    if (!selectedPlacement || !selectedModel) return;

    const copiedPlacement: Placement = {
      ...selectedPlacement,
      id: crypto.randomUUID(),
      x: clamp(selectedPlacement.x + 0.04, 0.05, 0.95),
      y: clamp(selectedPlacement.y + 0.04, 0.05, 0.95),
    };

    updateActivePlacements((currentPlacements) => [...currentPlacements, copiedPlacement]);
    setSelectedPlacementId(copiedPlacement.id);
    setActiveModelId(selectedModel.id);
  }

  function deleteSelectedPlacement() {
    if (!selectedPlacement) return;

    updateActivePlacements((currentPlacements) => currentPlacements.filter((placement) => placement.id !== selectedPlacement.id));
    setSelectedPlacementId(null);
  }

  const styleOptions = useMemo(
    () => ["All styles", ...Array.from(new Set(cameraModels.map((model) => model.category)))],
    [cameraModels],
  );

  const filteredCameraModels = useMemo(
    () => (activeStyle === "All styles" ? cameraModels : cameraModels.filter((model) => model.category === activeStyle)),
    [activeStyle, cameraModels],
  );
  const filteredStandardCameraModels = useMemo(
    () => filteredCameraModels.filter((model) => !isCloudCameraModel(model)),
    [filteredCameraModels],
  );
  const filteredCloudCameraModels = useMemo(
    () => filteredCameraModels.filter((model) => isCloudCameraModel(model)),
    [filteredCameraModels],
  );

  function renderCameraModelButton(model: CameraModel) {
    const isActive = model.id === activeModelId;
    const isCloud = isCloudCameraModel(model);

    return (
      <button
        key={model.id}
        type="button"
        draggable
        onDragStart={(event) => {
          event.dataTransfer.setData("text/plain", model.id);
          event.dataTransfer.effectAllowed = "copy";
        }}
        onClick={() => setActiveModelId(model.id)}
        className={`group w-full rounded-3xl border p-4 text-left transition ${
          isActive
            ? isCloud
              ? "border-amber-300/50 bg-amber-400/10 shadow-[0_0_0_1px_rgba(251,191,36,0.08)]"
              : "border-cyan-300/40 bg-cyan-400/10 shadow-[0_0_0_1px_rgba(34,211,238,0.08)]"
            : isCloud
              ? "border-amber-300/20 bg-amber-400/[0.06] hover:border-amber-300/40 hover:bg-amber-400/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.06]"
        }`}
      >
        <div className={`mb-3 h-1.5 w-20 rounded-full bg-gradient-to-r ${model.accent}`} />
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-white">{model.name}</div>
            <div className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{model.category}</div>
          </div>
          <span
            className={`rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.22em] ${
              isCloud ? "border-amber-300/30 text-amber-100" : "border-white/10 text-slate-300"
            }`}
          >
            {isCloud ? "Cloud" : `${model.lensMinMm}-${model.lensMaxMm} mm`}
          </span>
        </div>
        <p className="mt-3 text-sm leading-6 text-slate-300">{model.description}</p>
        <div className="mt-3 text-[10px] uppercase tracking-[0.22em] text-slate-500">
          {isCloud ? "Cloud camera / no NVR required" : (model.manufacturer ?? "OpenEye / OWS")} - {model.category}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <InfoChip label="FOV" value={`${formatNumber(getHorizontalFov(model, model.defaultLensMm))} deg`} />
          <InfoChip label="Stream" value={`${model.resolutionWidth} px`} />
          <InfoChip label="Sensor" value={`${model.sensorWidthMm} mm`} />
        </div>
      </button>
    );
  }

  function exportAllCameraCounts() {
    const rows = maps.flatMap((map, floorIndex) => {
      const counts = map.placements.reduce<Record<string, number>>((totals, placement) => {
        totals[placement.modelId] = (totals[placement.modelId] ?? 0) + 1;

        return totals;
      }, {});

      return Object.entries(counts)
        .map(([modelId, quantity]) => {
          const model = cameraModels.find((item) => item.id === modelId);

          return {
            floor: map.name || `Floor ${floorIndex + 1}`,
            model: model?.name ?? modelId,
            quantity,
          };
        })
        .sort((a, b) => a.model.localeCompare(b.model));
    });
    const csv = [
      "Floor,Model,Quantity",
      ...rows.map((row) => [row.floor, row.model, row.quantity].map(escapeCsvValue).join(",")),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "camera-counts-by-floor.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(17,94,89,0.28),_transparent_34%),linear-gradient(180deg,_#07111f_0%,_#050814_100%)] text-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-[1800px] flex-col gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-cyan-200">
                OpenEye / OWS site designer
              </div>
              <div className="space-y-3">
                <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  Import a map, then set the scale using two known points. Select and then drag them onto the map and tune lens, height, and coverage
                </h1>
                <p className="max-w-3xl text-sm leading-6 text-slate-300 sm:text-base">
                  Build a field-ready layout with varifocal coverage cones, DORI-style pixels-per-foot analysis,
                  mounting height control, and a map scale that keeps placements and recognition targets honest.
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
              <MetricCard label="Placed cameras" value={`${placements.length}`} helper="Library items on the map" />
              <MetricCard label="Map scale" value={`${formatNumber(mapWidthFt)} ft`} helper="Across the visible map width" />
            </div>
          </div>
        </section>

        <section className="grid flex-1 gap-6 xl:grid-cols-[280px_minmax(0,1fr)_340px]">
          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">OWS camera catalog</h2>
                <p className="text-sm text-slate-400">Filter by style, then pick a specific camera to drag onto the map.</p>
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <button
                  type="button"
                  onClick={() => openMapImport()}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                >
                  Import map
                </button>
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Camera filters</h3>
              <p className="mt-1 text-sm text-slate-400">
                Use the style dropdown to narrow the catalog, then use the camera dropdown to choose what gets placed.
              </p>
              <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-slate-500">
                Style filter
                <select
                  value={activeStyle}
                  onChange={(event) => {
                    const nextStyle = event.target.value;
                    const nextCameraModels =
                      nextStyle === "All styles" ? cameraModels : cameraModels.filter((model) => model.category === nextStyle);
                    const nextCamera = nextCameraModels.find((model) => !isCloudCameraModel(model)) ?? nextCameraModels[0] ?? null;

                    setActiveStyle(nextStyle);
                    setActiveModelId(nextCamera?.id ?? null);
                  }}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
                >
                  {styleOptions.map((style) => (
                    <option key={style} value={style}>
                      {style}
                    </option>
                  ))}
                </select>
              </label>
              <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-slate-500">
                Camera model
                <select
                  value={activeModelId ?? ""}
                  onChange={(event) => setActiveModelId(event.target.value || null)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
                >
                  <option value="" disabled>
                    Select a camera
                  </option>
                  {filteredStandardCameraModels.length > 0 ? (
                    <optgroup label="NVR cameras">
                      {filteredStandardCameraModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.category}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                  {filteredCloudCameraModels.length > 0 ? (
                    <optgroup label="Cloud cameras - no NVR required">
                      {filteredCloudCameraModels.map((model) => (
                        <option key={model.id} value={model.id}>
                          {model.name} - {model.category}
                        </option>
                      ))}
                    </optgroup>
                  ) : null}
                </select>
              </label>
            </div>

            <div className="mt-4 max-h-[34rem] space-y-3 overflow-y-auto pr-2">
              {filteredCameraModels.length > 0 ? (
                <>
                  {filteredStandardCameraModels.length > 0 ? (
                    <section className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">NVR cameras</h3>
                        <span className="text-xs text-slate-500">{filteredStandardCameraModels.length}</span>
                      </div>
                      {filteredStandardCameraModels.map((model) => renderCameraModelButton(model))}
                    </section>
                  ) : null}
                  {filteredCloudCameraModels.length > 0 ? (
                    <section className="space-y-3 rounded-3xl border border-amber-300/20 bg-amber-400/[0.04] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">Cloud cameras</h3>
                          <p className="mt-1 text-xs leading-5 text-amber-100/70">These models do not require an NVR.</p>
                        </div>
                        <span className="text-xs text-amber-100/70">{filteredCloudCameraModels.length}</span>
                      </div>
                      {filteredCloudCameraModels.map((model) => renderCameraModelButton(model))}
                    </section>
                  ) : null}
                </>
              ) : (
                <div className="rounded-3xl border border-dashed border-white/15 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                  No cameras match this style filter.
                </div>
              )}
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <h3 className="text-sm font-semibold text-white">Map import</h3>
              <p className="mt-1 text-sm text-slate-400">
                Drop in a floor plan, site survey, or aerial image. The planner keeps the aspect ratio of the image.
              </p>
              <div className="mt-4 max-h-48 overflow-y-auto pr-1">
                <div className="grid grid-cols-2 gap-2">
                  {maps.map((map, index) => (
                    <button
                      key={`floor-${index}`}
                      type="button"
                      onClick={() => selectFloor(index)}
                      className={`min-h-10 rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                        index === activeMapIndex
                          ? "border-cyan-300/50 bg-cyan-400/20 text-cyan-50"
                          : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                      }`}
                    >
                      {map.name}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={addFloor}
                    className="min-h-10 rounded-2xl border border-dashed border-cyan-300/40 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-50 transition hover:bg-cyan-400/20"
                    aria-label="Add floor"
                  >
                    + Add floor
                  </button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => {
                  handleImportMap(event.target.files?.[0] ?? null);
                  event.currentTarget.value = "";
                }}
              />
              <button
                type="button"
                onClick={() => openMapImport(activeMapIndex)}
                className="mt-4 w-full rounded-2xl border border-dashed border-white/15 bg-slate-900/70 px-4 py-6 text-sm text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-900"
              >
                {mapFile ? `Using ${mapFile.name}` : `Choose an image for ${mapName}`}
              </button>
              <label className="mt-4 block text-xs uppercase tracking-[0.24em] text-slate-500">
                Floor name
                <input
                  value={mapName}
                  onChange={(event) => updateActiveMap((map) => ({ ...map, name: event.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none ring-0 transition placeholder:text-slate-500 focus:border-cyan-400/50"
                />
              </label>
            </div>
          </aside>

          <section className="flex min-w-0 flex-col gap-4">
            <div className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div className="grid gap-3 md:grid-cols-4">
                <label className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Visible map width</span>
                  <div className="mt-2 flex items-center gap-3">
                    <input
                      type="range"
                      min={40}
                      max={600}
                      step={1}
                      value={mapWidthFt}
                      onChange={(event) => updateActiveMap((map) => ({ ...map, widthFt: Number(event.target.value) }))}
                      className="h-2 w-full accent-cyan-400"
                    />
                    <span className="min-w-16 text-right text-sm font-semibold text-white">{formatNumber(mapWidthFt)} ft</span>
                  </div>
                </label>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Active camera</span>
                  <div className="mt-2 text-sm font-semibold text-white">{activeCameraLabel}</div>
                  <div className="mt-1 text-sm text-slate-400">{activeCameraCategory}</div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Export</span>
                  <button
                    type="button"
                    onClick={exportAllCameraCounts}
                    disabled={!hasAnyPlacements}
                    className="mt-2 w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-50 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-slate-500"
                  >
                    Export all floors
                  </button>
                </div>

                <label className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-500">Scale calibration</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsMeasuringScale((currentValue) => !currentValue);
                        setScaleMeasurePoints([]);
                      }}
                      className={`rounded-2xl border px-3 py-2 text-xs font-medium transition ${
                        isMeasuringScale
                          ? "border-cyan-300/50 bg-cyan-400/20 text-cyan-50"
                          : "border-white/10 bg-slate-900/70 text-slate-200 hover:border-cyan-400/40 hover:bg-cyan-400/10"
                      }`}
                    >
                      {isMeasuringScale ? "Measuring on map" : "Measure with 2 points"}
                    </button>
                    <button
                      type="button"
                      onClick={clearScaleMeasurement}
                      className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    >
                      Clear points
                    </button>
                  </div>
                  <label className="mt-3 block text-[10px] uppercase tracking-[0.22em] text-slate-500">
                    Known distance
                    <div className="mt-2 flex items-center gap-2">
                      <input
                        type="number"
                        min={0.1}
                        step={0.1}
                        value={scaleMeasureFeet}
                        onChange={(event) => setScaleMeasureFeet(Number(event.target.value))}
                        className="w-full rounded-2xl border border-white/10 bg-slate-900/80 px-3 py-2 text-sm text-white outline-none transition focus:border-cyan-400/50"
                      />
                      <span className="text-sm text-slate-400">ft</span>
                    </div>
                  </label>
                  <div className="mt-3 flex items-center justify-between gap-3 text-xs text-slate-400">
                    <span>
                      {scaleMeasurePoints.length < 2
                        ? "Click two points on the map"
                        : `${formatNumber(scaleMeasureDistancePx ?? 0, 1)} px selected`}
                    </span>
                    <span>{scaleMeasureMapWidthFt ? `${formatNumber(scaleMeasureMapWidthFt)} ft map width` : "No measurement yet"}</span>
                  </div>
                  <button
                    type="button"
                    onClick={applyScaleMeasurement}
                    disabled={!scaleMeasureMapWidthFt}
                    className="mt-3 w-full rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-sm font-medium text-cyan-50 transition hover:bg-cyan-400/20 disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/[0.03] disabled:text-slate-500"
                  >
                    Apply measured scale
                  </button>
                </label>
              </div>
            </div>

            <div className="relative flex min-h-[42rem] flex-1 overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950/70 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
              <div
                ref={stageRef}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const modelId = event.dataTransfer.getData("text/plain");
                  const model = cameraModels.find((item) => item.id === modelId);

                  if (!model) return;

                  placeCamera(model, event.clientX, event.clientY);
                }}
                onClick={handleStageClick}
                onMouseMove={handleStageMouseMove}
                onMouseLeave={handleStageMouseLeave}
                className="relative w-full overflow-hidden rounded-[2rem] border border-white/5 bg-slate-900/80"
                style={{ aspectRatio: mapAspect, maxHeight: "72vh" }}
              >
                {mapUrl ? (
                  <Image
                    src={mapUrl}
                    alt={mapName}
                    fill
                    unoptimized
                    sizes="100vw"
                    className="absolute inset-0 h-full w-full object-contain pointer-events-none"
                    onLoad={(event) => {
                      const image = event.currentTarget;
                      if (image.naturalHeight > 0) {
                        updateActiveMap((map) => ({ ...map, aspect: image.naturalWidth / image.naturalHeight }));
                      }
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_35%,rgba(34,211,238,0.18),transparent_24%),linear-gradient(135deg,rgba(15,23,42,0.95),rgba(3,7,18,0.98))]" />
                )}

                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_0,rgba(0,0,0,0.2)_72%,rgba(0,0,0,0.45)_100%)]" />

                {isMeasuringScale && scaleMeasurePoints.length > 0 ? (
                  <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
                    {scaleMeasurePoints.length === 2 ? (
                      <line
                        x1={scaleMeasurePoints[0].x * stageSize.width}
                        y1={scaleMeasurePoints[0].y * stageSize.height}
                        x2={scaleMeasurePoints[1].x * stageSize.width}
                        y2={scaleMeasurePoints[1].y * stageSize.height}
                        stroke="rgba(34,211,238,0.95)"
                        strokeDasharray="10 8"
                        strokeWidth="3"
                      />
                    ) : null}
                    {scaleMeasurePoints.map((point, index) => (
                      <g key={`${point.x}-${point.y}-${index}`}>
                        <circle
                          cx={point.x * stageSize.width}
                          cy={point.y * stageSize.height}
                          r="11"
                          fill="rgba(8,15,33,0.95)"
                          stroke="rgba(34,211,238,0.95)"
                          strokeWidth="3"
                        />
                        <text
                          x={point.x * stageSize.width}
                          y={point.y * stageSize.height + 5}
                          textAnchor="middle"
                          className="fill-cyan-100 text-[12px] font-semibold"
                        >
                          {index + 1}
                        </text>
                      </g>
                    ))}
                  </svg>
                ) : null}

                {placements.length > 0 ? (
                  <svg className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
                    <defs>
                      <linearGradient id="detection-zone" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(245,158,11,0.08)" />
                        <stop offset="100%" stopColor="rgba(245,158,11,0.22)" />
                      </linearGradient>
                      <linearGradient id="identification-zone" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(96,165,250,0.10)" />
                        <stop offset="100%" stopColor="rgba(59,130,246,0.30)" />
                      </linearGradient>
                      <linearGradient id="recognition-zone" x1="0" x2="1" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgba(74,222,128,0.20)" />
                        <stop offset="100%" stopColor="rgba(34,197,94,0.40)" />
                      </linearGradient>
                    </defs>
                    {placements.flatMap((placement) => {
                      const model = cameraModels.find((item) => item.id === placement.modelId);

                      if (!model || stageSize.width === 0) return [];

                      const isSelected = placement.id === selectedPlacementId;

                      return getDrawableHeads(placement, model).flatMap((head) => {
                        const stats = buildCameraStats(placement, model, stageSize, mapWidthFt, activeThreshold, head);

                        return stats.zoneBands.map((band, index) => {
                          const zoneFill = index === 0 ? "url(#detection-zone)" : index === 1 ? "url(#identification-zone)" : "url(#recognition-zone)";
                          const zoneStroke = index === 0 ? "rgba(245,158,11,0.70)" : index === 1 ? "rgba(96,165,250,0.78)" : "rgba(74,222,128,0.84)";

                          return (
                            <path
                              key={`${placement.id}-${head.id}-${band.label}`}
                              d={band.pathD}
                              fill={zoneFill}
                              stroke={zoneStroke}
                              strokeWidth={isSelected && index === 2 ? 2.5 : 2}
                              strokeOpacity={isSelected ? 1 : 0.62}
                              fillOpacity={isSelected ? 1 : 0.55}
                            />
                          );
                        });
                      });
                    })}
                  </svg>
                ) : null}

                {hoverStats && hoverPoint && hoverStats.insideFov ? (
                  <div
                    className="pointer-events-none absolute z-20 rounded-2xl border border-cyan-300/30 bg-slate-950/90 px-3 py-2 text-[11px] text-slate-100 shadow-2xl backdrop-blur-md"
                    style={{ left: `${hoverPoint.x * 100}%`, top: `${hoverPoint.y * 100}%`, transform: "translate(16px, 16px)" }}
                  >
                    <div className="text-[10px] uppercase tracking-[0.22em] text-cyan-200">Hover readout</div>
                    <div className="mt-1 font-semibold text-white">
                      {hoverStats.recognitionType}
                      {!hoverStats.insideFov ? " - outside FOV" : ""}
                    </div>
                    <div className="mt-1 text-slate-300">{formatNumber(hoverStats.pixelsPerFoot, 1)} ppf</div>
                    <div className="text-slate-400">{formatNumber(hoverStats.distanceFt, 1)} ft from selected camera</div>
                  </div>
                ) : null}

                {placements.map((placement) => {
                  const model = cameraModels.find((item) => item.id === placement.modelId);

                  if (!model || stageSize.width === 0) return null;

                  const isSelected = placement.id === selectedPlacementId;

                  return (
                    <button
                      key={placement.id}
                      type="button"
                      onPointerDown={(event) => {
                        event.preventDefault();
                        setSelectedPlacementId(placement.id);
                        setDraggingPlacementId(placement.id);
                      }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectedPlacementId(placement.id);
                      }}
                      className="group absolute -translate-x-1/2 -translate-y-1/2"
                      style={{ left: `${placement.x * 100}%`, top: `${placement.y * 100}%` }}
                    >
                      <div
                        className={`absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-cyan-300/10 opacity-0 blur-2xl transition duration-300 group-hover:opacity-100 ${
                          isSelected ? "opacity-100" : ""
                        }`}
                      />
                      <div className={`relative grid h-12 w-12 place-items-center rounded-full border-2 bg-slate-950 shadow-lg ${isSelected ? "border-cyan-300" : "border-white/30"}`}>
                        <div className={`h-4 w-4 rounded-full bg-gradient-to-br ${model.accent}`} />
                        {isMultisensorModel(model)
                          ? getDrawableHeads(placement, model).map((head) => (
                              <span
                                key={head.id}
                                className="absolute left-1/2 top-1/2 h-1 w-5 origin-left rounded-full bg-cyan-200/80"
                                style={{ transform: `rotate(${head.rotationDeg - 90}deg) translateX(7px)` }}
                              />
                            ))
                          : null}
                      </div>
                      <div className="pointer-events-none absolute left-1/2 top-full mt-3 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-slate-950/90 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-slate-200 shadow-xl">
                        {model.name}
                      </div>
                    </button>
                  );
                })}

                {placements.length === 0 ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="max-w-lg rounded-[2rem] border border-dashed border-white/15 bg-slate-950/80 px-6 py-8 text-center shadow-2xl backdrop-blur-md">
                      <div className="text-lg font-semibold text-white">
                        {isMeasuringScale ? "Measure the map scale" : "Load your cameras first"}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        {isMeasuringScale
                          ? "Click two points on the map for a known wall or span, and the planner will update the map scale automatically."
                          : "Pick a camera from the dropdown, then drag it onto the map. After placement, select the camera to set its mount height, lens, tilt, and rotation independently."}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <StatPanel
                label="Current scale"
                value={`${formatNumber(stageSize.width > 0 ? mapWidthFt / stageSize.width : 0, 2)} ft/px`}
                helper="Based on the visible map width"
              />
              <StatPanel
                label="Active floor"
                value={mapName}
                helper={`${placements.length} cameras on this map`}
              />
              <StatPanel
                label="Map source"
                value={mapFile ? mapFile.name : "No image loaded"}
                helper="The planner preserves the image aspect ratio"
              />
            </div>
          </section>

          <aside className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.3)] backdrop-blur-xl">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-semibold text-white">Inspector</h2>
              <p className="text-sm text-slate-400">Fine-tune the selected camera or review its calculated field of view.</p>
            </div>

            {selectedPlacement && selectedModel && inspectedStats ? (
              <div className="mt-4 space-y-4">
                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm uppercase tracking-[0.22em] text-slate-500">Selected camera</div>
                      <div className="mt-2 text-lg font-semibold text-white">{selectedModel.name}</div>
                      <div className="mt-1 text-sm text-slate-400">{selectedModel.description}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={duplicateSelectedPlacement}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-cyan-300/40 hover:bg-cyan-400/10"
                      >
                        Duplicate
                      </button>
                      <button
                        type="button"
                        onClick={deleteSelectedPlacement}
                        className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-100 transition hover:bg-rose-500/20"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>

                <ControlSlider
                  label="Mount height"
                  unit="ft"
                  min={6}
                  max={40}
                  value={selectedPlacement.mountHeightFt}
                  onChange={(value) => updateSelectedPlacement((placement) => ({ ...placement, mountHeightFt: value }))}
                />
                <ControlSlider
                  label="Rotation"
                  unit="deg"
                  min={0}
                  max={359}
                  value={selectedPlacement.rotationDeg}
                  onChange={(value) => updateSelectedPlacement((placement) => ({ ...placement, rotationDeg: value }))}
                />
                {isMultisensorModel(selectedModel) ? (
                  <div className="space-y-3">
                    {getDrawableHeads(selectedPlacement, selectedModel).map((head) => (
                      <div key={head.id} className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-white">{head.label}</div>
                            <div className="text-xs text-slate-400">{formatNumber(head.rotationDeg, 0)} deg absolute view</div>
                          </div>
                          <span className="rounded-full border border-white/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-slate-300">
                            Adjustable
                          </span>
                        </div>
                        <div className="mt-3 space-y-3">
                          <ControlSlider
                            label="Head rotation"
                            unit="deg"
                            min={-180}
                            max={180}
                            value={head.rotationOffsetDeg}
                            onChange={(value) => updateSelectedHead(head.id, (currentHead) => ({ ...currentHead, rotationOffsetDeg: value }))}
                          />
                          <ControlSlider
                            label="Head tilt from down"
                            unit="deg"
                            min={0}
                            max={90}
                            value={head.tiltDeg}
                            onChange={(value) => updateSelectedHead(head.id, (currentHead) => ({ ...currentHead, tiltDeg: value }))}
                          />
                          {hasAdjustableLens(selectedModel) ? (
                            <ControlSlider
                              label="Head lens"
                              unit="mm"
                              min={selectedModel.lensMinMm}
                              max={selectedModel.lensMaxMm}
                              step={0.1}
                              value={head.lensMm}
                              onChange={(value) => updateSelectedHead(head.id, (currentHead) => ({ ...currentHead, lensMm: value }))}
                            />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <>
                    <ControlSlider
                      label={isFisheyeModel(selectedModel) ? "Mount aim" : "Tilt from down"}
                      unit="deg"
                      min={0}
                      max={90}
                      value={selectedPlacement.tiltDeg}
                      onChange={(value) => updateSelectedPlacement((placement) => ({ ...placement, tiltDeg: value }))}
                    />
                    {hasAdjustableLens(selectedModel) ? (
                      <ControlSlider
                        label="Lens length"
                        unit="mm"
                        min={selectedModel.lensMinMm}
                        max={selectedModel.lensMaxMm}
                        step={0.1}
                        value={selectedPlacement.lensMm}
                        onChange={(value) => updateSelectedPlacement((placement) => ({ ...placement, lensMm: value }))}
                      />
                    ) : null}
                  </>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <InfoCard label="Horizontal FOV" value={`${formatNumber(inspectedStats.horizontalFovDeg)} deg`} />
                  <InfoCard label="Vertical FOV" value={`${formatNumber(inspectedStats.verticalFovDeg)} deg`} />
                  <InfoCard label="Pixels per foot" value={formatNumber(inspectedStats.pixelsPerFoot, 1)} />
                  <InfoCard label="Recognition" value={inspectedStats.recognitionType} />
                  <InfoCard label="Aim distance" value={`${formatNumber(inspectedStats.aimDistanceFt)} ft`} />
                </div>

                <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">Planning math</div>
                  <div className="mt-3 space-y-2 text-sm text-slate-300">
                    <Row label="Coverage width" value={`${formatNumber(inspectedStats.coverageWidthFt)} ft`} />
                    <Row label="Target distance" value={`${formatNumber(inspectedStats.targetDistanceFt)} ft`} />
                    {inspectedStats.zoneBands.map((band) => (
                      <Row key={band.label} label={`${band.label} zone`} value={`${formatNumber(band.radiusFt)} ft`} />
                    ))}
                    <Row label="Pixels per foot" value={`${formatNumber(inspectedStats.pixelsPerFoot, 1)} ppf`} />
                    <Row label="Feet per pixel" value={`${formatNumber(inspectedStats.feetPerPixel, 3)} ft`} />
                  </div>
                </div>

                <div className="rounded-3xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm text-cyan-50">
                  The cone is anchored to the selected camera, while the lens and mount height shift the recognition
                  distance in real time. Drag the marker to reposition it.
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm leading-6 text-slate-300">
                No camera selected yet. Drop a model onto the map, then click its marker to tune mount height, lens,
                tilt, and rotation.
              </div>
            )}
          </aside>
        </section>
      </div>
    </main>
  );
}

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_40px_rgba(0,0,0,0.15)]">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function StatPanel({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4">
      <div className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</div>
      <div className="mt-2 text-lg font-semibold text-white">{value}</div>
      <div className="mt-1 text-sm text-slate-400">{helper}</div>
    </div>
  );
}

function InfoChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-900/70 px-3 py-2">
      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-medium text-white">{value}</div>
    </div>
  );
}

function ControlSlider({
  label,
  unit,
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  label: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block rounded-3xl border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center justify-between gap-4 text-sm text-slate-200">
        <span>{label}</span>
        <span className="font-semibold text-white">
          {formatNumber(value, unit === "mm" ? 1 : 0)} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-3 h-2 w-full accent-cyan-400"
      />
    </label>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-white">{value}</span>
    </div>
  );
}
