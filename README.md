# canariasjs-lerna-workshop
## Introducción

Texto de introducción

## Proyecto que vamos a montar

En este proyecto vamos a montar un proyecto de tipo lerna. El cual nos permitirá tener una estructura de proyecto monorepo, donde podremos tener varios repositorios independientes, y de paso, una estructura de dependencias entre ellos, si llega a ser necesario.

Despues veremos como podemos interacturar con lerna mediante los distintos comandos que nos ofrece. Asi como interactur entre los distintos paquetes.

Tambien veremos que no sera necesario utilizar un unico bundler, ya que podremos utilizar uno por cada proyecto.

1 Init Repo!
_________________

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

Esto nos deberia crear la sigueinte estructura:

```
lerna-repo/
  packages/
  package.json
  lerna.json
```

Si entramos a lerna.json veremos que nos ha creado un sencillo fichero de configuracion

```json
{
  "packages": [
    "packages/*"
  ],
  "version": "0.0.0"
}
```

Esta configuracion ha sido creada por defecto.

- Packages: nos indica las carpetas que contienen los paquetes que vamos a montar.
- Version: nos indica la version actual de lerna con la que va a comparar para realizar las actualizaciones.

Por otro lado, merece la pena indicar que podemos cambiar la forma de inicializar lerna, pero no lo haremos, de otra manera mediante: `lerna init -i` el cual nos permite inicializar la configuracion pero con el versionado independiente de cada paquete en vez de un verisonado "centralizado".
