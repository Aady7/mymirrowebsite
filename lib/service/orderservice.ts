import { supabase } from "../supabase";

export const OrderService={
    async createOrder(user_id:string, items:any[], shipping_address:any){
        const order_id=`txn_mymirro_${Date.now()}`
        const total_amount= items.reduce((acc,item)=>acc+item.price*item.quantity,0)
        const {error:order_error}= await supabase.from('orders').insert({
            'order_id':order_id,
            'user_id':user_id,
            'order_amount':total_amount,
            'order_status':'pending',
            'shipping_address':shipping_address,
            'items':items,
        })
        
        if(order_error){
            console.error("Order creation error:", order_error);
            throw new Error(order_error.message)
        }
        
        const  order_items= items.map((item:any)=>({
            order_id:order_id,
            product_id:item.productId,
            quantity:item.quantity,
            price:item.price,
        }));
        
        const {error:order_items_error}= await supabase.from('order_items').insert(order_items)
        if(order_items_error){
            console.error("Order items creation error:", order_items_error);
            throw new Error(order_items_error.message)
        }
        
        console.log("Order created successfully with ID:", order_id, "and total amount:", total_amount);
        return {order_id, total_amount}
    },
    async cancelOrder(order_id:string){
        const {error: cancel_error}= await supabase.from('orders').update({
            'order_status':'cancelled',
        }).eq('order_id', order_id)
        if(cancel_error){
            console.error("Order cancellation error:", cancel_error);
            throw new Error(cancel_error.message)
        }
        return {success:true}
    }

    

   
    
}