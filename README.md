# There are no hidden files

A retro-filesystem inspired game built with React, TypeScript, and Vite.

## Technology Stack

- **TypeScript** - Strict type checking for safer code
- **React** - UI library with hooks
- **Vite** - Fast build tool and dev server
- **Jotai** - State management
- **Vitest** - Unit testing framework
- **ESLint** - Code quality and consistency

## Development

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Setup

Install dependencies:

```bash
npm install
```

### Available Scripts

```bash
# Start development server with hot reload
npm run dev

# Run TypeScript type checking
npm run type-check

# Run ESLint
npm run lint

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Development Workflow

1. Run `npm run dev` to start the development server
2. Make changes to files in the `src/` directory
3. Run `npm run type-check` to verify TypeScript types
4. Run `npm run lint` to check code style
5. Run `npm test` to ensure tests pass
6. Run `npm run build` to verify production build

## Project Structure

```
src/
├── components/       # React components
│   ├── RetroScreen.tsx
│   └── FilePanel.tsx
├── fs/              # Filesystem abstractions
│   ├── types.ts     # TypeScript interfaces
│   └── sampleFs.ts  # Sample filesystem data
├── state/           # State management
│   └── atoms.ts     # Jotai atoms
├── test/            # Test utilities
│   └── setup.ts     # Test setup
├── App.tsx          # Main app component
├── main.tsx         # Entry point
└── index.css        # Global styles
```

## TypeScript

The project uses strict TypeScript configuration with:
- Strict type checking enabled
- No implicit any
- Unused locals and parameters detection
- Unchecked indexed access checks

All game entities, filesystem abstractions, and core modules are fully typed.

## Testing

Tests are written using Vitest and React Testing Library. Run tests with:

```bash
npm test
```

## Building

Build the project for production:

```bash
npm run build
```

The output will be in the `dist/` directory.

## CI/CD

The project includes GitHub Actions workflow that runs on every push and pull request:
- Type checking
- Linting
- Tests
- Production build

## License

See repository for license information.
