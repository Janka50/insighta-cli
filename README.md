# Insighta CLI

Command-line tool for the Insighta Labs+ API.

## Installation

```bash
npm install -g insighta-cli
```

Or for local development:

```bash
git clone https://github.com/YOUR_USERNAME/insighta-cli
cd insighta-cli
npm install
npm link
```

## Commands

### Login
```bash
insighta login
```
Opens your browser to authenticate with GitHub. After login, paste your tokens when prompted.

### Check current user
```bash
insighta whoami
```

### List profiles
```bash
insighta profiles
insighta profiles --gender=male
insighta profiles --country=NG --page=1 --limit=10
insighta profiles --age-group=adult --sort-by=age --order=asc
insighta profiles --min-age=20 --max-age=40 --gender=female
```

### Natural language search
```bash
insighta search "young males"
insighta search "females above 30"
insighta search "adult males from nigeria"
insighta search "seniors from kenya" --limit=20
```

### Export to CSV (admin only)
```bash
insighta export
insighta export --country=NG
insighta export --gender=male --output=males.csv
```

### Logout
```bash
insighta logout
```

## Configuration

Credentials are stored at `~/.insighta/credentials.json` and are managed automatically.

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `INSIGHTA_API_URL` | `https://gender-api-hng.onrender.com` | Backend API URL |