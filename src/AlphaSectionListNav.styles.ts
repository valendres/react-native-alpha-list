import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    right: 5,
    top: 50,
    bottom: 50,
  },

  item: {
    flexGrow: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },

  text: {
    fontWeight: "700",
    color: "#008fff",
  },

  textInactive: {
    fontWeight: "700",
    color: "#CCCCCC",
  },
});
