export interface GeneralObject {
  [key: string]: any;
}

export interface Listing {
  title: string;
  price: number;
  location: string;
  categoryId: string;
  attributes: GeneralObject;
  imageUrl: string;
  description: string;
}
