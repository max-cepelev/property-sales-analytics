import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PropertyType } from '../constants/enums';

interface SelectorStore {
  groupId: number | null;
  complexId: number | null;
  developerId: number | null;
  buildingId: number | null;
  cityId: number | null;
  regionId: number | null;
  districtId: number | null;
  isFavorites: boolean;
  isDrawerOpen: boolean;
  propertyType: PropertyType;
  favorites: number[];
  page: number;
}

interface SelectorStoreActions {
  setGroupId: (groupId: number | null) => void;
  setComplexId: (complexId: number | null) => void;
  setBuildingId: (buildingId: number | null) => void;
  setPropertyType: (propertyType: PropertyType) => void;
  setRegionId: (regionId: number | null) => void;
  setDistrictId: (districtId: number | null) => void;
  setDeveloperId: (developerId: number | null) => void;
  setCityId: (complexId: number | null) => void;
  toggleFavorites: (buildingId: number) => void;
  toggleFavoriteFilter: () => void;
  toggleDrawer: () => void;
  setPage: (page: number) => void;
  reset: () => void;
}

const initState: SelectorStore = {
  groupId: null,
  complexId: null,
  developerId: null,
  regionId: null,
  cityId: null,
  buildingId: null,
  districtId: null,
  isFavorites: false,
  isDrawerOpen: false,
  propertyType: 'LIVING',
  favorites: [],
  page: 1,
};

export const useSelectorStore = create(
  persist<SelectorStore & SelectorStoreActions>(
    (set, get) => ({
      ...initState,
      setGroupId(groupId) {
        set({ groupId, page: 1, complexId: null });
      },
      setComplexId(complexId) {
        set({ complexId, page: 1 });
      },
      setBuildingId(buildingId) {
        set({ buildingId, page: 1 });
      },
      setPropertyType(propertyType) {
        set({ propertyType, page: 1 });
      },
      setRegionId(regionId) {
        set({ regionId, cityId: null, page: 1 });
      },
      setDistrictId(districtId) {
        set({ districtId, complexId: null, page: 1 });
      },
      setDeveloperId(developerId) {
        set({ developerId, page: 1 });
      },
      setCityId(cityId) {
        set({ cityId, districtId: null, page: 1 });
      },
      toggleFavorites(buildingId) {
        const favorites = get().favorites;
        if (favorites.includes(buildingId)) {
          set({ favorites: favorites.filter((item) => item !== buildingId) });
        } else {
          set({ favorites: [...favorites, buildingId] });
        }
      },
      toggleFavoriteFilter() {
        set({ isFavorites: !get().isFavorites });
      },
      toggleDrawer() {
        set({ isDrawerOpen: !get().isDrawerOpen });
      },
      setPage(page) {
        set({ page });
      },
      reset() {
        set(initState);
      },
    }),
    {
      name: 'analytics', // name of item in the storage (must be unique),
      // getStorage: () => localStorage, // (optional) by default the 'localStorage' is used
    },
  ),
);
