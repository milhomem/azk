# Mac OS X

**Aviso**: Se você você já tem o `azk` nas versões antetiores ao `0.6.0` instalado, siga [esses passos](upgrading.md) antes de continuar.

## Requisitos

* [VirtualBox][virtualbox_dl], version 4.3.6+ (VMware: planned)

## Instalando o virtualbox

A instalação do VirtualBox pode ser feita acessando a [página][virtualbox_dl] e seguindo as instruções de instalação. Porém se você estiver usando [Homebrew Cask][homebrew_cask], se tornar ainda mais fácil! Basta abrir o console e digitar:

```sh
$ brew cask install virtualbox --appdir=/Applications
```

## Install o azk

Após instalar o VirtualBox abra o console e digite:

```bash
$ brew install azukiapp/azk/azk
```

## Atualizando o azk

Se você já instalou o `azk` através do brew em uma versão antetior, basta rodar os seq

```bash
$ brew upgrade azk
```

!INCLUDE "../comecando/banner.md"
!INCLUDE "../links.md"
