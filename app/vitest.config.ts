import { defineConfig } from "vitest/config";
import { loadEnvFile } from "process";
import { resolve } from "path";

loadEnvFile(".env");

export default defineConfig({
    resolve: {
        alias: {
            $db: resolve(__dirname, "./src/db"),
            $validators: resolve(__dirname, "./src/validators"),
        },
    },
    test: {
        env: process.env,
    },
});
