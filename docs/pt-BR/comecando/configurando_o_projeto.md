# Configurando o projeto

O primeiro passo para utilizar o `azk` em qualquer projeto é criar um arquivo `Azkfile.js`. Este arquivo tem como função marcar o diretório root do seu projeto e principalmente definir a *arquitetura da aplicação*.

O `Azkfile.js` pode ser criado manualmente, mas para sua comodidade oferecemos o `azk init`, um gerador de `Azkfile.js` que ira fazer o trabalho pesado de descobrir como sua aplicação
esta projetada e sugerir um `Azkfile.js`.

```bash
$ cd [project-demo]
$ azk init

azk: A system of the 'node.js' type found in '[project-demo]'
azk: 'Azkfile.js' generated

Tip:
  Adds the '.azk' in '.gitignore'
  echo '.azk' >> .gitignore
```

Isso deve gerar o `Azkfile.js`:

```js
// Adds the systems that shape your system
systems({
  'project-demo': {
    // Dependent systems
    depends: [],
    // More images:  http://images.azk.io
    image: "dockerfile/nodejs",
    // Steps to execute before running instances
    provision: [
      "npm install",
    ],
    workdir: "/azk/#{manifest.dir}",
    command: "node index.js",
    mounts: {
      '/azk/#{manifest.dir}': path("."),
    },
    scalable: {"default": 2},
    http: {
      // node-example.
      domains: [ "#{system.name}.#{azk.default_domain}" ]
    },
    envs: {
      // set instances variables
      NODE_ENV: "dev",
    },
  },
});
```

Na sessões [Azkfile.js](../azkfilejs/README.md) você encontra informações detalhadas sobre como construir um `Azkfile.js` e quais opções estão disponíveis. Por hora temos o suficiente para executar nossa aplicação.
