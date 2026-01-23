# Docker Setup for Saucedemo E2E Tests

## Quick Start

### Run tests in Docker

```bash
# Build and run all tests
npm run docker:test

# Run smoke tests only
npm run docker:smoke

# View test logs from database
npm run docker:logs

# Access container shell for debugging
npm run docker:shell
```

## Docker Services

### 1. **playwright-tests** (default)

Runs the full test suite in a containerized environment.

```bash
docker-compose up playwright-tests
```

**Features:**

- Uses official Playwright Docker image (v1.57.0-noble)
- Pre-installed Chromium, Firefox, and WebKit browsers
- Mounts test results and reports to host machine
- Persists SQLite database for test logs

### 2. **smoke-tests** (profile: smoke)

Runs only smoke tests (`@smoke` tag).

```bash
docker-compose --profile smoke up smoke-tests
```

### 3. **logs-viewer** (profile: tools)

View test execution logs from the database.

```bash
docker-compose --profile tools run logs-viewer
```

## Environment Variables

Create a `.env` file in the project root (use `.env.example` as template):

```env
PASSWORD='secret_sauce'
DASHBOARD_URL='/inventory.html'
TOKEN_EP='submit.backtrace.io/UNIVERSE/TOKEN/json'
DASHBOARD_PICTURE_URL='/static/media/'
ABOUT_URL='https://saucelabs.com/'
```

The Docker setup will automatically load this file.

**Required:**

- `PASSWORD` - Password for test users (stored in GitHub Secrets for CI/CD)
- `DASHBOARD_URL` - Dashboard page path for URL verification
- `TOKEN_EP` - Token endpoint for API request verification
- `DASHBOARD_PICTURE_URL` - Picture URL path for image verification
- `ABOUT_URL` - About page URL for link verification

## Volume Mounts

The following directories are mounted to persist data:

| Host Path             | Container Path           | Purpose                                      |
| --------------------- | ------------------------ | -------------------------------------------- |
| `./playwright-report` | `/app/playwright-report` | HTML test reports                            |
| `./test-results`      | `/app/test-results`      | Test artifacts (screenshots, videos, traces) |
| `./allure-results`    | `/app/allure-results`    | Allure test results                          |
| `./playwright.db`     | `/app/playwright.db`     | SQLite database with test logs               |
| `./src`               | `/app/src`               | Source code (for live development)           |
| `./tests`             | `/app/tests`             | Test files (for live development)            |

## Manual Docker Commands

### Build the image

```bash
docker build -t saucedemo-e2e .
```

### Run tests with custom command

```bash
docker run --rm \
  -e PASSWORD=secret_sauce \
  -e DASHBOARD_URL=/inventory.html \
  -e TOKEN_EP=submit.backtrace.io/UNIVERSE/TOKEN/json \
  -e DASHBOARD_PICTURE_URL=/static/media/ \
  -e ABOUT_URL=https://saucelabs.com/ \
  -v "$(pwd)/playwright-report:/app/playwright-report" \
  -v "$(pwd)/test-results:/app/test-results" \
  -v "$(pwd)/playwright.db:/app/playwright.db" \
  saucedemo-e2e \
  npm test
```

### Interactive shell

```bash
docker run -it --rm saucedemo-e2e sh
```

## CI/CD Integration

### GitHub Actions

The Docker image can be used in GitHub Actions. The project uses Playwright's built-in GitHub reporter for test annotations:

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    container:
      image: mcr.microsoft.com/playwright:v1.57.0-noble
    steps:
      - uses: actions/checkout@v4
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
        env:
          CI: true
          PASSWORD: ${{ secrets.PASSWORD }}
          DASHBOARD_URL: ${{ vars.DASHBOARD_URL }}
          TOKEN_EP: ${{ vars.TOKEN_EP }}
          DASHBOARD_PICTURE_URL: ${{ vars.DASHBOARD_PICTURE_URL }}
          ABOUT_URL: ${{ vars.ABOUT_URL }}
```

The `CI: true` environment variable enables the GitHub reporter, which automatically adds test failure annotations to the workflow run.

## Troubleshooting

### Permission issues on Linux

If you encounter permission issues with mounted volumes:

```bash
docker-compose run --rm --user $(id -u):$(id -g) playwright-tests
```

### Clean up containers and volumes

```bash
docker-compose down -v
```

### View logs from specific service

```bash
docker-compose logs playwright-tests
```

## Benefits of Docker Setup

✅ **Consistent Environment** - Same browser versions across all machines  
✅ **Isolated Testing** - No interference with host system  
✅ **CI/CD Ready** - Easy integration with pipelines  
✅ **No Local Setup** - No need to install browsers locally  
✅ **Reproducible** - Same results on Windows, Mac, Linux
