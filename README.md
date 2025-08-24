# MiniKit Template

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain --mini`](), configured with:

- [MiniKit](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit](https://www.base.org/builders/onchainkit)
- [Tailwind CSS](https://tailwindcss.com)
- [Next.js](https://nextjs.org/docs)

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Verify environment variables, these will be set up by the `npx create-onchain --mini` command:

You can regenerate the FARCASTER Account Association environment variables by running `npx create-onchain --manifest` in your project directory.

The environment variables enable the following features:

- Frame metadata - Sets up the Frame Embed that will be shown when you cast your frame
- Account association - Allows users to add your frame to their account, enables notifications
- Redis API keys - Enable Webhooks and background notifications for your application by storing users notification details

```bash
# Shared/OnchainKit variables
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Frame metadata
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=
NEXT_PUBLIC_APP_SUBTITLE=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_SPLASH_IMAGE=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=
NEXT_PUBLIC_APP_HERO_IMAGE=
NEXT_PUBLIC_APP_TAGLINE=
NEXT_PUBLIC_APP_OG_TITLE=
NEXT_PUBLIC_APP_OG_DESCRIPTION=
NEXT_PUBLIC_APP_OG_IMAGE=

# Redis config
REDIS_URL=
REDIS_TOKEN=
```

3. Start the development server:
```bash
npm run dev
```

## Template Features

### Frame Configuration
- `.well-known/farcaster.json` endpoint configured for Frame metadata and account association
- Frame metadata automatically added to page headers in `layout.tsx`

### Background Notifications
- Redis-backed notification system using Upstash
- Ready-to-use notification endpoints in `api/notify` and `api/webhook`
- Notification client utilities in `lib/notification-client.ts`

### Theming
- Custom theme defined in `theme.css` with OnchainKit variables
- Pixel font integration with Pixelify Sans
- Dark/light mode support through OnchainKit

### MiniKit Provider
The app is wrapped with `MiniKitProvider` in `providers.tsx`, configured with:
- OnchainKit integration
- Access to Frames context
- Sets up Wagmi Connectors
- Sets up Frame SDK listeners
- Applies Safe Area Insets

## Customization

To get started building your own frame, follow these steps:

1. Remove the DemoComponents:
   - Delete `components/DemoComponents.tsx`
   - Remove demo-related imports from `page.tsx`

2. Start building your Frame:
   - Modify `page.tsx` to create your Frame UI
   - Update theme variables in `theme.css`
   - Adjust MiniKit configuration in `providers.tsx`

3. Add your frame to your account:
   - Cast your frame to see it in action
   - Share your frame with others to start building your community

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Repository Structure

Below are the current directory trees for the `my-minikit-app` and `contracts` folders in this workspace.

NOTE: long vendor lists are truncated with "..." for readability.

### `my-minikit-app`

```
my-minikit-app/
├─ .env
├─ .eslintrc.json
├─ .gitignore
├─ .prettierrc
├─ .yarnrc.yml
├─ next-env.d.ts
├─ next.config.mjs
├─ package.json
├─ postcss.config.mjs
├─ README.md
├─ tailwind.config.ts
├─ tsconfig.json
├─ .next/
│  ├─ app-build-manifest.json
│  ├─ build-manifest.json
│  ├─ package.json
│  ├─ prerender-manifest.json
│  ├─ react-loadable-manifest.json
│  ├─ routes-manifest.json
│  ├─ trace
│  ├─ cache/
│  │  ├─ .rscinfo
│  │  └─ swc/
│  │     └─ plugins/
│  ├─ webpack/
│  │  ├─ client-development/
│  │  └─ server-development/
│  └─ server/
│     ├─ app-paths-manifest.json
│     ├─ interception-route-rewrite-manifest.js
│     ├─ middleware-build-manifest.js
│     ├─ middleware-manifest.json
│     ├─ middleware-react-loadable-manifest.js
│     ├─ next-font-manifest.js
│     ├─ next-font-manifest.json
│     ├─ pages-manifest.json
│     ├─ server-reference-manifest.js
│     ├─ server-reference-manifest.json
│     ├─ webpack-runtime.js
│     └─ app/
│        ├─ page_client-reference-manifest.js
│        └─ page.js
├─ static/
│  ├─ chunks/
│  ├─ css/
│  ├─ development/
│  └─ webpack/
├─ types/
│  ├─ cache-life.d.ts
│  └─ package.json
├─ app/
│  ├─ globals.css
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ providers.tsx
│  ├─ theme.css
│  ├─ .well-known/
│  │  └─ farcaster.json/
│  ├─ api/
│  │  ├─ notify/
│  │  └─ webhook/
│  └─ components/
│     ├─ Button.tsx
│     ├─ Card.tsx
│     ├─ Features.tsx
│     ├─ Home.tsx
│     ├─ Icon.tsx
│     ├─ TodoList.tsx
│     └─ TransactionCard.tsx
├─ lib/
│  ├─ notification-client.ts
│  ├─ notification.ts
│  └─ redis.ts
└─ public/
    ├─ hero.png
    ├─ icon.png
    ├─ logo.png
    ├─ screenshot.png
    └─ splash.png
```

### `contracts`

```
contracts/
├─ .env
├─ foundry.toml
├─ README.md
├─ lib/
│  └─ forge-std/
│     ├─ .gitattributes
│     ├─ .gitignore
│     ├─ CONTRIBUTING.md
│     ├─ foundry.toml
│     ├─ LICENSE-APACHE
│     ├─ LICENSE-MIT
│     ├─ package.json
│     ├─ README.md
│     ├─ RELEASE_CHECKLIST.md
│     ├─ .github/
│     │  ├─ CODEOWNERS
│     │  └─ workflows/
│     │     ├─ ci.yml
│     │     └─ sync.yml
│     ├─ scripts/
│     │  └─ vm.py
│     ├─ src/
│     │  ├─ Base.sol
│     │  ├─ console.sol
│     │  ├─ console2.sol
│     │  ├─ safeconsole.sol
│     │  ├─ Script.sol
│     │  ├─ StdAssertions.sol
│     │  ├─ StdChains.sol
│     │  ├─ StdCheats.sol
│     │  ├─ StdConstants.sol
│     │  ├─ StdError.sol
│     │  ├─ StdInvariant.sol
│     │  ├─ StdJson.sol
│     │  ├─ StdMath.sol
│     │  ├─ StdStorage.sol
│     │  ├─ StdStyle.sol
│     │  ├─ StdToml.sol
│     │  ├─ StdUtils.sol
│     │  ├─ Test.sol
│     │  └─ Vm.sol
│     └─ interfaces/
│        ├─ IERC1155.sol
│        ├─ IERC165.sol
│        ├─ IERC20.sol
│        ├─ IERC4626.sol
│        ├─ IERC6909.sol
│        ├─ IERC721.sol
│        ├─ IERC7540.sol
│        ├─ IERC7575.sol
│        └─ IMulticall3.sol
├─ script/
│  └─ Counter.s.sol
├─ src/
│  └─ Counter.sol
└─ test/
    └─ Counter.t.sol
```
