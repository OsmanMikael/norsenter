# Getting Started with Create React App

appen er opprettet med kommandoen: npx create-react-app nor-senter

### `npm start`

starter appen

### `npm run build`

bygge appen

### frontend & bacend

frontend: react/typescript
backend: firebase console

### Distribusjon og Konfigurasjon (CI/CD) (Kobling)

Prosjektet er satt opp med en moderne pipeline for automatisk utrulling:

1- Firebase-tilkobling: React-appen kommuniserer med Firebase via konfigurasjonen i src/firebase.ts.

2- GitHub Actions (CI/CD): Appen distribueres automatisk via GitHub-workflows:

firebase-hosting-merge.yml: Ruller ut til produksjon ved push til main.

firebase-hosting-pull-request.yml: Lager en forhåndsvisning (preview) ved Pull Requests.

3- Sikkerhet: Autentisering mellom GitHub og Firebase skjer via en Service Account Key lagret som en "Secret" i GitHub-repositoriet. Denne ble generert med kommandoen firebase init hosting:github.

4- Domene: Appen er tilgjengelig på eget domene kjøpt hos Domeneshop, som er konfigurert med DNS-instillinger mot Firebase Hosting.



### Sensitive filer må ikke vare offentlig på github de skal legges på filen .gitignore før push appen på github
sensitive filer f.eks .env.local, build og node_modules

### Hvordan får variabler på de sensitive data som står i f.eks filen .env.local:
1- lager nye hemmlige nøkler (New repository secret) til hver variabel i github under: settings/secrets/actions 

2- Oppdater .github/workflows/firebase-hosting-merge.yml for å inkludere de variablene ved å legge de under Build project-steget.