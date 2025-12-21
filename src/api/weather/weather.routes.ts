import express from "express";
import {getCurrentWeather} from "../../application/weather/get-current-weather";


const weatherRouter = express.Router();

weatherRouter
    .route("/current")
    .get(getCurrentWeather);

export default weatherRouter;
