// types/blog.d.ts
declare module "blog-types" {
  interface BlogDocument {
    _id: string;
    title: string;
    description: string;
    imagePath: string;
    authorName: string;
    authorImage: string;
    createdAt: Date;
    category: string;
    __v: number;
    likes?: string[];
  }
}
