export interface Algorithm {
  algorithm_id: number;
  algorithm_name: string;
  algorithm_description: string;
  image_url: string | null;
  video_url: string | null;
  compression_ratio: number;
  compression_speed_mbps: number;
  likes_count: number;
  is_liked: number;
}