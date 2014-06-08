import { Q, fs, config, log, defer } from 'azk';
import { net } from 'azk/utils';
import { VM  } from 'azk/agent/vm';
import { Tools } from 'azk/agent/tools';
var forever = require('forever-monitor');

var Unfsd = {
  child: null,
  port : null,
  ip   : null,

  start() {
    return Tools.async_status("unsfd", this, function* (change_status) {
      if (this.isRunnig()) return;

      var port = this.port = yield net.getPort();
      var file = this.__checkConfig();
      var args = [
        config("paths:unfsd"),
        "-s", "-d", "-p", "-t",
        "-n", port,
        "-m", port,
        "-e", file
      ]

      return defer((resolve, reject) => {
        change_status("starting");
        this.child = forever.start(args, {
          max : 5,
          silent : true,
          pidFile: config("paths:unfsd_pid")
        });

        this.child.on('start', () => {
          change_status("started", { port: port, file: file });
          resolve();
        });
      });
    });
  },

  stop() {
    return Tools.defer_status("unsfd", (resolve, _reject, change_status) => {
      log.debug("call to stop unsfd");
      if (this.child) {
        this.child.on('stop', () => {
          change_status("stoped");
          resolve();
        });
        change_status("stopping");
        this.child.stop();
      } else {
        resolve();
      }
    });
  },

  mount(vm_name) {
    return Tools.defer_status("unsfd", (_resolve, _reject, change_status) => {
      var point = config('agent:vm:mount_point');
      var ip    = net.calculateGatewayIp(config("agent:vm:ip"))
      var opts  = [
        `port=${this.port}`,
        `mountport=${this.port}`,
        'mountvers=3',
        'nfsvers=3',
        'nolock',
        'tcp',
      ]
      var mount = `sudo mount -o ${opts.join(',')} ${ip}:/ ${point}`
      var cmd = [
        `[ -d "${point}" ] || mkdir -p ${point}`,
        "[[ `mount` =~ " + point + " ]] || " + mount,
        "[[ `mount` =~ " + point + " ]]",
      ].join("; ");

      change_status("mounting");
      return VM.ssh(vm_name, cmd).then((code) => {
        if (code != 0)
          throw new Error('not mount share files');
        change_status("mounted");
      });
    });
  },

  isRunnig() {
    return (this.child && this.child.running);
  },

  __checkConfig() {
    var file = config('paths:unfsd_file');

    // set content
    fs.writeFileSync(file, [
      "# All",
      "/ " + net.calculateNetIp(config("agent:vm:ip")) + "(rw)"
    ].join("\n"));

    return file;
  }
}

export { Unfsd }
