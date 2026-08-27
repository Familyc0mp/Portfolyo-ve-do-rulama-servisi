// Supabase veritabanı tipleri — otomatik üretilecek, şimdilik elle yazıldı

export type DocumentStatus = 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'REVOKED';

export interface Document {
  id: string;
  token: string;
  title: string;
  status: DocumentStatus;
  pdf_url: string | null;
  created_date: string | null;
  valid_from: string | null;
  valid_until: string | null;
  institution_name: string | null;
  institution_director: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Signer {
  id: string;
  document_id: string;
  first_name: string;
  last_name: string;
  profession: string;
  ekipnet_number: string | null;
  chamber_registration_number: string | null;
  display_order: number;
  created_at: string;
}

export interface PortfolioContent {
  id: string;
  section: string;
  content: Record<string, unknown>;
  updated_at: string;
}

export interface DocumentWithSigners extends Document {
  signers: Signer[];
}

// Portfolio content tipleri
export interface HeroContent {
  title: string;
  subtitle: string;
  cta_text: string;
  cta_link: string;
  background_image: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface ServicesContent {
  title: string;
  subtitle: string;
  items: ServiceItem[];
}

export interface AboutContent {
  title: string;
  description: string;
  founded_year: string;
  values: string[];
}

export interface ContactContent {
  title: string;
  email: string;
  phone: string;
  address: string;
  maps_url: string;
}
