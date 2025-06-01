import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./screens/HomeScreen";
import ProductDetail from "./screens/ProductDetail";
import PaymentScreen from "./screens/PaymentScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import MyOrdersScreen from "./screens/MyOrdersScreen";

// Tipe produk
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: any; // atau pakai ImageSourcePropType
};

// Definisi parameter untuk tiap screen
export type RootStackParamList = {
  Home: undefined;
  ProductDetail: { product: Product };
  Payment: { orderId: string; total: number };
  Login: undefined;
  Register: undefined;
  MyOrders: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="Payment" component={PaymentScreen} />
        <Stack.Screen name="MyOrders" component={MyOrdersScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
