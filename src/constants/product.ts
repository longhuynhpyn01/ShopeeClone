// thêm const vào để sortBy chỉ đọc, không thể ghi lại value
export const sortBy = {
  createdAt: "createdAt",
  view: "view",
  sold: "sold",
  price: "price"
} as const;

// định nghĩa để khỏi bị nhầm lẫn
export const order = {
  asc: "asc",
  desc: "desc"
} as const;
