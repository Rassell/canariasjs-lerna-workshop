# canariasjs-lerna-workshop

## Introducción

Texto de introducción

## Proyecto que vamos a montar

En este proyecto vamos a montar un proyecto de tipo lerna. El cual nos permitirá tener una estructura de proyecto monorepo, donde podremos tener varios repositorios independientes, y de paso, una estructura de dependencias entre ellos, si llega a ser necesario.

Despues veremos como podemos interacturar con lerna mediante los distintos comandos que nos ofrece. Asi como interactur entre los distintos paquetes.

Tambien veremos que no sera necesario utilizar un unico bundler, ya que podremos utilizar uno por cada proyecto.

1 Init Repo!

---

Primero de todo lo instalaremos globalmente en nuestro npm (o yarn)

```bash
npm install --global lerna
```

Luego crearemos una carpeta donde vamos a montar nuestro proyecto.

```bash
mkdir lerna-workshop
```

Luego iniciaremos lerna con el siguiente commando:

```bash
lerna init
```

Por ultimo a;adiremos un gitignore bastante basico:

```bash
touch .gitignore
```

Y a;adiremos lo siguiente en dicho gitignore:

```
node_modules
dist
```

Esto nos deberia crear la sigueinte estructura:

```
lerna-repo/
  packages/
  package.json
  .gitignore
  lerna.json
```

2. Entendiendo la configuracion de lerna

---

Si entramos a lerna.json veremos que nos ha creado un sencillo fichero de configuracion

```json
{
  "packages": ["packages/*"],
  "version": "0.0.0"
}
```

Esta configuracion ha sido creada por defecto.

- Packages: nos indica las carpetas que contienen los paquetes que vamos a montar.
- Version: nos indica la version actual de lerna con la que va a comparar para realizar las actualizaciones.

Por otro lado, merece la pena indicar que podemos cambiar la forma de inicializar lerna, pero no lo haremos, de otra manera mediante: `lerna init -i` el cual nos permite inicializar la configuracion pero con el versionado independiente de cada paquete en vez de un verisonado "centralizado". Tambien vale la pena especificar que se puede cambiar esto a gusto (que ya veremos mas adelante en el curso).

Para los usuarios de yarn, podeis cambiar el cliente predeterminado con el cual correr los commandos de lerna especificando la siguiente configuracion:

```json
{
  ...
  "npmClient": "yarn"
  ...
}
```

3. Crear nuestro primer paquete

---

En lerna tenemos varias opciones de agregar paquetes a nuestro proyecto:

- Crear un paquete nuevo "a mano".
- Utilizar los comandos de lerna para agregar paquetes.

Primero de todo veremos un ejemplo "a mano":

```bash
cd packages
mkdir myFirstPackage
cd myFirstPackage
npm init -y
```

ahora si volvemos a la carpeta raiz y ejecutamos el siguiente comando:

```bash
lerna list
```

Esto nos deberia mostrar lo siguiente:

```bash
lerna notice cli v4.0.0
myfirstpackage
lerna success found 1 package
```

Y ahora vamos a mirar las opciones que nos permite el commando lerna create:

```bash
lerna create --help
```

Vemos que por ahora nos interesa lo siguiente de la opcion create:

- name: nombre del paquete que vamos a crear.
- --yes: nos permite omitir la pregunta de confirmacion.

Por ahora vamos a omitir la opcion de loc ya que utilizaremos la primera configuracion de paquetes en lerna.json.

```bash
lerna create mySecondPackage -y
```

Veremos que este comando nos crea scaffolding basicos para nuestro paquete con tests

ahora vamos a ver cuantos paquetes nos detecta lerna:

```bash
lerna list
```

```bash
lerna notice cli v4.0.0
myfirstpackage
mySecondPackage
lerna success found 2 packages
```

4. Agregar bundlers

---

Para hacerlo mas real vamos agregar unos bundlers a nuestros paquetes.

En mi caso voy a utilizar rollup y vite. Pero sois libres de utilizar cualquier otro bundler que vosotros quieras.

Aprovecharemos y utilizaremos el siguiente comando para a;adir dependencias a varios paquetes a la vez:

```bash
lerna add typescript --dev
```

y veremos como lo ha a;adido a varios paquetes:

```bash
info cli using local version of lerna
lerna notice cli v4.0.0
lerna info Adding typescript in 1 package
lerna info Bootstrapping 2 packages
lerna info Installing external dependencies
lerna info Symlinking packages and binaries
lerna success Bootstrapped 2 packages
```

