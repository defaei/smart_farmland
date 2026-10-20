---
name: setup-redux
description: setup redux toolkit for state management in NextJS
---

## Installation

```bash
npm install @reduxjs/toolkit react-redux
```

## Configuration

create a store.ts in shared folder in src that should configure store using `configureStore` from `@reduxjs/toolkit` and export the store instance.
and export these 2 types:

- `RootState` - the type of the root state of the store.
- `AppDispatch` - the type of the dispatch function of the store.

create a redux-wrapper using `react-redux` that put children between `Provider` tag

## Usage

wrapp `LoginForm` with `Redux Wrapper`
