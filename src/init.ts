import { app } from "electron";
import { createWindow } from "./window";

app.on('ready', createWindow);
