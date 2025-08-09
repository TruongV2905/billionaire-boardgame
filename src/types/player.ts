export interface Player {
  id: number;
  name: string;
  money: number;
  lands: string[]; // hoặc mảng object nếu sau này bạn có thông tin đất chi tiết
}
