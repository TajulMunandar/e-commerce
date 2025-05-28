import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import axios from "axios";
import { API_URL } from "@env";

// Tipe data pesanan
type Order = {
  id: number;
  totalPrice: number;
  status: "Belum Bayar" | "Lunas";
  createdAt: string;
  products: string[];
  quantities: string[];
};

interface Props {
  navigation: any;
}

const MyOrdersScreen: React.FC<Props> = ({ navigation }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/orders/user/1` // Endpoint sesuai dengan API
        );
        setOrders(response.data); // Assuming the response returns an array of orders
      } catch (error) {
        setError("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.productName}>Order ID: {item.id}</Text>
            {item.products.map((product, index) => (
              <View key={index} style={styles.productDetail}>
                <Text>Product: {product}</Text>
                <Text>Quantity: {item.quantities[index]}</Text>
              </View>
            ))}
            <Text>
              Total Price: Rp {item.totalPrice.toLocaleString("id-ID")}
            </Text>
            <Text
              style={[
                styles.status,
                item.status === "Lunas" ? styles.lunas : styles.belumBayar,
              ]}
            >
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
  },
  productDetail: {
    marginVertical: 4,
  },
  status: {
    marginTop: 10,
    fontWeight: "bold",
  },
  lunas: {
    color: "green",
  },
  belumBayar: {
    color: "red",
  },
});

export default MyOrdersScreen;
