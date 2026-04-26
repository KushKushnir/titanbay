import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
    resolve: {
        alias: {
            $db: resolve(__dirname, "./src/db"),
            $validators: resolve(__dirname, "./src/validators"),
        },
    },
});
