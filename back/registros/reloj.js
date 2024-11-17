import express from "express";

const reloj = express.Router();

let currentDate = new Date();
currentDate.setHours(currentDate.getHours() - 3);

const simulationSpeed = 1000;

function updateClock() {
    currentDate.setSeconds(currentDate.getSeconds() + 1);
    const mysqlDateTime = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    // console.log(mysqlDateTime);
}

setInterval(updateClock, simulationSpeed);

export default reloj;
