# canariasjs-lerna-workshop

## Como versionar nuestro producto de forma automática usando Git y Azure DevOps (o el sistema que más rabia nos da)
### Introducción

Hoy en día muchos equipos de desarrollo se organizan en mayor o menor medida haciendo uso de una metodología agile, siguen/seguimos una aproximación a Scrum en la que el proyecto/producto que vamos a entregar lo separamos por sprints de una duración de 2/3/4 semanas dependiendo del equipo. En ese tiempo el equipo realiza las Tareas que se le han asignado en un sprint, estas tareas están vinculado a una Historia de Usuario, y esta Historia de Usuario está asociada a una Feature del producto.

Siguiendo todo este flujo tenemos claro que si cada vez que nosotros como desarrolladores cogemos una tarea y la damos por finalizada la podemos hacer asociando nuestros "commits" con el desarrollo que hemos realizado. ¿Cómo podemos hacer esto? Si estamos usando Azure DevOps se puede poner como requisito que para que se apruebe un Pull Request sea obligatorio que se asocie una tarea asociada. El poner esta opción activa o no puede ser fruto de controversia entre el equipo (a mí personalmente hay veces que me ha gustado y otras no). Pero motivos por los que no nos gusta esta opción pueden ser : tener que acordarte de la tarea, buscar el nombre de la misma (un poco de pérdida de tiempo), si la tarea esta completada no la puedes volver a seleccionar, que tu commit tenga código de más de una tarea o que por el contrario que no tengas la tarea que estás haciendo en tu board, todos estos motivos tienen un problema previo que no es otro que el encargado de llevar el Board, el contenido del Sprint no se está haciendo con el rigor que corresponde y supone que tenemos que mejorar algunos del procesos que estamos llevando a cabo (algo que no corresponde con la finalidad de dicho artículo).

El tema es que en algún momento tenemos que asociar la resolución de una tarea/bug que tenemos asignado con la historia de usuario, este es el punto de partida que se debe de realizar sí o sí. Si el desarrollador no lo hace ya no tiene sentido el buscar como automatizar este proceso.

¿Pero cómo lo podemos hacer y de una forma sencilla para el desarrollador? En primer lugar, para facilitar al desarrollador esta tarea se debe de seguir una convención para para llevar a cabo los "commits". La podéis consultar en la siguiente web https://www.conventionalcommits.org/en/v1.0.0/

Porque usar esta convención:

Poder generar changelog automáticos

Poder versionar el producto de una forma natural

Comunicación con naturalidad los cambios que se producen en el equipo de una forma transparente

En proyectos open source hace mucho más fáciles que otras personas se puedan unir al proyecto y sea mucho más fácil empezar a colaborar

Cuáles son los aspectos principales que dice esta convención pues en primer lugar en el mensaje del commit pongamos como palabra de inicio:

Feat: cuando vas a subir una feature

Refactor!: en el momento que vas a realizar un refactor de una solución

Docs: cuando se añade documentación

Fix: cuando se corrige un bug

Una vez, ya tenemos claro cuál es el objetivo que tenemos ahora vamos a ver una herramienta para poder automatizarlo en este caso Standard-Version https://github.com/conventional-changelog/standard-version

### Standar Version
Standar Version es una utilidad para hacer versionado usando semver, o versionado semántico en castellano, que nos da la generación de un Changelog de forma automática.

¿Como podemos automatizarlo? Vamos a explicar cuál es el flujo que debemos de hacer para poder tener el resultado esperado

1.-Obtiene toda la información del repositorio

2.- "bumb" la versión basada en los commits

3.- Genera un "Changelog" basado en nuestros commits

4.- Crea un nuevo commit incluyendo la nueva versión y actualiza el CHANGELOG

5.- Crea un nuevo "Tag" con el nuevo número de versión (opcional y dependiendo del sistema de branching que tenga el equipo, aunque siempre es bueno tener esto marcado para poder fixear errores en cada versión de una forma sencilla)

###  Manos a la obra

