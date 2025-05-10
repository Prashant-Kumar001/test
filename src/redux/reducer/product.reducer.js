import { createSlice } from "@reduxjs/toolkit";

const TAX_RATE = 12.0;
const SHIPPING_FEE = 20.0;
const DELIVERY_FEE = 200.0;
const FREE_DELIVERY_THRESHOLD = 10;

const calculateTotals = (cart, discountAmount = 0) => {
    const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasItems = totalQuantity > 0;

    const delivery = totalQuantity >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const shipping = hasItems ? SHIPPING_FEE : 0;
    const tax = hasItems ? TAX_RATE : 0;

    return {
        totalQuantity,
        subTotal,
        delivery,
        shipping,
        tax,
        discount: Math.min(discountAmount, subTotal),
        grandTotal: Math.max(0, subTotal + tax + shipping + delivery - discountAmount),
    };
};

const updateCartItem = (state) => {
    try {
        localStorage.setItem("cart-product", JSON.stringify(state.cart));
        localStorage.setItem("cart-totalQuantity", state.totalQuantity.toString());
        localStorage.setItem("cart-subTotal", state.subTotal.toString());
        localStorage.setItem("cart-delivery", state.delivery.toString());
        localStorage.setItem("cart-tax", state.tax.toString());
        localStorage.setItem("cart-shipping", state.shipping.toString());
        localStorage.setItem("cart-discount", state.discount.toString());
        localStorage.setItem("cart-grandTotal", state.grandTotal.toString());
    } catch (error) {
        console.error("Failed to update localStorage:", error);
    }
};

const initialState = {
    cart: (() => {
        try {
            return JSON.parse(localStorage.getItem("cart-product") || "[]");
        } catch (e) {
            return [];
        }
    })(),
    totalQuantity: Number(localStorage.getItem("cart-totalQuantity")) || 0,
    subTotal: Number(localStorage.getItem("cart-subTotal")) || 0,
    tax: Number(localStorage.getItem("cart-tax")) || TAX_RATE,
    delivery: Number(localStorage.getItem("cart-delivery")) || DELIVERY_FEE,
    shipping: Number(localStorage.getItem("cart-shipping")) || SHIPPING_FEE,
    discount: Number(localStorage.getItem("cart-discount")) || 0,
    grandTotal: Number(localStorage.getItem("cart-grandTotal")) || 0,
    shippingInfo: {
        address: "",
        city: "",
        state: "",
        country: "",
        pinCode: "",
    },
    error: null,
    loading: false,
};

export const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = { ...action.payload.product, quantity: 1 };
            const index = state.cart.findIndex((item) => item._id === product._id);

            if (index > -1) {
                state.cart[index].quantity += 1;
            } else {
                state.cart.push(product);
            }

            Object.assign(state, calculateTotals(state.cart, state.discount));
            updateCartItem(state);
        },

        incrementProduct: (state, action) => {
            const index = state.cart.findIndex((item) => item._id === action.payload.id);
            if (index > -1) {
                state.cart[index].quantity += 1;
                Object.assign(state, calculateTotals(state.cart, state.discount));
                updateCartItem(state);
            }
        },

        decrementProduct: (state, action) => {
            const index = state.cart.findIndex((item) => item._id === action.payload.id);
            if (index > -1) {
                if (state.cart[index].quantity <= 1) {
                    state.cart = state.cart.filter((item) => item._id !== action.payload.id);
                } else {
                    state.cart[index].quantity -= 1;
                }
                Object.assign(state, calculateTotals(state.cart, state.discount));
                updateCartItem(state);
            }
        },

        discardProduct: (state, action) => {
            state.cart = state.cart.filter((item) => item._id !== action.payload.id);
            Object.assign(state, calculateTotals(state.cart, state.discount));
            updateCartItem(state);
        },

        emptyCart: (state) => {
            state.cart = [];
            state.totalQuantity = 0;
            state.subTotal = 0;
            state.delivery = 0;
            state.shipping = 0;
            state.tax = 0;
            state.discount = 0;
            state.grandTotal = 0;
            updateCartItem(state);
        },

        applyCouponDiscount: (state, action) => {
            state.discount = Math.min(action.payload.discountAmount, state.subTotal);
            Object.assign(state, calculateTotals(state.cart, state.discount));
            updateCartItem(state);
        },
        saveShippingInfo: (state, action) => {
            state.shippingInfo = action.payload;
        },
    },
});

export default productSlice.reducer;
export const {
    addToCart,
    incrementProduct,
    decrementProduct,
    discardProduct,
    emptyCart,
    applyCouponDiscount,
    saveShippingInfo,
} = productSlice.actions;
