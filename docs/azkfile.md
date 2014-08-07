# Azkfile.js

## Basic example

```language-javascript
system({
  docs: {
    scalable: { default: 1 },
    http: {
      hostname: "#{system.name}.#{azk.default_domain}",
    }
  }
});
```
