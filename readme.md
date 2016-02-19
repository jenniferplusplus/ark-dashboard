# Ark Server Dashboard

This is a project I'm creating for myself. It may be useful to you though and you're welcome to it.

All it does is provide a web interface to allow some *extremely* basic monitoring and control of an Ark: Survival Evolved
dedicated server. It makes a lot of assumptions, for instance that your game server is set up as an Ubuntu system service
and that the system service handles all of the scheduling, patching, and saving logic.

This should be relatively easy to extend to other game servers that respond to the steam server protocol, as well as other
types of system services (even Windows).

I doubt I'll do that though.

## Installation

You'll need Node.js and NPM installed in your path. If you're on *nix, then they should be available from your package manager.
On Windows, you can download them from [the node.js website](https://nodejs.org/)
If you already have node installed that's great, any halfway recent version will do. I did the development on v0.10, and I know of nothing that wouldn't be forward compatible from there.

Then
`git clone (this repo)`
`npm install`

## Configuration

Fill out the fields in `config.json`

* `svcName`: The name of the system service that controls the Ark server.
* `address`: This is the url that your ark server can be reached at. For now, there's no way to run this app on a different server, so it can stay as 'localhost'.
* `passphrase`: This is the password or phrase (it can contain spaces) that you will need to use when restarting the server. Share this with anyone you want to be able to do that.
* `passkey`: This is a secret key that you should not share with anyone. It is used to generate session keys which are used for digest style password authentication.
* `hashAlgorithm`: This determines the hashing algorithm used to secure passwords. A future enhancement may add more options, but 'sha1' is the only valid choice for now.
* `basePath`: This is the base url that the app will be served from.
    * If the app is running as a standalone webserver at the root of its own domain or subdomain, then just leave this blank.
        * Ex. yourgameserver.com or ark.yourgameserver.com
    * If the app is running under some path on a shared domain, this should be that path, with a leading slash ('/ark' vs 'ark').
        * Ex. yourgameserver.com/ark
* `title`: The title you want to give the page.

## Running

`node bin/www`

## Using a proper web server

This app is built on express.js, which is great for me, but not exactly a paragon of stability, security, or performance.
You should serve all of the content from a good webserver and just leave the express to handle the services.

First, you need to generate a static index.html for your webserver to serve up. Do this after you have filled out the config file.

`npm run static`

Then set up your webserver. I use Nginx, so that's what I have samples for. It's pretty easy to convert to apache or whatever else.

## Sample Nginx config for path (http://yourgameserver.com/ark)

This config is terrible and you should read up on how to configure Nginx. But it demonstrates what options you'll need.

```
server {
    listen 80;
    server_name yourgameserver.com
    location / {
        # Seriously, read up on how to do this.
    }
    location /ark {
        index               /ark/public;
    }
    location /ark/public {
        root                path/to/app/public;
        index               index.html;
        try_files           $uri $uri.html $uri/ =404;
    }
    location /ark/* {
        proxy_pass          http://127.0.0.1:3000/;
        proxy_set_header    X-Real-IP  $remote_addr;
        proxy_redirect off;
    }
}
```

## Sample Nginx config for subdomain (http://ark.yourgameserver.com)

This config is also terrible.

```
server {
    listen 80;
    server_name ark.yourgameserver.com
    location / {
        index               /ark/public;
    }
    location /public {
        root                path/to/app/public;
        index               index.html;
        try_files           $uri $uri.html $uri/ =404;
    }
    location /* {
        proxy_pass          http://127.0.0.1:3000/;
        proxy_set_header    X-Real-IP  $remote_addr;
        proxy_redirect off;
    }
}
```
