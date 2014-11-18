# Persistindo informações

Se você [configurou um banco de dados](banco_de_dados) para nossa aplicação demo, verá que vários refresh na página [http://azkdemo.azk.dev](http://azkdemo.azk.dev), fazem com que nosso contador de acessos seja incrementado. Porém se você fizer um restart:

```bash
$ azk restart
```

Acessando [http://azkdemo.azk.dev](http://azkdemo.azk.dev) você pode verificar que o contador de acessos foi reiniciado para 1. Isso acontece porque nosso banco de dados não sabe onde persistir a informação sobre os acessos.

## Volume persistente

Para adicionarmos persistência ao nosso banco de dados precisamos editar o `Azkfile.js` e adicionar uma entrada `mounts` ao sistemas `redis` conforme o exemplo:

```js
systems({
  azkdemo: {
    // ...
  },
  redis: {
    image: "dockerfile/redis",
    // adicione
    mounts: {
      "/data": persistent("data"),
    },
    export_envs: {
      "DATABASE_URL": "redis://#{net.host}:#{net.port[6379]}"
    }
  }
});
```

Com essa pequena mudança estamos instruindo que a pasta `/data` dentro do ambiente onde o `redis` será executa deve sempre ser a mesma pasta. Com alguns restarts do `redis` pode se verificar o comportamento que esperávamos.

**Observação:** Nem sempre os bancos de dados usam a mesma pasta `/data` para persistir os dados, isso deve ser configurado conforme a necessidade de cada banco. Mais informações aqui.