Por otro lado a;adiremos el rollap en myFirstPackage junto con algunos paquetes que necesitaremos:

```
cd packages/myFirstPackage
npm install --save-dev rollup @rollup/plugin-typescript @rollup/plugin-commonjs
```

Ahora vamos los ficheros de configuracion necesarios para que typescript y rollup funcionen:

- Creamos tsconfig.json con lo siguiente:

```json
{
  "compilerOptions": {
    "declaration": true,
    "module": "esnext",
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "sourceMap": true,
    "moduleResolution": "node",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
    "outDir": "./dist"
  },
  "exclude": ["dist", "node_modules"],
  "include": ["src/**/*"]
}
```

- Creamos rollup.config.js con lo siguiente:

```js
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
```

Como vereis nos sigue faltando el propio codigo! sino no tenemos nada del que hacer el bundle!

Crearemos un fichero src/index.ts con lo siguiente:

```ts
export function Hello(name: string) {
  console.log(`Hello Mr: ${name}`);
}
```

No podemos olvidarnos de actualizar el package.json para que lanze el comando esperado!

```json
 "scripts": {
   "build": "rollup -c"
 }
```

Y sinceramente, esto no esta mal (quien no se siente orgulloso de lo que hace) pero nosotros queremos que lerna nos facilite el trabajo.
Os imaginais tirar este comando por cada uno de los paquetes? seria un infierno!

Para solucionar esto, lerna nos permite lanzar un commando especial que nos facilitara el trabajo.
A;adiremos lo siguiente en los scripts de nuestro package.json principal:

```bash
"build": "lerna run build"
```

Esto nos permitira que lerna nos ayude a hacer el bundle de todos nuestros paquetes! Y con una facilidad, si el commando no existe en X paquete, no lo ejecuta tal como vemos en la ejecucion del comando.

```bash
lerna notice cli v4.0.0
lerna info Executing command in 1 package: "npm run build"
lerna info run Ran npm script 'build' in 'myfirstpackage' in 0.8s:

> myfirstpackage@1.0.0 build
> rollup -c

lerna success run Ran npm script 'build' in 1 package in 0.8s:
lerna success - myfirstpackage
```

Ahora vamos a repetir el mismo proceso para nuestro segundo paquete, pero en este caso vamos a probar otro bundler, y por que no, otros commandos de lerna (para verlos):

```bash
lerna add vite --dev --scope=mySecondPackage
```

```bash
cd packages/mySecondPackage
npm i --save react react-dom
npm i --save-dev @types/node @types/react @types/react-dom @vitejs/plugin-react vite-plugin-dts
```

Ahora vamos los ficheros de configuracion necesarios para que typescript y rollup funcionen:

- Creamos tsconfig.json con lo siguiente:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ESNext"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": false,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"]
}
```

- Creamos vite.config.ts con lo siguiente:

```ts
import react from "@vitejs/plugin-react";
import * as path from "node:path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.tsx"),
      name: "index",
      formats: ["umd"],
      fileName: () => `index.js`,
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});
```

Como veis le hemos explicado a vite que nos ponga ciertas dependencias como externas, esto es xk queremos exprimir al maximo el peso de nuestros componentes (si, vite utiliza rollup por debajo, si no me equivoco y esbuild para trabajar, podriamos decir que coje lo mejor de cada casa!)

Eliminaremos la carpeta que nos creo lerna de lib y crearemos una carpeta src con el fichero index.tsx con un componente basico de react:

```tsx
export function Counter() {
  return <div>hello world</div>
}
```

Y como siempre a;adimos el commando esperado en nuestro package.json:

```bash
"build": "tsc && vite build"
```

y con esto vemos como nos compila vite nuestro paquete!

```bash
vite v2.9.8 building for production...
✓ 9 modules transformed.
dist/my-lib.es.js   1.35 KiB / gzip: 0.69 KiB
dist/my-lib.umd.js   1.35 KiB / gzip: 0.78 KiB
```

Y por ultimo para terminar de pulir nuestros paques vamos a a;adir/cambiar estas definiciones del package.json

```json
  "main": "dist/{nombreDelPaquete}.js",
  "types": "dist/{nombreDelPaquete}.d.ts",
  "files": [
    "dist",
    "src"
  ],
