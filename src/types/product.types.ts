export interface ProductCreateData {
  name: string;
  slug?: string;
  description: string;
  short_description?: string;
  price: number;
  sale_price?: number;
  cost_price?: number;
  sku?: string;
  barcode?: string;
  stock_quantity?: number;
  low_stock_threshold?: number;
  manage_stock?: boolean;
  in_stock?: boolean;
  is_active?: boolean;
  is_featured?: boolean;
  is_digital?: boolean;
  images?: string[];
  gallery?: string[];
  weight?: number;
  dimensions?: Record<string, any> | null;
  category_id: string;
  brand_id?: string;
  attributes?: Record<string, any>;
  variations?: Record<string, any>;
  meta_title?: string;
  meta_description?: string;
  seo_keywords?: string[];
}

export interface ProductUpdateData extends Partial<ProductCreateData> {}

export interface ProductFilters {
  search?: string;
  category_id?: string;
  brand_id?: string;
  stock_status?: 'in_stock' | 'low_stock' | 'out_of_stock' | 'all';
  status?: 'active' | 'inactive' | 'all';
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  sort_by?: string;
  sort_direction?: 'asc' | 'desc';
}
