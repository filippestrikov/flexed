# Jenkins for FLEXED

This local Docker setup creates an authenticated Jenkins server at
http://localhost:8080/ and a `flexed-playwright` pipeline job. The first build
starts automatically. It runs Chromium with Node.js 22 and Playwright 1.55.1.
Jenkins data and build history persist in the `flexed-ci_jenkins-home` volume.
The runtime combines the official Jenkins Java 21 distribution with Playwright's
version-matched Ubuntu image, which already contains the browsers and their
system dependencies.

## Start

Start Docker Desktop using Linux containers, then run from the project folder:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File scripts/start-jenkins.ps1
```

Sign in as `admin`. The generated password is stored locally in the Git-ignored
`.jenkins/admin-password` file. View it locally when signing in:

```powershell
Get-Content -LiteralPath .jenkins/admin-password
```

The container only publishes port 8080 on the loopback interface. It does not
mount the host Docker socket, workspace, SSH keys, or CMS authentication files.
The initial local development setup runs one trusted build at a time on the
controller. A shared/team installation should use separate build agents.

## Run tests

Open `flexed-playwright` and choose **Build with Parameters**:

- `bundled`: run the local tests captured when the Docker image was built.
  After changing local tests, rerun the startup script to rebuild the image.
- `github`: fetch `main` from `https://github.com/filippestrikov/flexed.git`.
  Only committed and pushed tests are included. For a private repository, add
  an HTTPS username/token credential in Jenkins and supply its credential ID.

The pipeline installs locked dependencies with `npm ci`, runs `npm test`, and
publishes JUnit results, the HTML report, failure screenshots, and traces.
Jenkins retains its default content security policy; if the interactive HTML
report is restricted, download the archived report and open it locally with
`npx playwright show-report`.

The current suite has two known failures (FLXD-WFW-005/020: missing CMS notes)
and one skipped case needing a no-note fixture. These failures remain build
failures. Existing CI retries are preserved. No CMS credentials are required
for the current storefront tests.

Verified first build on 2026-10-04: 12 passed, 2 failed, 1 skipped. Jenkins
recorded the JUnit results and archived the HTML report, screenshots, and traces.

## Stop and inspect

```powershell
docker --context desktop-linux compose stop
docker --context desktop-linux compose ps
docker --context desktop-linux compose logs --tail 100 jenkins
```

Stopping the service preserves Jenkins accounts and build history. Image rebuilds
refresh the pipeline definition and bundled test snapshot; they preserve the
administrator account and its existing password.

References: [Jenkins Docker installation](https://www.jenkins.io/doc/book/installing/docker/),
[Jenkins initialization hooks](https://www.jenkins.io/doc/book/managing/groovy-hook-scripts/),
and [Playwright CI](https://playwright.dev/docs/ci).
