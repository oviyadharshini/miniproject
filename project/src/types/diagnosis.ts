export interface DiagnosisResult {
  disease: string;
  confidence: number;
  description: string;
  recommendations: string[];
}

export interface DiagnosisHistory {
  id: string;
  created_at: string;
  symptoms: string;
  disease: string;
  confidence: number;
  image_url?: string;
}
