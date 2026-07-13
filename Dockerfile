# ==============================================================================
# Dockerfile — عهد (Ahd) server, containerized (T5, deploy story).
#
# ZERO external dependencies: this project uses ONLY Node built-ins (http, fs,
# path, crypto) — there is no package.json and no `npm install` step anywhere
# in this build. COPY brings in the whole repo (server/, app/, demo/,
# protocol/) verbatim; nothing to compile, nothing to fetch.
#
# HONESTY (see README.md "Deploy" section — read it before relying on this
# file): this makes the existing zero-dependency server (server/http.cjs)
# runnable inside a container on your own machine/VM. It is
# LOCALHOST-HARDENED, NOT a cloud deployment. Real cloud infra (managed
# hosting, TLS termination, autoscaling, KSA data-residency) is a separate,
# not-yet-built step — see docs/evidence/PATH-TO-PRODUCTION.md. This Dockerfile has
# NOT been build-tested in this environment (no `docker` binary available
# here) — verify with `docker build .` before relying on it; it is written to
# the same conventions the project's own zero-dep Node process already uses.
#
# Pinned base (not a moving `:latest`/`:lts` tag) — reproducible builds.
# ==============================================================================
FROM node:20.11.1-alpine

WORKDIR /app

# No `npm install`: this project has zero runtime dependencies (Node
# built-ins only — http, fs, path, crypto). Copying the source IS the build.
COPY . .

# server/http.cjs binds 127.0.0.1 ONLY, by deliberate design (see that file's
# header: "never binds 0.0.0.0") — a localhost-only security posture, not an
# oversight. Inside a container this means the server is reachable from
# WITHIN the container's own network namespace (e.g. `docker exec ... node
# server/smoke-live.cjs`, or the HEALTHCHECK below) but NOT automatically from
# outside via a published port (`-p 8225:8225`) the way an 0.0.0.0-bound
# server would be — Docker's port-publishing proxies to the container's
# external interface, not its loopback. On Linux, `docker run --network host`
# shares the host's network namespace, so the container's 127.0.0.1 IS the
# host's 127.0.0.1 and the port becomes reachable that way. Making the live
# process bind a configurable, non-loopback host is a real, NOT-YET-DONE
# change (flagged honestly here and in README.md, not silently worked around).
EXPOSE 8225

# GET /health (added T5, server/handlers.cjs) returns a static, deterministic
# { ok: true } — no auth required, no wall-clock timestamp/uptime. Runs INSIDE
# the container's own namespace, so the loopback-only bind above is no
# obstacle here.
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD node -e "require('http').get({host:'127.0.0.1',port:8225,path:'/health'},r=>process.exit(r.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server/http.cjs"]
