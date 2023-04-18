import {
  DecorType,
  DecorTypes,
  PropertyClass,
  PropertyClasses,
  WallMaterial,
  WallMaterials,
} from '../constants/enums';

export function getPropertyClassKey(value: string | null) {
  const res = Object.values(PropertyClasses).find((val) => val === value);
  return res ? (res[0] as PropertyClass) : null;
}

export function getWallMaterialKey(value: string | null) {
  const res = Object.values(WallMaterials).find((val) => val === value);
  return res ? (res[0] as WallMaterial) : null;
}

export function getDecorTypeKey(value: string | null) {
  const res = Object.values(DecorTypes).find((val) => val === value);
  return res ? (res[0] as DecorType) : null;
}
