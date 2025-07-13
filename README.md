## Usage

In Nightscout, create a subject with the `api:treatments:create`
permission.  We'll use the subject's access token below.

First, set some environment variables:

```
$ export GLOOKO_EMAIL=alice@example.com
$ export GLOOKO_PASSWORD=alligator3
$ export NIGHTSCOUT_HOST=nightscout.example.com
```

To use the access token, we'll need to take the SHA-1 hash of it:

```
$ export NIGHTSCOUT_API_SECRET=$(
    echo 'foobarbazz-a12bc34567de8901' |
    tr -d \\n |
    sha1sum |
    cut -d ' ' -f 1
  )
```

Then, run the main method:

```
$ node src/index.js
Done!
```
