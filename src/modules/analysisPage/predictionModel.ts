export interface Prediction {
  id: number;
  description: string;
  conclusions: string;
  recommendations: string;
  notes?: string;
  confidence: number;
  has_tumor: boolean;
  segmentation_mask?: string;
  patient_id?: number;
  patient?: {
    full_name: string;
    birth_date: string;
  };
  owner?: {
    full_name: string;
    id: string;
  };
  image_id: string;
  user_id: number;
  created_at: string;
}
