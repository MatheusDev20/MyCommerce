## FullStack MonoRepo template

The repository contains two main Applications under the *apps* folder and some configuration packages under **packages** folder to be shared.  

### Apps
  - [Nest JS application ](https://docs.nestjs.com/) under *apps/server*  
  - [NextJS 15](https://nextjs.org/) application under *apps/web*  

### Packages 
  - Tailwind
  - Typescript
  - Eslint
  - UI Components


### Folder Structure

```bash
├─ apps/
│  ├─server/
│  │  ├─ package.json
│  │  └─ ...
│  ├─web/
│  │  ├─ package.json
│  │  └─ ...
│
├─ packages/
│  ├─config-tailwind
│  │  ├─ package.json
│  │  └─ ...
│  ├─eslint-config
│  │  ├─ package.json
│  │  └─ ...
│  ├─typescript-config
│  │  ├─ package.json
│  │  └─ ...
│─ │─ui
│  │  ├─ package.json
│  │  └─ ...
│
├─ package.json
└─ README.md
└─ pnpm-workspace.yaml
└─ .gitignore
└─ pnpm-lock.yaml
└─ turbo.json
└─ .npmrc
```

