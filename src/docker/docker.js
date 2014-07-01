import { Q, pp, config, path, _, log } from 'azk';
import Utils from 'azk/utils';
import { parseRepositoryTag } from 'dockerode/lib/util';

var uuid = require('node-uuid');

// Composer
import { pull } from 'azk/docker/pull';
import { run  } from 'azk/docker/run';

export class Image extends Utils.qify('dockerode/lib/image') {
  static parseRepositoryTag(...args) {
    return parseRepositoryTag(...args);
  }
}

export class Container extends Utils.qify('dockerode/lib/container') {
  static generateName(ns) {
    var id = uuid.v1().replace(/-/g, "").slice(0, 10);
    return `${config('docker:namespace')}-${ns}-id.${id}`;
  }

  get Id() {
    return this.id;
  }

  inspect(...args) {
    return super(...args).then((data) => {
      data.Annotations = Container.convertNameToAnnotations(data.Name);
      return data;
    });
  }

  static parseStatus(status) {
    var state = {
      ExitCode: 0,
      Paused:  (status.match(/^Up.*\(Paused\)$/)) ? true : false,
      Running: (status.match(/^Up/)) ? true : false
    }

    // Exited? Get return code
    if (status.match(/Exited/)) {
      state.ExitCode = parseInt(
        status.replace(/Exited \((.*)\).*/, "$1")
      );
    }

    return state;
  }

  static convertNameToAnnotations(name) {
    name = name.replace(/\/(.*)/, "$1");
    var data = name.split('-');
    return _.reduce(data, (annotations, values) => {
      var key_value = values.split(".");
      annotations.azk[key_value[0]] = key_value[1];
      return annotations;
    }, { azk: {} });
  }
}

export class Docker extends Utils.qify('dockerode') {
  constructor(opts) {
    log.info("Connect %s:%s", opts.host, opts.port);
    super(opts);

    this.c_regex = RegExp(`\/${Utils.escapeRegExp(config('docker:namespace'))}`);
  }

  getImage(name) {
    return new Image(this.modem, name);
  }

  getContainer(id) {
    return new Container(this.modem, id);
  }

  __findObj(obj) {
    return obj.inspect().then(
      (_data) => { return obj; },
      (err  ) => {
        if (err.statusCode == 404)
          return null;
        throw err;
      }
    );
  }

  azkListContainers(...args) {
    return this.listContainers(...args).then((containers) => {
      return _.reduce(containers, (result, container) => {
        if (container.Names[0].match(this.c_regex)) {
          container.Name = container.Names[0];
          container.Annotations = Container.convertNameToAnnotations(container.Name);
          container.State = Container.parseStatus(container.Status);
          result.push(container);
        }
        return result;
      }, []);
    });
  }

  findImage(name) {
    return this.__findObj(this.getImage(name));
  }

  findContainer(id) {
    return this.__findObj(this.getContainer(id));
  }

  pull(...args) {
    return pull(this, ...args);
  }

  run(...args) {
    return run(this, Container, ...args);
  }

  // TODO: Add test
  resolvePath(target) {
    target = Utils.resolve(target);
    if (config('agent:requires_vm')) {
      target = path.join(config('agent:vm:mount_point'), target);
    }

    return target;
  }
}
