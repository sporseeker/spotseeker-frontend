export interface IAddon {
  id: number;
  event_id: number;
  name: string;
  image_url: string;
  price: string;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface ISortedAddons {
  [category: string]: IAddon[];
}
