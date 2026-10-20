# Agent Instructions

Follow these instructions for all work in this repository. When instructions conflict, follow the user's latest explicit request while preserving these rules wherever possible.

## Required Work Order

1. Inspect the relevant code, tests, documentation, and nearby conventions before editing.
2. Follow the existing project architecture and ownership boundaries. Do not replace, expand, or reorganize the architecture without explicit user approval.
3. Make the smallest focused change that satisfies the request. Keep related contracts, persistence models, DTOs, and tests consistent.
4. Run the most focused relevant validation available and report checks that could not be run.
5. Update documentation when a change affects behavior, APIs, data models, or development workflow.

## Architecture

- Preserve the established service boundaries and technology choices documented in this repository.
- Do not move responsibilities between services, introduce a new service or infrastructure component, or change communication patterns without explicit approval.
- If a requested change appears to require an architectural change, explain the conflict and ask before proceeding with that part.
- Do not treat draft documentation as an implemented contract. Keep proposals labeled as proposals until they are agreed and implemented.

## Empty Directories

- Every intentionally empty directory that should be retained in the repository must contain an empty `.gitkeep` file, because Git does not track directories by themselves.
- Remove a `.gitkeep` once the directory contains other tracked files.

## PostgreSQL and TypeORM Migrations

- Every change to a TypeORM entity that changes the PostgreSQL schema must include a corresponding TypeORM migration in the owning application.
- Migrations must use TypeORM's `QueryRunner` schema APIs, not raw SQL or `queryRunner.query(...)`. Use APIs such as `queryRunner.addColumn(tableName, new TableColumn(...))`, `dropColumn`, `createTable`, `dropTable`, `addIndex`, `dropIndex`, `createForeignKey`, and `dropForeignKey` as appropriate.
- For column changes, use the appropriate schema API, such as `changeColumn` with `TableColumn` definitions. Match PostgreSQL types, nullability, defaults, indexes, and constraints to the entity and intended data behavior.
- Implement both `up` and `down`; make the reverse migration undo the schema change where safely possible. Consider existing data before adding non-null columns or changing types.
- Keep the entity and migration consistent. Do not rely on TypeORM `synchronize` to update a database schema.
- Do not combine unrelated schema changes into an unnecessarily broad migration.

## Frontend TypeScript

- Each frontend feature must have a feature-local `types.ts` file for its TypeScript type declarations. Add feature-specific types to that file rather than creating a separate file for each type.
- Keep types used across multiple features in the appropriate shared package instead of duplicating them.
- Export named string unions as type aliases, for example:

  ```ts
  export type Sample = "first" | "second";
  ```

- Represent object shapes with exported interfaces:

  ```ts
  export interface SampleRecord {
    id: string;
  }
  ```

- Follow the repository's naming conventions. Prefer interface extension to repeated object fields when it makes related shapes clearer and avoids duplication:

  ```ts
  export interface Identified {
    id: string;
  }

  export interface SampleRecord extends Identified {
    name: string;
  }
  ```

- Keep types close to their owning feature unless they are intentionally shared. Do not duplicate a type that is already defined by a shared contract or generated source.

## Frontend Form Handling

- For input `onChange` handlers, read the value from `event.target.value` and pass that value to the state update or action, for example: `onChange={(event) => dispatch(setField({ field: "username", value: event.target.value }))}`.

## Frontend Colors

- Define every frontend color in the owning app's `globals.css` as a CSS variable and expose it through the app's theme or design-token system.
- Consume colors through semantic tokens in UI code, such as `bg-background` or `text-secondary`, rather than hard-coded color values, arbitrary color utilities, or locally defined color variables.
- When a needed color token does not exist, add it to `globals.css` and its theme mapping there before using it. Use semantic names based on purpose, not the color's visual value.

## Frontend Rendering Effects

- Avoid heavy box shadows and shader-like visual effects because they can render poorly or perform badly in Safari. Prefer subtle shadows and lightweight CSS effects.

## NestJS Backend DTOs

- In NestJS applications, define explicit DTOs at application/API boundaries; do not use persistence entities as request or response contracts.
- Put DTOs in a `dto/` directory owned by the relevant backend feature. Create a separate appropriately named file for each DTO, such as `orders/dto/create-order.dto.ts` and `orders/dto/order-response.dto.ts`; do not combine multiple DTO classes in one file.
- Add Swagger decorators (for example, `@ApiProperty`) and `class-validator` decorators (for example, `@IsString`, `@IsOptional`, and `@IsEnum`) to request/input DTOs according to their actual constraints.
- Ensure validation is enabled in the relevant NestJS application so input decorators are enforced; do not assume decorators alone perform validation.
- Name response DTO files with the `-response.dto.ts` suffix, such as `order-response.dto.ts`. Document response fields with Swagger decorators where applicable.
- Response DTOs are output shapes and should not have `class-validator` decorators in normal cases. Keep input validation on request DTOs; do not reuse response DTOs as input DTOs.
