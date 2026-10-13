import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  CssBaseline,
  Link,
  TextField,
  Typography,
} from "@mui/material";

const API_URL = "https://open.er-api.com/v6/latest/USD";

function App() {
  // Estados
  const [amountUsd, setAmountUsd] = useState("");
  const [exchangeRate, setExchangeRate] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // Pedir la tasa una sola vez al cargar la página
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("La API respondió con un error");
        }

        const data = await response.json();

        if (!data.rates || !data.rates.HNL) {
          throw new Error("La respuesta no contiene la tasa HNL");
        }

        setExchangeRate(data.rates.HNL);
      } catch (error) {
        setErrorMessage(
          "No se pudo obtener la tasa de cambio. Intenta de nuevo más tarde."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchExchangeRate();
  }, []);

  // Cálculo del total en lempiras (2 decimales)
  const amountNumber = parseFloat(amountUsd);
  const totalHnl =
    !isNaN(amountNumber) && exchangeRate
      ? (amountNumber * exchangeRate).toFixed(2)
      : "0.00";

  return (
    <>
      <CssBaseline />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Card elevation={4}>
          <CardContent>
            <Typography variant="h4" component="h1" gutterBottom align="center">
              Conversor USD → HNL
            </Typography>

            {/* Estado: cargando */}
            {isLoading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 3 }}>
                <CircularProgress size={24} />
                <Typography>Cargando...</Typography>
              </Box>
            )}

            {/* Estado: error */}
            {errorMessage && (
              <Alert severity="error" sx={{ my: 3 }}>
                {errorMessage}
              </Alert>
            )}

            {/* Estado: datos listos */}
            {!isLoading && !errorMessage && (
              <>
                <Typography variant="h6" sx={{ my: 2 }}>
                  1 USD = {exchangeRate.toFixed(2)} HNL
                </Typography>

                <TextField
                  label="Cantidad en dólares (USD)"
                  type="number"
                  value={amountUsd}
                  onChange={(event) => setAmountUsd(event.target.value)}
                  fullWidth
                  slotProps={{ htmlInput: { min: 0, step: "any" } }}
                />

                <Typography variant="h5" sx={{ mt: 3 }}>
                  Total: L {totalHnl}
                </Typography>
              </>
            )}

            {/* Atribución obligatoria */}
            <Typography variant="body2" sx={{ mt: 4 }} align="center">
              <Link
                href="https://www.exchangerate-api.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Rates By Exchange Rate API
              </Link>
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}

export default App;