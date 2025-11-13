import { getAllOrders} from "../../../utils/api";
import {renderOrders} from "../../client/orders/orders.ts";

const orders = await getAllOrders();
renderOrders(orders);