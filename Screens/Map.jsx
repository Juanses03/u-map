import React, { useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Text,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

// Importa el diccionario JSON
import { diccionario } from "../src/diccionario";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // Fondo blanco
  },
  content: {
    width: "80%",
    alignItems: "center",
  },
  searchbarContainer: {
    flexDirection: "row",
    width: "100%",
    height: 60,
    borderRadius: 10,
    borderColor: "#FF7A2D", // Bordes naranja
    borderWidth: 1,
    marginVertical: 10,
    backgroundColor: "#FFF", // Fondo blanco
  },
  searchbarInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
  },
  imageContainer: {
    width: "80%",
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
    borderColor: "#FF7A2D", // Bordes naranja
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF", // Fondo blanco
  },
  image: {
    flex: 1,
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 20,
  },
  button: {
    backgroundColor: "#FF7A2D", // Fondo naranja
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 50,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
  },
  loadingContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    zIndex: 1,
  },
  listItem: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAEAEA",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
});

const App = () => {
  const [origen, setOrigen] = useState("");
  const [destino, setDestino] = useState("");
  const [imagenOrigen, setImagenOrigen] = useState("");
  const [imagenDestino, setImagenDestino] = useState("");
  const [rutaMasCorta, setRutaMasCorta] = useState([]);
  const [loading, setLoading] = useState(false);

  const buscarRuta = () => {
    if (!origen || !destino) {
      Alert.alert("Error", "Debe seleccionar un origen y destino.");
      return;
    }

    // Convierte alias a nombres completos usando el diccionario
    const origenCompleto =
      diccionario.alias_a_nombre_completo[origen] || origen;
    const destinoCompleto =
      diccionario.alias_a_nombre_completo[destino] || destino;

    // Verifica si el origen y destino convertidos existen en el diccionario
    if (!diccionario.alias_a_nombre_completo[origenCompleto]) {
      Alert.alert("Error", `El origen "${origen}" no existe en el diccionario.`);
      return;
    }

    if (!diccionario.alias_a_nombre_completo[destinoCompleto]) {
      Alert.alert("Error", `El destino "${destino}" no existe en el diccionario.`);
      return;
    }

    const data = {
      origen: origenCompleto,
      destino: destinoCompleto,
    };

    setLoading(true);

    fetch("https://scrapingweb.pythonanywhere.com/calcular_ruta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        setImagenOrigen(result.imagenOrigen);
        setImagenDestino(result.imagenDestino);
        setRutaMasCorta(result.ruta_mas_corta);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener la ruta:", error);
        Alert.alert(
          "Error",
          "Ocurrió un error al obtener la ruta. Inténtelo de nuevo más tarde."
        );
        setLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <LinearGradient colors={["#FFF", "#FFF"]} style={styles.container}>
        <View style={styles.content}>
          <View style={styles.searchbarContainer}>
            <GooglePlacesAutocomplete
              placeholder="Origen"
              fetchDetails={true}
              onPress={(data) => {
                setOrigen(data.description);
              }}
              styles={{
                textInput: styles.searchbarInput,
              }}
              renderDescription={(row) => row.description}
            />
          </View>
          <View style={styles.searchbarContainer}>
            <GooglePlacesAutocomplete
              placeholder="Destino"
              fetchDetails={true}
              onPress={(data) => {
                setDestino(data.description);
              }}
              styles={{
                textInput: styles.searchbarInput,
              }}
              renderDescription={(row) => row.description}
            />
          </View>
          {rutaMasCorta.length > 0 && (
            <FlatList
              data={rutaMasCorta}
              renderItem={({ item }) => (
                <View style={styles.listItem}>
                  <Text style={styles.listItemText}>{item}</Text>
                </View>
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imagenOrigen }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: imagenDestino }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={buscarRuta}>
              <Text style={styles.buttonText}>Buscar</Text>
            </TouchableOpacity>
          </View>
        </View>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#FF7A2D" />
          </View>
        )}
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

export default App;
