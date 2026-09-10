# Stockroom Frontend 
        
A standalone warehouse inventory management SPA built with React 18, Vite 5, TypeScript 5, Tailwind CSS 3, TanStack Query v5, and React Router v6. 

## Features

- Dashboard with stat cards and recent stock movement history
- Product management (create, edit, delete) with category association
- Category management with inline add form
- Stock movement recording (IN / OUT) with automatic product quantity refresh

## GitHub Actions secrets

The CI workflow (`.github/workflows/ci.yml`) pushes Docker images to Amazon ECR using
short-lived credentials obtained via OIDC — no long-lived AWS access keys are stored in
GitHub.

Configure the following in **Settings → Secrets and variables → Actions → New repository secret**:

| Secret | What it is | How to find it |
| ------ | ---------- | -------------- |
| `AWS_ROLE_ARN` | ARN of the IAM role GitHub Actions assumes via OIDC to push to ECR | Use the **same shared role** as `stockroom-api` — the trust policy and permission policy use `stockroom-*` wildcards so one role covers both repos. See the `stockroom-api` README for the full setup instructions. |
| `ECR_REGISTRY` | ECR registry hostname | `<your-12-digit-account-id>.dkr.ecr.<region>.amazonaws.com` — visible in the AWS Console under **Elastic Container Registry → Private registry** |

---

## Releasing

Versioned releases are driven by Git tags. Pushing a semver tag triggers the CI
workflow to build a Docker image and push it to ECR tagged with both the version
and `:latest`:

```bash
git tag v1.2.0
git push origin v1.2.0
```

This produces `stockroom-frontend:v1.2.0` and `stockroom-frontend:latest` in ECR.

After tagging, update `frontend_image_tag` in
[stockroom-deployment/terraform/terraform.tfvars](../stockroom-deployment/terraform/terraform.tfvars)
and open a PR against `release/prod` to deploy it.

## Running locally

```bash
npm install
cp .env.example .env      # then edit VITE_API_BASE_URL and VITE_API_KEY
npm run dev
```

The app starts at `http://localhost:5173` by default.

## Environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `VITE_API_BASE_URL` | Base URL for the Stockroom backend API | `http://localhost:8000/api/v1` |
| `VITE_API_KEY` | API key sent in the `X-API-Key` request header | `demo-api-key` |

## Building for production

```bash
npm run build
```

Output is written to `dist/`. The included `Dockerfile` builds the app and serves it via `nginx:alpine`.

```bash
docker build -t stockroom-frontend .
docker run -p 8080:80 stockroom-frontend
```
