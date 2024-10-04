import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const url = import.meta.env.VITE_BACKEND_URL; // Backend Url
  const [token, setToken] = useState(""); // Authentication Token
  const [userData, setUserData] = useState({}); // Default: {}
  const [pricingDetails, setPricingDetails] = useState({}); // Pricing Details: {}
  const [food_list, setFoodList] = useState([]); // Food List Array: []
  const [cartItems, setCartItems] = useState({}); // Default: {}
  const [savedAddresses, setSavedAddresses] = useState([]); // Saved Addresses Array: []
  const [selectedAddress, setSelectedAddress] = useState(null); // Default: null
  const [paymentMethod, setPaymentMethod] = useState("card"); // Default: card
  const [orders, setOrders] = useState([]); // Orders Array: []
  const [discount, setDiscount] = useState(null); // Default: null

  // ********** SERVICES *************
  // Fetch Princing Detials:
  const fetchPricingDetails = async () => {
    const newUrl = `${url}/api/get-pricing-details`;
    try {
      const response = await axios.get(newUrl);
      setPricingDetails(response.data.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Handle User Logout:
  const handleLogout = () => {
    // Set default states:
    localStorage.removeItem("token");
    setToken("");
    setUserData({});
    setCartItems({});
    setSavedAddresses([]);
    setSelectedAddress(null);
    setOrders([]);
  };

  // ********** FOOD LIST *************
  // Fetch All Food Items:
  const fetchFoodList = async () => {
    const newUrl = `${url}/api/food/list`;
    try {
      const response = await axios.get(newUrl);
      const newData = response.data.data.map((foodItem) => {
        return {
          ...foodItem,
          image: `${url}/images/${foodItem.image}`,
        };
      });
      setFoodList(newData);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // ********** USER STATE *************
  // Authenticate User (Login/Register) Function:
  const authenticateUser = async (currLoginState, data) => {
    const endpoint =
      currLoginState === "Login" ? "/api/user/login" : "/api/user/register";
    const newUrl = `${url}${endpoint}`;
    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        return true;
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Error");
    }
    return false;
  };

  // Fetch User Data:
  const fetchUserData = async (token) => {
    const newUrl = `${url}/api/user/fetch`;
    try {
      const response = await axios.get(newUrl, { headers: { token } });
      setUserData(response.data.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Update User Data:
  const updateUserData = async (profileData) => {
    // Checking if user has logged In:
    if (token) {
      const newUrl = `${url}/api/user/update`;
      try {
        const response = await axios.patch(newUrl, profileData, {
          headers: { token },
        });
        if (response.data.data) {
          setUserData(response.data.data);
          return true;
        }
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Error");
        return false;
      }
    }
  };

  // ********** DISCOUNT CODES *************
  const checkDiscount = (inputCode) => {
    const code = inputCode.toUpperCase();
    const percentage = pricingDetails.discountCodes[code];

    if (percentage > 0) {
      setDiscount({ code, percentage });
      return true;
    } else {
      setDiscount(null);
      return false;
    }
  };

  // ********** CART STATE *************
  // Fetch All Cart Items:
  const fetchCartItems = async (token) => {
    const newUrl = `${url}/api/cart/fetch`;
    try {
      const response = await axios.get(newUrl, { headers: { token } });
      setCartItems(response.data.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Add item to the cart:
  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setCartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    // Checking if user has logged In:
    if (token) {
      const newUrl = `${url}/api/cart/add`;
      try {
        const response = await axios.post(
          newUrl,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Remove item from the cart:
  const removeFromCart = async (itemId) => {
    setCartItems((prev) => {
      const updateCart = { ...prev };
      if (updateCart[itemId]) {
        updateCart[itemId] -= 1;

        if (updateCart[itemId] <= 0) {
          delete updateCart[itemId];
        }
      }
      return updateCart;
    });

    // Checking if user has logged In:
    if (token) {
      const newUrl = `${url}/api/cart/remove`;
      try {
        const response = await axios.post(
          newUrl,
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Get cart details:
  const getTotalCartAmount = () => {
    let subtotal = 0;
    let taxRate = pricingDetails.taxRate;
    let delivery = 0;

    // Calculate subtotal
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = food_list.find((product) => product._id === item);
        if (itemInfo) {
          subtotal += itemInfo.price * cartItems[item];
        }
        // Delivery charge only when cart has items
        delivery = pricingDetails.deliveryCharge;
      }
    }

    // Calculate taxAmount and discountAmount after subtotal is known
    let taxAmount = subtotal * (taxRate / 100);
    const discountAmount = discount
      ? (subtotal + taxAmount) * (discount.percentage / 100)
      : 0;

    // Calculate final total
    let finalTotal = subtotal + taxAmount + delivery - discountAmount;

    return {
      subtotal,
      taxRate,
      discount,
      delivery,
      taxAmount,
      discountAmount,
      finalTotal,
    };
  };

  // ********** SAVED ADDRESS STATE *************
  // Fetch User Addresses:
  const fetchUserAddresses = async (token) => {
    const newUrl = `${url}/api/address/fetch`;
    try {
      const response = await axios.get(newUrl, { headers: { token } });
      setSavedAddresses(response.data.data);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Add new user address:
  const addUserAddress = async (address) => {
    if (token) {
      const newUrl = `${url}/api/address/add`;
      try {
        const response = await axios.post(
          newUrl,
          { address },
          { headers: { token } }
        );
        const newAddress = response.data.data;

        setSavedAddresses((prev) => [...prev, newAddress]);
        toast.success(response.data.message);
        return newAddress;
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Error");
      }
    } else {
      toast.error("Login first!");
    }
  };

  // Update user address:
  const updateUserAddress = async (address) => {
    if (token) {
      const newUrl = `${url}/api/address/update`;
      try {
        const response = await axios.patch(
          newUrl,
          { address },
          { headers: { token } }
        );
        const updatedAddress = response.data.data;

        setSavedAddresses((prev) => {
          const index = prev.findIndex(
            (address) => address._id === updatedAddress._id
          );
          if (index !== -1) {
            return [
              ...prev.slice(0, index),
              updatedAddress,
              ...prev.slice(index + 1),
            ];
          }
          return prev;
        });

        // Setting the updated address as default:
        setSelectedAddress({
          ...updatedAddress,
          recipient: {
            ...updatedAddress.recipient,
            phoneNumber: updatedAddress.recipient.phoneNumber.replace(
              /^\+91/,
              ""
            ),
          },
        });

        toast.success(response.data.message);
        return updatedAddress;
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Error");
      }
    }
  };

  // Delete user address:
  const deleteUserAddress = async (addressId) => {
    if (token) {
      const newUrl = `${url}/api/address/delete`;

      // Deleting address in state:
      setSavedAddresses((prev) => {
        const index = prev.findIndex((address) => address._id === addressId);
        if (index !== -1) {
          return prev.filter((address) => address._id !== addressId);
        }
        return prev;
      });

      // Setting null as default:
      setSelectedAddress(null);

      try {
        const response = await axios.post(
          newUrl,
          { addressId },
          { headers: { token } }
        );
        toast.success(response.data.message);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
        toast.error(error.response?.data?.message || "Error");
      }
    }
  };

  // ********** ORDERS STATE *************
  // Creating order:
  const placeOrder = async (addressId, paymentMethod) => {
    let order = {
      items: cartItems,
      discount: discount,
      addressId: addressId,
      paymentMethod: paymentMethod,
    };

    // Checking if user has logged In:
    if (token) {
      const newUrl = `${url}/api/order/place`;

      try {
        const response = await axios.post(
          newUrl,
          { order },
          { headers: { token } }
        );
        const { session_url } = response.data;
        window.location.replace(session_url);
      } catch (error) {
        console.error(error.response?.data?.message || error.message);
      }
    }
  };

  // Verifying order:
  const verifyOrder = async (orderId, sessionId) => {
    const newUrl = `${url}/api/order/verify`;

    try {
      const response = await axios.post(newUrl, { orderId, sessionId });
      if (response.data.data) {
        const newOrder = response.data.data;
        const updateOrder = {
          ...newOrder,
          items: newOrder.items.map((item) => ({
            ...item,
            image: `${url}/images/${item.image}`,
          })),
        };

        if (updateOrder.paymentStatus === true) {
          setOrders((prev) => [...prev, updateOrder]);
        }
        return updateOrder;
      }
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
      return false;
    }
  };

  // Fetch user orders:
  const fetchUserOrders = async () => {
    const newUrl = `${url}/api/order/fetch`;

    try {
      const response = await axios.get(newUrl, { headers: { token } });
      const orders = response.data.data;

      const updateOrders = orders.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          image: `${url}/images/${item.image}`,
        })),
      }));

      setOrders(updateOrders);
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  // Effect for initial data loading:
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      await fetchPricingDetails();
      const token = localStorage.getItem("token");
      if (token) {
        setToken(token);
      }
    }

    loadData();
  }, []); // Run only on mount

  // Effect for actions when token changes:
  useEffect(() => {
    async function fetchData() {
      if (token) {
        await fetchUserData(token);
        await fetchCartItems(token);
        await fetchUserAddresses(token);
      }
    }

    fetchData();
  }, [token]); // Run when token changes

  const contextValue = {
    food_list,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    pricingDetails,

    setDiscount,
    checkDiscount,

    authenticateUser,
    userData,
    updateUserData,
    handleLogout,

    token,
    setToken,

    savedAddresses,
    selectedAddress,
    setSelectedAddress,
    addUserAddress,
    updateUserAddress,
    deleteUserAddress,

    paymentMethod,
    setPaymentMethod,

    orders,
    placeOrder,
    verifyOrder,
    fetchUserOrders,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
