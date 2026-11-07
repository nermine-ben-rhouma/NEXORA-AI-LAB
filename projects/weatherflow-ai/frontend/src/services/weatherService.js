import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8004",
  timeout: 20000,
});

export const getCurrentWeather = async (city) => {
  const response = await API.get("/api/v1/weather/current", {
    params: { city },
  });

  return response.data;
};

export const getWeatherForecast = async (city) => {
  const response = await API.get("/api/v1/weather/forecast", {
    params: { city },
  });

  return response.data;
};
