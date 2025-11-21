export interface Scene {
  id: number;
  title: string;
  narrative_text: string;
  visual_description: string;
  imageUrl?: string;
  isLoadingImage: boolean;
}

export interface StoryResponse {
  title: string;
  scenes: {
    title: string;
    narrative_text: string;
    visual_description: string;
  }[];
}