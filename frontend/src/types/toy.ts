export interface Toy {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

export type ToyCreate = Omit<Toy, "id">;
