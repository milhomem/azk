# Atualizando a partir azk >= 0.6.0

## Mac OS X

```bash
$ azk agent stop
$ brew upgrade azukiapp/azk/azk
```

## Linux

Ubuntu:

```bash
$ azk agent stop
$ sudo apt-get update
$ sudo apt-get upgrade azk
```

Fedora:

```bash
$ azk agent stop
$ sudo yum upgrade azk
```

# Atualizando a partir azk <= 0.5.1

Until recently, version `0.6.0` was still an alpha version, but now it has reached a maturity level that makes it a beta version (now it can be installed and updated by installation packages).

For those who have tested it before (pior to this beta version), please perform the following procedures before installing the new version:

1. **Warning:** `azk 0.6.0` is NOT backward compatible with prior versions, therefore your persistent folders like dependencies or databases will be deleted. To perform a backup:

  ```bash
  $ azk agent stop
  $ cp -Rf ~/.azk/data [path_to_backup]
  ```

2. For projects in which you were already using `azk`, it is required to update azkfile.js, replacing `mounts_folders` and `persistent_folders` for mounts, according to the following example:

  Where used to be:

    ```javascript
    systems({
      example: {
        // ...
        mounts_folders: { ".": "/azk/#{system.name}" },
        persistent_folders: [ "/data" ],
      }
    });
    ```

  It should be replaced by (note the inversion of the values of `mounts_folders`):

    ```javascript
    systems({
      example: {
        // ...
        mounts: {
          "/azk/#{system.name}": path("."),
          "/data": persistent("data"),
        },
      }
    });
    ```

3. Next time you execute the start command in one of these projects, it must be done this way:

  ```bash
  $ azk start --reprovision
  ```

4. Finally, you can remove an old `azk` installation:

  ```bash
  $ azk agent stop
  $ azk vm remove # mac only
  $ rm -Rf ~/.azk
  $ sudo rm /etc/resolver/azk.dev
  # and remove `~/.azk/bin` from your `$PATH`
  ```

5. Now you are able to install new `azk` version.

  * [Linux](linux.md#requisitos)
  * [Mac OS X](mac_os_x.md#requisitos)

!INCLUDE "../../links.md"
