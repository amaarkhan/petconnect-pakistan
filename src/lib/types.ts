import type { Timestamp } from "firebase/firestore";

export type PostType = "lost" | "found" | "adoption" | "sale";
export type PostStatus = "active" | "found";

export interface Post {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  description: string;
  location: string;
  contact: string;
  images: string[];
  status: PostStatus;
  createdAt: Timestamp | null;
}

export interface Service {
  id: string;
  name: string;
  type: "vet" | "groomer" | "shop";
  location: string;
  phone: string;
}

export interface Comment {
  id: string;
  userId: string;
  name: string;
  body: string;
  createdAt: Timestamp | null;
}
