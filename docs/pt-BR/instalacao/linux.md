# Linux

**Aviso**: Se você você já tem o `azk` nas versões anteriores ao `0.6.0` instalado, siga [esses passos](upgrading.md#atualizando-a-partir-azk--051) antes de continuar. Se você não tem o `azk` instalado ignorar este aviso e continuar a instalação normalmente.

## Requisitos

* Distribution (tested): Ubuntu 12.04/14.04 and Fedora20
* [Docker][docker] 1.1.0 or greater
* Not running any service in `80` and `53` ports

**Importante**: If you are running a service on ports `80` or/and `53` you can customize the configuration by setting the environment variable `AZK_BALANCER_PORT` and `AZK_DNS_PORT` respectively before run `azk agent start`.

## Ubuntu Trusty 14.04 (LTS) (64-bit)

1. Install docker

  - [install **latest version of Docker**][docker_ubuntu_14_04]
  - check if docker service is running;
  - configure your user [giving non root access][docker_root_access];
  - [fix dns service][docker_ubuntu_dns];

2. Then, add the Azuki repository key to your local keychain.

  ```bash
  $ sudo apt-key adv --keyserver keys.gnupg.net \
    --recv-keys 022856F6D78159DF43B487D5C82CF0628592D2C9
  ```

3. Add the Azuki repository to your apt sources list:

  ```bash
  $ echo "deb [arch=amd64] http://repo.azukiapp.com trusty main" | \
    sudo tee /etc/apt/sources.list.d/azuki.list
  ```

4. Update and install the `azk` and dependencies packages:

  ```bash
  $ sudo apt-get update
  $ sudo apt-get install azk
  ```

## Ubuntu Precise 12.04 (LTS) (64-bit)

1. Install docker

  - [install **latest version of Docker**][docker_ubuntu_12_04]
  - check if docker service is running;
  - [giving non root access][docker_root_access] for yours user;


2. Then, add the Azuki repository key to your local keychain.

  ```bash
  $ sudo apt-key adv --keyserver keys.gnupg.net \
    --recv-keys 022856F6D78159DF43B487D5C82CF0628592D2C9
  ```

3. Add the Azuki repository to your apt sources list:

  ```bash
  $ echo "deb [arch=amd64] http://repo.azukiapp.com precise main" | \
    sudo tee /etc/apt/sources.list.d/azuki.list
  ```

4. Update and install the `azk` and dependencies packages:

  ```bash
  $ sudo apt-get update
  $ sudo apt-get install azk
  ```

## Fedora 20

1. Then, add the Azuki repository key to your local keychain.

  ```bash
  $ rpm --import \
    'http://repo.azukiapp.com/keys/azuki.asc'
  ```

2. Add the Azuki repository to your apt sources list:

  ```bash
  $ echo "[azuki]
  name=azk
  baseurl=http://repo.azukiapp.com/fedora20
  enabled=1
  gpgcheck=1
  " > /etc/yum.repos.d/azuki.repo
  ```

3. Install the `azk` and dependencies packages:

  ```bash
  $ sudo yum install azk
  ```

4. Before run `azk agent`:

  - check if docker service is running;
  - [giving non root access][docker_root_access] for yours user;

## Other distributions - installation from source

1. Install docker

  - [install **latest version of Docker**][docker_install]
  - check if docker service is running;
  - [giving non root access][docker_root_access] for yours user;

2. Install [libnss-resolver][libnss-resolver] dependency;

3. Clone `azk` into `~/.azk`.

  ```bash
  $ git clone https://github.com/azukiapp/azk.git ~/.azk
  $ cd ~/.azk
  $ make
  ```

4. Add `~/.azk/bin` to your $PATH for access to the `azk` command-line utility.

  ```bash
  $ echo 'export PATH="$HOME/.azk/bin:$PATH"' >> ~/.bash_profile
  # and reload
  $ source ~/.bash_profile
  ```

  **Linux/bash note**: Modify your `~/.bashrc` instead of `~/.bash_profile`.

  **Zsh note**: Modify your `~/.zshrc` file instead of `~/.bash_profile`.

5. Run `azk agent` in a terminal:

  ```bash
  $ azk agent start
  ```

!INCLUDE "../comecando/banner.md"
!INCLUDE "../../links.md"
