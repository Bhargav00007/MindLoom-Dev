// types/blog.ts
export interface Blog {
  _id: string;
  title: string;
  description: string;
  category: string;
  authorName: string;
  authorImage: string;
  imagePath: string;
  createdAt: Date;
  updatedAt: Date;
}
