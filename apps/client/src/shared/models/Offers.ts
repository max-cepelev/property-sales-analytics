export interface OfferAnalysis {
  name: string;
  count: number;
  count1: number;
  count2: number;
  count3: number;
  count4: number;
  avgArea: number | null;
  avgPrice: number | null;
  maxFloor: number | null;
  maxPrice: number | null;
  minFloor: number | null;
  minPrice: number | null;
}

export interface OfferAnalysisGraphData
  extends Omit<OfferAnalysis, 'avgArea' | 'minPrice' | 'maxPrice'> {
  avgArea: string | null;
  minPrice: string | null;
  maxPrice: string | null;
}

export interface BuildingAnalysis {
  id: number;
  name: string;
  complex: string;
  building: string;
  developer: string;
  address: string;
  floors: number;
  image: string;
  oneRoomOffers: number;
  twoRoomOffers: number;
  threeRoomOffers: number;
  fourRoomOffers: number;
  actualDate: string;
  totalOffers: number;
}

export type GraphData = {
  name: string;
} & {
  [key: string]: {
    count: number;
    count1: number;
    count2: number;
    count3: number;
    count4: number;
    avgPrice: number | null;
    maxFloor: number | null;
    maxPrice: number | null;
    minFloor: number | null;
    minPrice: number | null;
    floors: number | null;
  };
};

export interface OffersAnalysis {
  buildings: BuildingAnalysis[];
  analysisData: GraphData[];
}

export type SalesDynamicsData = {
  name: string;
} & {
  [key: string]: {
    date: string;
    price: number | null;
    sold: number | null;
    soldArea: number | null;
  };
};
