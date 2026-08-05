import { category } from "./category";
import { product } from "./product";
import { review } from "./review";
import { customer } from "./customer";
import { order } from "./order";
import { pointsHistoryEntry } from "./pointsHistoryEntry";

export const schema = {
  types: [category, product, review, customer, order, pointsHistoryEntry],
};