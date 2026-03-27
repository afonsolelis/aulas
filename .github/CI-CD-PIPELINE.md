# CI/CD Pipeline Documentation

## Overview

This repository uses GitHub Actions to automatically test and deploy the educational platform. The pipeline ensures code quality before deployment to GitHub Pages.

## Workflows

### 1. CI/CD - Test & Deploy to Pages (`.github/workflows/ci-cd.yml`)

**Triggers:** 
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Steps:**

#### Test Job
1. **Checkout code** - Fetches the latest code
2. **Setup Node.js** - Installs Node.js 20 with npm cache
3. **Install dependencies** - Runs `npm ci` for consistent builds
4. **Install Playwright browsers** - Downloads browser binaries for testing
5. **Run tests** - Executes `npm test` (Playwright test suite)
6. **Upload test report** - Saves HTML test report as artifact (30-day retention)
7. **Comment on PR** - Posts test results summary as a comment (pull requests only)

#### Deploy Job
- **Runs after:** Test job passes
- **Runs on:** Merge to `main` or `develop` branches only (not on PRs)
- **Steps:**
  1. Checkout code
  2. Setup GitHub Pages environment
  3. Upload entire repository as artifact
  4. Deploy to GitHub Pages

**Key Features:**
- ✅ Tests always run before deployment
- ✅ PRs can be reviewed with test results
- ✅ Automatic deployment only on push to protected branches
- ✅ Test reports stored for 30 days
- ✅ Concurrency control to prevent simultaneous deployments

---

### 2. Code Quality Checks (`.github/workflows/quality-checks.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

**Jobs:**

#### Lint Job
Validates structure and conventions:
- ✓ JSON files in `/config/` are valid
- ✓ HTML slide files follow naming: `slide_lesson-<n>.html`
- ✓ Module directories have `slides/` and `materials/` subdirectories
- ✓ Checks for hardcoded absolute URLs (should be relative)

#### Security Job
Prevents common security issues:
- ✓ Scans for hardcoded credentials (API keys, passwords, secrets)
- ✓ Warns about potential credential patterns

---

## Branch Strategy

| Branch | Purpose | Deploy? |
|--------|---------|---------|
| `main` | Production-ready code | ✅ Yes |
| `develop` | Development/staging | ✅ Yes (to dev environment) |
| Feature branches | Feature development | ❌ No, only test results posted |

---

## Test Reports

### Accessing Test Results

**For Push Events (main/develop):**
- Navigate to Actions tab → CI/CD workflow run
- Find "Run Tests" job → Artifacts section
- Download `playwright-report` folder
- Open `index.html` in browser

**For Pull Requests:**
- Test results automatically commented on PR
- Click link to view detailed report in Actions

### Test Report Contents
- ✅ Passing tests summary
- ❌ Failed tests with stack traces
- ⏭ Skipped tests
- 📊 Coverage information (if configured)
- 🎬 Video recordings (for failed tests)
- 🎯 Screenshots and traces

---

## Deployment

### Automatic Deployment Flow

```
┌─────────────────────────────────────────┐
│ Push to main/develop                    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Install dependencies                    │
│ Install Playwright browsers             │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│ Run full test suite                     │
│ (All tests in /tests/ directory)        │
└────────────┬────────────────────────────┘
             │
        ┌────┴────┐
        │          │
       ✓ Tests    ✗ Tests fail
       Pass       └─> Pipeline stops
        │           (no deployment)
        │
        ▼
┌─────────────────────────────────────────┐
│ Upload to GitHub Pages                  │
│ Deploy to live environment              │
└─────────────────────────────────────────┘
```

### Deployment URL

Once deployed, the site is available at:
```
https://afonsolelis.github.io/aulas/
```

---

## Manual Actions

### Running Tests Locally Before Push

```bash
# Install dependencies
npm install

# Run full test suite
npm test

# Run specific test file
npx playwright test tests/home_pages.spec.ts

# Run tests in debug mode
npx playwright test --debug

# View previous test report
npx playwright show-report
```

### Triggering Manual Workflow Runs

You can manually trigger workflows from the GitHub Actions tab:

1. Go to **Actions** tab
2. Select workflow (CI/CD or Quality Checks)
3. Click **Run workflow**
4. Select branch
5. Click **Run workflow**

---

## Environment Variables & Secrets

Currently, no secrets are required for this pipeline. If adding external APIs or private deployments in the future:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Create new repository secret
3. Reference in workflow: `${{ secrets.SECRET_NAME }}`

---

## Monitoring and Alerts

### GitHub Actions Status
- Check status badge in README
- Monitor **Actions** tab for failed runs
- Subscribe to workflow failure notifications

### Troubleshooting Failed Pipelines

#### Tests Failing
1. View the "Run Tests" job output
2. Download playwright report artifact
3. Check which test(s) failed and why
4. Common issues:
   - File naming convention violations
   - Missing directories
   - Color validation errors (check `spec/04-home-module.md`)

#### Deploy Failing
1. Ensure previous tests passed
2. Check GitHub Pages settings (Settings → Pages)
3. Verify branch is set to deploy from Actions
4. Check repository is public (Pages requires public repo)

#### Quality Checks Failing
- **JSON validation:** Check syntax in `/config/*.json` files
- **Naming conventions:** Verify slide files are `slide_lesson-<n>.html`
- **Security scan:** Remove hardcoded credentials if found

---

## Performance

| Component | Time |
|-----------|------|
| Node.js setup | ~30 seconds |
| Dependency install | ~20-40 seconds |
| Playwright setup | ~30-60 seconds |
| Test execution | ~2-3 minutes |
| Deployment | ~1-2 minutes |
| **Total** | **~5-8 minutes** |

---

## Next Steps

### Future Enhancements
- [ ] Add visual regression testing
- [ ] Generate accessibility reports
- [ ] Performance monitoring (Lighthouse)
- [ ] Automated screenshot comparisons
- [ ] Slack/Discord notifications for failures
- [ ] Deploy preview environments for PRs
- [ ] Automated content validation

### Useful Links
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
