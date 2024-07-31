"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const puppeteer = require('puppeteer');
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const browser = yield puppeteer.launch({ headless: false });
        const page = yield browser.newPage();
        // Aumenta el tiempo de espera y configura 'waitUntil' para esperar a que la página esté completamente cargada
        yield page.goto('https://chatgpt.com/', { timeout: 60000, waitUntil: 'domcontentloaded' });
    }
    catch (error) {
        console.error('Error occurred while navigating:', error);
    }
}))();
