import { _, envs } from 'azk/utils';
var path    = require('path');
var dnsSync = require('dns-sync');
var os      = require('os');

// Root path
var azk_root  = envs('AZK_ROOT_PATH', path.join('..', '..'));
var data_path = envs('AZK_DATA_PATH', path.join(envs('HOME'), '.azk', 'data'));

// Use virtual machine
var requires_vm = (envs('AZK_USE_VM') == "true");

// Vm informations
// TODO: Show erro if not resolve ip
var vm_name = envs('AZK_AGENT_VM_NAME', "azk-agent");
var vm_ip   = envs('AZK_AGENT_VM_IP', dnsSync.resolve(vm_name));

// Balancer configuration
var balancer = {
    ip: envs('AZK_BALANCER_IP', vm_ip),
  host: envs('AZK_BALANCER_HOST'),
  port: envs('AZK_BALANCER_PORT', 80),
  file_dns: "/etc/resolver/" + envs('AZK_BALANCER_HOST'),
};

// Docker opts
var docker_host = envs(
  'AZK_DOCKER_HOST',
  (requires_vm ? "http://" + vm_ip + ":2375" : "unix:///var/run/docker.sock")
);

// Log level
var log_level = envs('AZK_DEBUG') ? 'debug' : 'warn';

function merge(options) {
  _.each(options, (values, key) => {
    if (key != '*')
      options[key] = _.merge({}, options['*'], values);
  });
  return options;
}

var persistent_folders = requires_vm ?
  '/mnt/sda1/azk/persistent_folders' :
  path.join(data_path, 'persistent_folders');

var options = merge({
  '*': {
    manifest: "Azkfile.js",
    locale  : 'en-US',
    azk_dir : ".azk",
    flags   : {
      show_deprecate: true,
    },
    paths   : {
      azk_root,
      data  : data_path,
      logs  : path.join(data_path, 'logs'),
      log   : path.join(data_path, 'logs', 'azk.log'),

      persistent_folders: persistent_folders,

      agent_pid: path.join(data_path, 'run', 'agent.pid'),
      unfsd_pid: path.join(data_path, 'run', 'unfsd.pid'),
      memcached_pid: path.join(data_path, 'run', 'memcachedjs.pid'),
      hipache_pid: path.join(data_path, 'run', 'hipache.pid'),

      agent_socket : path.join(data_path, 'run', 'agent.socket'),
      memcached_socket : path.join(data_path, 'run', 'memcachedjs.socket'),
      unfsd_file   : path.join(data_path, 'run', 'exports'),
      balancer_file: path.join(data_path, 'run', 'hipache.json'),

      unfsd: envs('AZK_UNFSD_PATH'),
    },
    logs_level: {
      console: (envs('AZK_DEBUG') ? 'debug' : 'warn'),
      file: envs('AZK_LOG_LEVEL', 'info'),
    },
    docker: {
      host          : docker_host,
      namespace     : envs('AZK_DOCKER_NS'),
      repository    : 'azk',
      default_domain: 'azk',
      image_default : 'azukiapp/azktcl:0.0.2',
      run: {
        timeout: 1000,
        retry: 10,
      }
    },
    agent: {
      requires_vm: requires_vm,
      portrange_start: 11000,
      balancer,
      dns: {
        ip         : vm_ip,
      },
      vm: {
        ip         : vm_ip,
        name       : vm_name,
        user       : "docker",
        password   : "tcuser",
        cpus       : envs('AZK_VM_CPUS', os.cpus().length),
        memory     : envs('AZK_VM_MEMORY', Math.floor(os.totalmem()/1024/1024/4)),
        ssh_key    : envs('AZK_AGENT_VM_KEY'),
        boot_disk  : envs('AZK_BOOT_FILE'),
        data_disk  : path.join(data_path, "vm", "azk-agent.vmdk"),
        blank_disk : path.join(data_path, "vm", "azk-agent.vmdk.bz"),
        mount_point: '/home/docker/files',
        authorized_key: '/home/docker/.ssh/authorized_keys',
      }
    }
  },
  test: {
    paths: {
      log: path.join(data_path, 'logs', 'azk_test.log'),
    },
    docker: {
      namespace   : 'azk.test',
      repository  : 'azk-test',
      image_empty : 'cevich/empty_base_image',
    },
    agent: {
      portrange_start: 12000,
      vm: {
        data_disk : path.join(data_path, "vm", "azk-agent-spec.vmdk"),
      }
    }
  }
});

function env() {
  return envs('NODE_ENV', 'production');
}

export function get(key) {
  if (key == "env") return env();

  var keys   = key.split(':');
  var buffer = options[env()] || options['*'];

  for(var i = 0; i < keys.length; i++) {
    buffer = buffer[keys[i]];
    if (!buffer) break;
  }

  return buffer;
};

export function set(key, value) {
  if (key == "env") {
    process.env.NODE_ENV = value;
  } else {
    var keys   = [env(), ...key.split(':')];
    var buffer = { [keys.pop()]: value };
    while(key  = keys.pop()) { buffer = { [key]: buffer } };

    // Check env exist
    if (!options[env()]) {
      options[env()] = _.cloneDeep(options['*']);
    }

    _.merge(options, buffer);
  }
  return value;
}

