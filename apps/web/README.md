# TG Media Vault UI

## Description

Shows media content via browser.

## Files Structure

Frontend app is using ReactJS library and [Material UI](https://mui.com/material-ui/) components separated by the next main folders:

  - `api`: code that is related with the Backend interaction
  - `hooks` to get data from server
  - `actions` to make actions

- `components`: some small components, like: `buttons`, `icons`, `loader`, etc.

  **Components (Presentation Components, "Dumb" Components)**
  - Responsible for the appearance and rendering of data.
  - Do not contain logic for working with data (state, API requests, etc.).
  - Receive data via props and call the provided callbacks.
  - Easily reusable.

- `containers`: complex components that are composed of `components`

  **Containers (Container Components, "Smart" Components)**
  - Responsible for business logic and data management.
  - Interact with APIs, manage state (usually using React State, Redux, or Context API).
  - Pass data to presentation components.

- `pages`: pages, composed of `components` and `containers`

- `providers`: context providers

- `routing`: routing related code

- `tools`: some helpful tools, like: date, digitals or text convertors

## Required environment variables

| Environment variable name   | Purpose                  | Sample value                                                      |
|-----------------------------|--------------------------|-------------------------------------------------------------------|
| [`VITE_API_URL`]            | API url                  | `http://localhost:3000` (default)                                 |

## Running the app

```bash
npm run dev
```
