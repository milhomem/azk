# Mapeando os arquivos

Se observamos o `Azkfile.js` gerado é possível notar uma entrada no sistemas `azkdemo` chamada `mounts`:

```js
systems({
  azkdemo: {
    // ...
    command: "node index.js",
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: {"default": 2},
    // ..
  },
});
```

Esta entrada basicamente orienta o `azk` sobre quais arquivos locais devem estar disponíveis para sua aplicação no ambiente isolado onde ela ira rodar. No caso a pasta atual, ou seja pasta `azkdemo` vai estar disponível no path `/azk/azkdemo` dentro do ambiente isolado.

Se acessarmos o shell do sistema `azkdemo` é possível listar os arquivos da pasta `azkdemo` conforme o esperado:

```bash
$ azk shell azkdemo
[ root@3848e1df91cf:/azk/azkdemo ]$ ls -l
total 16
-rw-r--r-- 1 root root  814 Nov 17 20:14 Azkfile.js
-rw-r--r-- 1 root root 2822 Nov 17 18:42 README.md
-rw-r--r-- 1 root root 1477 Nov 17 20:20 index.js
drwxr-xr-x 6 root root  204 Nov 17 20:08 node_modules
-rw-r--r-- 1 root root  282 Nov 17 18:42 package.json
drwxr-xr-x 3 root root  102 Nov 17 18:42 public
```

Observe que ao chamar o `azk shell` você foi enviado a pasta `/azk/azkdemo`, esse path corresponde a entrada `workdir` do Azkfile.js, que tem o valor: `/azk/#{system.name}`.

Este `#{system.name}` nada mais é do que uma notação que permite saber o nome de um sistemas quando se esta declarando as opções desse mesmo sistemas. No exemplo o valor é expandido para `azkdemo`.

