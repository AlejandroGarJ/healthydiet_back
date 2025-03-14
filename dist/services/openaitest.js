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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
require("dotenv/config");
const apiKey = process.env.OPENAI_API_KEY;
const openai = new openai_1.default({ apiKey }); // Asegúrate de pasar la API key correctamente
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const completion = yield openai.chat.completions.create({
                messages: [{ role: "system", content: "Generate a diet for a normal person" }],
                model: "gpt-4o-mini", // Asegúrate de que este modelo esté disponible
            });
            console.log(completion.choices[0].message.content); // Acceder al contenido del mensaje
        }
        catch (error) {
            console.error("Error al generar la respuesta:", error);
        }
    });
}
main();
