/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Global image to reuse
//addImage('base', { repository: "cevich/empty_base_image" }); // tag: latest

var path   = require('path');
var fs     = require('fs');
var glob   = require('glob');
var config = require('azk').config;
var _      = require('lodash');

var mounts = {
  "/.tmux.conf" : path.join(env.HOME, ".tmux.conf"),
  "/azk/demos"  : "../demos",
  "/azk/lib"    : persistent('lib'),
  "/azk/#{manifest.dir}/node_modules": persistent('node_modules'),
  "/azk/data"      : persistent('data'),
  "/var/lib/docker": persistent('docker_files'),
}

var itens = glob.sync("./!(lib|data|node_modules|npm-debug.log)");
mounts = _.reduce(itens, function(mount, item) {
  var key = path.join("/azk", "#{manifest.dir}", item);
  mount[key] = item;
  return mount;
}, mounts);

var agent_system = function(image) {
  return {
    image: image,
    provision: [
      "azk check-install",
    ],
    scale: false,
    workdir: "/azk/#{manifest.dir}",
    shell: "/usr/local/bin/wrapdocker",
    mounts: mounts,
    envs: {
      PATH: "/azk/#{manifest.dir}/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin",
      AZK_DATA_PATH: "/azk/data",
      AZK_LIB_PATH : "/azk/lib",
      AZK_BALANCER_HOST: "azk.linux",
      AZK_DOCKER_NS    : "azk.linux",
      AZK_BALANCER_PORT: 8080,
      //EXTRA_ARGS       : "-H tcp://0.0.0.0:2375 -H unix://",
      LOG: "file",
      NODE_ENV: "test",
      EXTRA_SCRIPT: "/azk/#{manifest.dir}/src/share/init_azk",
    },
    docker_extra: {
      start: { Privileged: true },
    }
  };
}

systems({

  'dind-ubuntu': agent_system('azukiapp/dind:ubuntu14'),
  'dind-fedora': agent_system('azukiapp/dind:fedora20'),

  grunt: {
    image: "dockerfile/nodejs",
    workdir: "/azk/#{manifest.dir}",
    mounts: {
      "/azk/#{manifest.dir}": ".",
    },
    envs: {
      PATH: "/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/azk/#{manifest.dir}/node_modules/.bin"
    }
  },

  docs: {
    // Dependent systems
    depends: [],
    provision: [
      "virtualenv /azk/pyenv",
      "./docs/bin/inve pip install mkdocs",
      //"./bin/inve pip install --no-use-wheel CherryPy",
      //"./bin/inve pip install sphinx_rtd_theme",
    ],
    // More images:  http://images.azk.io
    image: "dockerfile/python",
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "./docs/bin/inve mkdocs serve --dev-addr=0.0.0.0:$HTTP_PORT",
    // Mounts folders to assigned paths
    mounts: {
      "/azk/#{manifest.dir}": ".",
      "/azk/pyenv": persistent('pyenv'),
    },
    scalable: { default: 1 },
    http: {
      hostname: "#{system.name}.azk.#{azk.default_domain}",
    },
    ports: {
      http: "8080/tcp"
    },
    envs: {
      TERM: "xterm-256color",
    }
  },

  dns: {
    image: config("docker:image_default"),
    shell: '/bin/bash',
    command: "dnsmasq -p $DNS_PORT --no-daemon --address=/#{azk.default_domain}/#{azk.balancer_ip}",
    wait: false,
    ports: {
      dns: "53:53/udp",
      80: disable,
    }
  },

  'balancer-redirect': {
    image: config("docker:image_default"),
    shell: '/bin/bash',
    command: "env; socat TCP4-LISTEN:$HTTP_PORT,fork TCP:$BALANCER_IP:$BALANCER_PORT",
    ports: {
      http: "#{azk.balancer_port}:#{azk.balancer_port}/tcp",
      53: disable,
    }
  },
});

setDefault('docs');
