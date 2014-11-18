# Persistindo informações

Se você [configurou um banco de dados](database.md), verá que vários refresh na página [http://azkdemo.azk.dev](http://azkdemo.azk.dev), fazem com que nosso contador de acessos seja incrementado. Porém se você fizer um restart:

```bash
$ azk restart redis
```

Acessando [http://azkdemo.azk.dev](http://azkdemo.azk.dev) você pode verificar que o contador de acessos foi reiniciado.
Isso acontece porque o banco de dados não sabe onde persistir a informação sobre os acessos.

## Volume persistente

Para adicionarmos persistência ao banco de dados precisamos editar o `Azkfile.js` adicionando as entradas `command` e `mounts` ao sistemas `redis` conforme o exemplo:

```js
systems({
  azkdemo: {
    // ...
  },
  redis: {
    image: "redis",
    // adicione
    command: "redis-server --appendonly yes",
    mounts: {
      "/data": persistent("data"),
    },
    export_envs: {
      "DATABASE_URL": "redis://#{net.host}:#{net.port[6379]}"
    }
  }
});
```

Com esta alteração estamos instruindo o `azk` para que monte a pasta `/data`, sempre para apontando para a mesma pasta dentro da estrutura do `azk`. Faça alguns refresh na página e reinicie o redis e vera que a contagem agora persiste entre cada restart.

**Observação:** Nem sempre os bancos de dados usam a mesma pasta `/data` para persistir os dados, isso deve ser configurado conforme a necessidade de cada banco de dados. Mais informações aqui.

