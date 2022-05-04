import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";

export default {
  input: "src/index.ts",
  output: {
    sourcemap: true,
    dir: "dist",
    format: "cjs",
  },
  plugins: [commonjs(), typescript()],
};
