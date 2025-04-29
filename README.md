# File Sharing Monorepo

This repository is a monorepo for a file sharing application. It includes both the backend and frontend code, as well as shared packages.

## Initial Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/githubnext/workspace-blank.git
   cd workspace-blank
   ```

2. Install dependencies using PNPM:
   ```sh
   pnpm install
   ```

3. Set up the database:
   ```sh
   cd packages/db
   pnpm prisma migrate dev
   pnpm prisma db seed
   cd ../..
   ```

4. Start the development servers:
   ```sh
   pnpm dev
   ```

## Project Structure

- `packages/config`: Shared configuration files (ESLint, TypeScript)
- `packages/db`: Database setup and Prisma client
- `packages/ui`: Shared UI components
- `backend/nestjs-app`: NestJS backend application
- `frontend/nextjs-app`: Next.js frontend application

## Contributing

Please follow the [contribution guidelines](CONTRIBUTING.md) when submitting changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
