import { getAllOrders} from "../../../utils/api";
import {renderOrders} from "../../client/orders/orders.ts";
import { getCurrentUser} from "../../../utils/auth";
import { navigateTo } from "../../../utils/navigate";

document.addEventListener('DOMContentLoaded', async () => {
    
    const session = getCurrentUser();
    if (!session){
        console.log("No hay sesion, redirigiendo al login");
        navigateTo('/auth/login/login.html');
    }
    const userNameElement = document.getElementById('userNameHeader');
        if (userNameElement){
            userNameElement.textContent = session?.nombre || session?.mail || 'ADMIN';
        }
});

const orders = await getAllOrders();
renderOrders(orders);