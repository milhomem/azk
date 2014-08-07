/**
 * Documentation: http://docs.azk.io/Azkfile.js
 */

// Global image to reuse
//addImage('base', { repository: "cevich/empty_base_image" }); // tag: latest

var config = require('azk').config;

systems({

  grunt: {
    image: "dockerfile/nodejs",
    workdir: "/azk/<%= manifest.dir %>",
    mount_folders: {
      ".": "/azk/<%= manifest.dir %>",
    },
    envs: {
      PATH: "/bin:/sbin:/usr/bin:/usr/sbin:/usr/local/bin:/azk/<%= manifest.dir %>/node_modules/.bin"
    }
  },

  docs: {
    // Dependent systems
    depends: [],
    provision: [
      "virtualenv /azk/pyenv",
      //"./bin/inve pip install mkdocs",
      //"./bin/inve pip install --no-use-wheel CherryPy",
      //"./bin/inve pip install sphinx_rtd_theme",
    ],
    // More images:  http://images.azk.io
    image: "dockerfile/python",
    workdir: "/azk/#{manifest.dir}",
    shell: "/bin/bash",
    command: "./docs/bin/inve mkdocs serve --dev-addr=0.0.0.0:$HTTP_PORT",
    // Mounts folders to assigned paths
    mount_folders: {
      './': "/azk/#{manifest.dir}",
    },
    scalable: { default: 1 },
    http: {
      hostname: "#{system.name}.azk.#{azk.default_domain}",
    },
    ports: {
      http: "8080/tcp"
    },
    persistent_folders: [ "/azk/pyenv" ],
    envs: {
      TERM: "xterm-256color",
    }
  },

  dns: {
    image: config("docker:image_default"),
    command: "dnsmasq --no-daemon --address=/<%= azk.default_domain %>/<%= azk.balancer_ip %>",
    ports: {
      dns: "53:53/udp",
    }
  },

  'balancer-redirect': {
    image: config("docker:image_default"),
    command: "socat TCP4-LISTEN:$HTTP_PORT,fork TCP:$BALANCER_IP:$BALANCER_PORT",
    ports: {
      http: "80:<%= azk.balancer_port %>/tcp",
    }
  },
});

setDefault('docs');
