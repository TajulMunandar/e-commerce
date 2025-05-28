import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { API_URL } from "@env";

// Tipe data produk
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: any; // bisa diganti ImageSourcePropType untuk ketat
};

// Tipe parameter navigasi
type RootStackParamList = {
  ProductDetail: { product: Product };
  Payment: { orderId: string; total: number }; // tujuan checkout
};

type ProductDetailRouteProp = RouteProp<RootStackParamList, "ProductDetail">;

type Props = {
  route: ProductDetailRouteProp;
};

const ProductDetail: React.FC<Props> = ({ route }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { product } = route.params;

  const handleCheckout = async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1, // Ini harusnya id user login, sementara bisa hardcode
          products: [
            {
              product_id: product.id,
              quantity: 1,
              price: product.price,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat order");
      }

      const data = await response.json();

      navigation.navigate("Payment", {
        orderId: data.orderId,
        total: data.totalPrice,
      });
    } catch (error) {
      console.error(error);
      // Tambahkan alert kalau mau
      alert("Gagal melakukan checkout. Silakan coba lagi.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: product.image_url }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>
        Rp {product.price.toLocaleString("id-ID")}
      </Text>

      <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
        <Text style={styles.checkoutButtonText}>Beli Sekarang</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  productImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    marginBottom: 16,
    resizeMode: "cover",
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  productPrice: {
    color: "#777",
    fontSize: 18,
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: "#FF6347", // Warna oranye kemerahan
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  checkoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ProductDetail;
