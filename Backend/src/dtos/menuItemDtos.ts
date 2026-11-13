export interface MenuItemInputDto {
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
}

export interface MenuItemResponseDto {
  id: number;
  stallId: number;
  name: string;
  price: number;
  isAvailable: boolean;
  stall: {
    id: number;
    name: string;
  };
}