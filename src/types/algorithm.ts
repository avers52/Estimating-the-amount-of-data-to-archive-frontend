export interface Algorithm {
  algorithm_id: number;
  algorithm_name: string;
  algorithm_description: string | null;
  compression_ratio: number;
  compression_speed_mbps: number;
  image_url: string | null;
  video_url: string | null;
  likes_count: number;
  is_creator?: number;
  is_liked?: number;
  created_at?: string;
  configured_at?: string | null;
}