```

5. Probando nuestros paquetes
___

Ahora que ya tenemos nuestros paquetes creados vamos a probarlos para ver que todo funciona como esperamos.
Para ello vamos a crear con vite un proyecto llamado testsite donde vamos a probar nuestros paquetes.

```bash
npm create vite@latest testsite -- --template react-ts
```

Y ahora, mientras no tengamos los paquetes publicados vamos a a;adirlos de manera local, para ello ejecutaremos lo siguiente:

```bash
cd testsite
npm i
npm i --save ../packages/myFirstPackage ../packages/mySecondPackage
```

con esto deberiamos de ver nuestros paquetes a;adidos en las dependencias de nuestro proyecto:

```json
"myfirstpackage": "file:../packages/myFirstPackage",
"mySecondPackage": "file:../packages/mySecondPackage",
```

Y por ultimo como hemos puestos nuestros paquetes como umd (a vite no le molan), los a;adiremos en la config de vite

```ts
...
optimizeDeps: {
  include: ["myfirstpackage", "mySecondPackage"],
},
...
```

y con esto podremos utilizarlos tranquilamente en nuestra App.tsx:

```tsx
import { Counter } from "mySecondPackage";
import { Hello } from "myfirstpackage";

function App() {
  const [count, setCount] = useState(0);

  Hello(count.toString());

  return (
    <div className="App">
      <Counter />
      <header className="App-header">
```

6. Bootstrap
___

Ahora empezaremos a liarnos con instalacion de paquetes y linkearlos entre ellos.

Para hacer un ejemplo rapido vamos a ejecutar el siguiente comando

```bash
lerna add myfirstpackage --scope=mySecondPackage
```

Aunque no sea el susodicho (bootstrap) podemos ver que se ejecuta automaticamente ya que lo reconoce como paquete ya que nos ha puesto la version actual en el package.json peeeeero, si no vamos a node_modules veremos que lerna lo a detectado como un paquete nuestro y por lo tanto es un symlink

7. Hoist
___

Otra cosa buena con la que nos permite jugar lerna es con el tema del hoisting. Es una sencilla opcion (pero hay que tratarla con cuidado) que nos permite instalar las dependencias de una vez en vez de scoped por asi decirlo.

Para ello vamos a modificar el archivo lerna.json y vamos a;adir la siguiente opcion

```json
"hoist": true,
```

Tambien vamos a borrar las carpetas node_modules y los ficheros -lock.json, a partir de ahora vamos a dejar a lerna ocuparse de las dependencias

y una vez modificado el fichero y borrada la carpeta de node_modules vamos a lanzar el comando en la carpeta raiz

```bash
lerna bootstrap
```

esta nos deberia resultar en lo siguiente:

```bash
info cli using local version of lerna
lerna notice cli v4.0.0
lerna info Bootstrapping 2 packages
lerna info Installing external dependencies
lerna info hoist Installing hoisted dependencies into root
lerna info hoist Pruning hoisted dependencies
lerna info hoist Finished pruning hoisted dependencies
lerna info hoist Finished bootstrapping root
lerna info Symlinking packages and binaries
lerna success Bootstrapped 2 packages
```

Si ejecutamos nuestro comando de build veremos que todo sigue funcionando correctamente:

```bash
npm run build
```

y para terminar de confirmar que funciona correctamente ejecutaremos nuestro test site:

```bash
cd testsite
npm run dev
```

8. Testing
___

Ahora que ya tenemos nuestros componentes linkeados, vemos que todo funciona y encima no reinstalamos dependencias a lo loco. Todo va de lujooooo.
Pero eh!? nos falta testear! para ello vamos a utilizar a nuestro amigo Jest para facilitarnos la tarea, para ello instalaremos lo siguiente en el root:

```bash
npm i --save-dev jest ts-jest jest-environment-jsdom @types/jest @testing-library/react @testing-library/jest-dom
npx ts-jest config:init
```

esta configuracion inicial no esta mal pero necesitaremos modificarla un poco:

```js
/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect"],
  globals: {
    "ts-jest": {
      tsconfig: "<rootDir>/packages/mySecondPackage/tsconfig.json",
    },
  },
};
```

POR FAVOR crear un tsconfig a nivel de solucion y extender los paquetes de ese para entornos reales!

Modificamos el fichero package.json para que ejecute los tests a;adiendo el siguiente commando:

```json
"test": "jest",
```

Y con esto nos vamos a `packages/mySecondPackage/__tests__`, recordar que esto ya nos lo creo lerna y renombramos el fichero que tenemos por *.tsx

A;adimos lo siguiente:

```tsx
import { render, screen } from "@testing-library/react";

import { Counter } from "../src/index";

describe("<Counter />", () => {
  test("should display a hello world", async () => {
    render(<Counter />);

    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
```

y ahora si que si tenemos los tests funcionando!

```bash
npm test

> test
> jest

 PASS  packages/mySecondPackage/__tests__/mySecondPackage.test.tsx
  <Counter />
    ✓ should display a hello world (13 ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.425 s, estimated 2 s
Ran all test suites.
```

9. Storybook
___

Vamos a a;adir la herramienta storybook que nos permitira mostrar lo chulo que son nuestros componentes, para ello vamos a ejecutar lo siguiente, dentro de una nueva carpeta llamada storybook, por que en otra y no en raiz? Pues porque al hacer hoist, nuestra dependencia de react-dom difiere de la necesaria por @storybook/react (https://github.com/storybookjs/storybook/blob/088ab2a96a799713098cee808e3c05a0d1484c49/app/react/package.json#L82) y esto nos puede causar problemas

```bash
npm i --save-dev vite
npx sb init --builder storybook-builder-vite
y
react
```

Nos creara una carpeta de stories, la borramos, y nos dirijimos a `./storybook/main.js` y cambiamos donde busca las stories por lo siguiente:

```js
"../../packages/**/*.stories.mdx",
"../../packages/**/*.stories.@(js|jsx|ts|tsx)"
```

Crear una story dentro de mySecondPackage/stories/mySecondPackage.story.tsx con 

```tsx
import { ComponentMeta, ComponentStoryObj } from "@storybook/react";
import { Counter } from "../src/index";

const meta: ComponentMeta<typeof Counter> = {
  title: "Design System/MyButton",
  component: Counter,
};
export default meta;

export const Primary: ComponentStoryObj<typeof Counter> = {};
```

El linter nos dira que no puede encontrar `"@storybook/react"` , podemos instalarlo en dev si asi lo queremos para que no nos escupa pero la ejecucion funcionara correctamente sin problemas.

para ello nos iremos a la carpeta de storybook y ejecutaremos

```bash
npm run storybook
``` 

y con esto ya tendremos nuestro div con hello world!


10. Versionado de lerna
___

En lerna tenemos varios modos de versionar, o todos juntos de la mano (ej: proyecto de firebase) o cada paquete por separado. 

Para probarlo vamos a lanzar el comando de lerna para versionar (tener en cuenta que si detecta cambios en ficheros no indicados a ignorar no nos dejara hacer commit):

```bash
lerna version
```

Este comando nos preguntara que version queremos poner (como en lerna.json tiene especificado el 0.0.0), patch, minor, major. en nuestro caso vamos a empezar con un patch.

Acto seguido nos ense;ara los paquetes que va a modificar y si queremos hacerlo, en nuestro caso decimos que si

Como vemos nos ha modificado los package.json con la version esperada, tanto los package.json como las dependencias.

En este caso estamos usando el versionado general, es decir da igual si modificamos 1 que mil, todos subiran de version. para verlo, vamos a cambiar algo de mySecondPackage, myFirstPackage no tiene dependencias por lo tanto no subira, pero al hacer un versionado general, cambiara.

Nos vamos a mySecondPackage y modificamos algo dentro del index.tsx, hacemos commit de los cambios y lanzamos lerna version:

```bash
info cli using local version of lerna
lerna notice cli v4.0.0
lerna info current version 0.0.1
lerna info Looking for changed packages since v0.0.1
? Select a new version (currently 0.0.1) Patch (0.0.2)

Changes:
 - myfirstpackage: 0.0.1 => 0.0.2
 - mySecondPackage: 0.0.1 => 0.0.2

? Are you sure you want to create these versions? (ynH)
```

como vemos nos ha modificados todos da igual que haya sido modificado o no

esto puede ser cambiado especificando el flag `independent` en lerna.json

para ello vamos a lerna.json y cambiamos el version de 0.0.2 a independent.

Y lo mismo, nos vamos a mySecondPackage, volvemos a cambiar algo, commit y lerna build

```bash
lerna notice cli v4.0.0
lerna info versioning independent
lerna info Looking for changed packages since v0.0.2
? Select a new version for mySecondPackage (currently 0.0.2) Patch (0.0.3)

Changes:
 - mySecondPackage: 0.0.2 => 0.0.3

? Are you sure you want to create these versions? (ynH) 
```

Como vemos solo hace cambios en el paquete "esperado", esto va a question de gustos, la que mas rabia os de!

Ahora vamos a por el siguiente y vamos a probar los  --conventional-commits!


