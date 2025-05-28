import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { API_URL } from "@env";

type PaymentScreenRouteProp = {
  Payment: {
    orderId: string;
    total: number;
  };
};

type Props = {
  route: RouteProp<PaymentScreenRouteProp, "Payment">;
};

export default function PaymentScreen({ route }: Props) {
  const { orderId, total } = route.params;
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const response = await fetch(`${API_URL}/payment/${orderId}`);
        console.log("Order ID yang mau di fetch:", orderId);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQrCode(data.qrCode);
      } catch (error) {
        console.error("Failed to fetch QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [orderId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#e91e63" />
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f8f8",
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 16,
          color: "#333",
        }}
      >
        Pembayaran Anda
      </Text>
      <Text style={{ fontSize: 16, color: "#777", marginBottom: 16 }}>
        Scan QR untuk melakukan pembayaran
      </Text>

      {/* Tampilkan QR */}
      {qrCode && (
        <Image
          source={{ uri: qrCode }}
          style={{ width: 200, height: 200, backgroundColor: "white" }}
          resizeMode="contain"
        />
      )}

      <View
        style={{
          marginTop: 16,
          padding: 12,
          backgroundColor: "#fff",
          borderRadius: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#333" }}>
          Total Pembayaran
        </Text>
        <Text style={{ fontSize: 22, color: "#e91e63", marginTop: 8 }}>
          Rp {total.toLocaleString("id-ID")}
        </Text>
      </View>
    </View>
  );
}
