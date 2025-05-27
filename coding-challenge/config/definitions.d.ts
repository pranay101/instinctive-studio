export interface GeneralObject {
  [key: string]: any;
}

export interface Listing {
  _id: { $oid: string };
  title: string;
  price: number;
  location: string;
  categoryId: string;
  attributes: GeneralObject;
  imageUrl: string;
  description: string;
}

export interface Attribute {
  name: string;
  type: string;
  required: boolean;
  description: string;
  order: number;
  values: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  attributeSchema: {
    [key: string]: Attribute;
  };
}

export interface Pagination {
  total: number;
  limit: number;
  offset: number;
}
