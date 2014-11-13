# Levantando o agent

O `azk agent` é o **serviço principal** do `azk`. Detalhes de suas atribuições e funcionalidades podem ser consultadas [aqui](../agent/README.md). Por hora é importante saber que sua execução é necessária para a maior parte das tarefas do `azk`.

Para garantir que o `azk agent` **esteja em execução**, você deve executar o seguinte comando em um **console**:

```bash
$ azk agent start
```

A saída deve variar conforme a plataforma (Linux ou Mac). Mas no geral deve se esperar pela mensagem **"Agent has been successfully started"**, para só então dar continuidade neste guia.

Um exemplo de saída para o comando:

```bash
azk: Wait, this process may take several minutes
azk: Loading settings and checking dependencies.
azk: Checking version...
azk: Settings loaded successfully.
...
azk: Memcached service started.
azk: Starting http balancer service...
azk: Http balancer service started.
azk: Agent has been successfully started.
```

