# Linux

**Aviso**: Se você você já tem o `azk` nas versões anteriores ao `0.6.0` instalado, siga [estes passos](upgrading.md#atualizando-a-partir-azk--051) antes de continuar. Se você não tem o `azk` instalado ignorar este aviso e continue a instalação normalmente.

## Requisitos

* Distribuições (testadas): Ubuntu 12.04/14.04 e Fedora20
* [Docker][docker] 1.2.0
* Não esta rodando nenhum serviços nas portas `80` e `53`

**Importante**: Se você estiver rodando algum serviço nas portas `80` e/ou `53` você deve customisar a configuração do `azk` definindo a seguintes variáveis `AZK_BALANCER_PORT` e `AZK_DNS_PORT` respectivamente, antes de executar `azk agent start`. 

## Ubuntu Trusty 14.04 (LTS) (64-bit)

1. Instale o Docker:

  - [instale **a versão 1.2 do Docker**][docker_ubuntu_14_04]
  - configure para que seu usuário [tenha acesso ao Docker][docker_root_access];
  - [desabite o uso de dnsmasq][docker_ubuntu_dns];
  - **tenha certeza de que o serviço do Docker esta rodando**;

2. Adicionando as chaves do Azuki ao seu keychain local:

  ```bash
  $ sudo apt-key adv --keyserver keys.gnupg.net \
    --recv-keys 022856F6D78159DF43B487D5C82CF0628592D2C9
  ```

3. Adicione o repositório do Azuki a lista de sources do apt:

  ```bash
  $ echo "deb [arch=amd64] http://repo.azukiapp.com trusty main" | \
    sudo tee /etc/apt/sources.list.d/azuki.list
  ```

4. Atualiza a lista de pacotes e instale o azk:

  ```bash
  $ sudo apt-get update
  $ sudo apt-get install azk
  ```

## Ubuntu Precise 12.04 (LTS) (64-bit)

1. Instale o Docker:

  - [instale **a versão 1.2 do Docker**][docker_ubuntu_12_04]
  - configure para que seu usuário [tenha acesso ao Docker][docker_root_access];
  - **tenha certeza de que o serviço do Docker esta rodando**;
  
2. Adicionando as chaves do Azuki ao seu keychain local:

  ```bash
  $ sudo apt-key adv --keyserver keys.gnupg.net \
    --recv-keys 022856F6D78159DF43B487D5C82CF0628592D2C9
  ```

3. Adicione o repositório do Azuki a lista de sources do apt:

  ```bash
  $ echo "deb [arch=amd64] http://repo.azukiapp.com precise main" | \
    sudo tee /etc/apt/sources.list.d/azuki.list
  ```

4. Atualiza a lista de pacotes e instale o azk:

  ```bash
  $ sudo apt-get update
  $ sudo apt-get install azk
  ```

## Fedora 20

1. Adicionando as chaves do Azuki ao seu keychain local:

  ```bash
  $ rpm --import \
    'http://repo.azukiapp.com/keys/azuki.asc'
  ```

2. Adicione o repositório do Azuki:

  ```bash
  $ echo "[azuki]
  name=azk
  baseurl=http://repo.azukiapp.com/fedora20
  enabled=1
  gpgcheck=1
  " > /etc/yum.repos.d/azuki.repo
  ```

3. Instale o `azk` e suas dependências:

  ```bash
  $ sudo yum install azk
  ```

4. Antes de executar o `azk agent`:

  - configure para que seu usuário [tenha acesso ao Docker][docker_root_access];
  - **tenha certeza de que o serviço do Docker esta rodando**;

## Outras distribuições

Em breve...

!INCLUDE "../getting-started/banner.md"
!INCLUDE "../../links.md"

