import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "@env";

// Tipe data produk
type Product = {
  id: number;
  name: string;
  price: number;
  image_url: string;
  rating: number;
  isFavorite: boolean;
};

// Tipe navigasi
type RootStackParamList = {
  ProductDetail: { product: Product };
  MyOrders: undefined; // Tambahkan route baru untuk halaman Pesanan Saya
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // To manage loading state
  const [error, setError] = useState<string | null>(null); // To manage error state

  // Fetch products from the API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/products`);
        setProducts(response.data); // Assuming the response returns an array of products
      } catch (error) {
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleFavorite = (productId: number) => {
    const updatedProducts = products.map((product) =>
      product.id === productId
        ? { ...product, isFavorite: !product.isFavorite }
        : product
    );
    setProducts(updatedProducts);
  };

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
      {/* Tombol "Pesanan Saya" */}
      <TouchableOpacity
        onPress={() => navigation.navigate("MyOrders")}
        style={styles.orderButton}
      >
        <Text style={styles.orderButtonText}>Pesanan Saya</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Pakaian Serba Murah</Text>

      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("ProductDetail", { product: item })
            }
            style={styles.productCard}
          >
            <Image
              source={{ uri: item.image_url }}
              style={styles.productImage}
              resizeMode="contain"
            />
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productPrice}>
                Rp {item.price.toLocaleString("id-ID")}
              </Text>

              {/* Rating Produk */}
              <View style={styles.ratingContainer}>
                {[...Array(5)].map((_, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.ratingStar,
                      {
                        color: index < item.rating ? "#FFD700" : "#ccc",
                      },
                    ]}
                  >
                    ★
                  </Text>
                ))}
              </View>

              {/* Icon Favorit */}
              <TouchableOpacity
                onPress={() => toggleFavorite(item.id)}
                style={styles.favoriteIcon}
              >
                <Text
                  style={[
                    styles.favoriteText,
                    { color: item.isFavorite ? "#FF6347" : "#ccc" },
                  ]}
                >
                  ♥
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  orderButton: {
    backgroundColor: "#FF6347",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  orderButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: "row",
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    resizeMode: "cover",
  },
  productDetails: {
    marginLeft: 16,
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 4,
    color: "#333",
  },
  productPrice: {
    color: "#777",
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  ratingStar: {
    fontSize: 18,
  },
  favoriteIcon: {
    position: "absolute",
    top: 12,
    right: 12,
  },
  favoriteText: {
    fontSize: 24,
  },
});

export default HomeScreen;
