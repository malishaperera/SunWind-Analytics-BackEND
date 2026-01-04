import axios from "axios";

export const fetchCurrentWeather = async (
    latitude: number,
    longitude: number
) => {
    const response = await axios.get(
        "https://api.open-meteo.com/v1/forecast",
        {
            params: {
                latitude,
                longitude,
                current_weather: true,
            },
        }
    );
    return response.data;
};
