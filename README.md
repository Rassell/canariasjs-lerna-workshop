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

Primero a;adiremos el rollap en myFirstPackage junto con algunos paquetes que necesitaremos:

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

Y no podemos olvidarnos de actualizar el package.json para que lanze el comando esperado!

 ```json
  "scripts": {
    "build": "rollup -c"
  }
  ```


x.a. A;adir turbo repo?
_________________
````
