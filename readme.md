# Cleary hiring challenge

# Introduction

Hello! Thanks for taking our hiring challenge. This challenge will be used to assess your coding skills across the entire stack (frontend, backend, SQL, and data modeling). Plan to spend around 2-3 hours on the challenge, and please don't spend more; make sure you plan your time accordingly and prioritize the right things based on the requirements listed below.

# Task

Your task is to implement the Hyper PDF Uploader - an app that lets users upload PDFs to be processed by an external application.

## Frontend

The frontend is a React application, and consists of 4 parts:

- A page that shows all processed PDFs in a table.
- A page that shows all PDFs pending processing or are actively being processed in a table.
- A page to view the PDF and edit its metadata before processing it.
- The ability for the user to upload multiple PDFs to the backend.

The frontend uses the [Antd component library](https://ant.design/) for its base components.

The frontend can be run using the `npm run dev` command.

### Processed PDFs page

This page should consist of a table that displays the PDFs that have been processed by an external application, and should display the following information about the document:

- Name
- Author
- Kind
- The time it was uploaded
- The time it was processed (updated)

Additionally, the user should be able to navigate to an individual PDF view page and should be able to delete specific documents from the table.

### Pending PDFs page

This page should consist of a table that displays PDFs that are either not processed or are currently processing, and should display the following information about the document:

- The status (uploading, pending, processing)
- The title
- The author
- Kind
- The time it was uploaded
- The time it was updated

### View and edit PDF page

This page should consist of two areas:

1. An area to view the PDF. When visiting the page the PDF should be visible automatically.
2. An area to view, edit, and save PDF metadata.

#### Metadata

PDFs have the following editable metadata:

- Name
- Author
- Document kind (ISO norm, regulation, internal documentation)

They also have the following non-editable metadata:

- The time it was uploaded

### User flow

1. When the user uploads one or more PDFs, the PDFs should *immediately* appear in the pending PDFs table with the status of `uploading`. You don't need to show upload progress, just the uploading status is okay.
2. When the PDF is uploaded to the backend, its status should transition to `pending`.
3. The user then needs to input metadata (name, author, document kind). Upon successful submission, the backend should call an external API denoted by the `PROCESSING_API_ENDPOINT` environment variable. Assume the endpoint is available and will not err when called with valid data.
4. The PDF should transition to the `processing` status.
5. The processing API will eventually make a POST request to the `complete` endpoint. Calling this endpoint will set the PDF status to `processed`, and this PDF should now be visible on the processed PDFs page.

### Additional details

- It should be possible to nagivate between all pages without knowing the URL specifically; as a user of the application I should be able to go from one view to the next relatively intuitively. I should also be able to refresh the page and the same page should appear after load (in other words, navigation state shouldn't be in memory only and should also persist to the URL).

## Backend

The backend is an Express app that exposes REST APIs that correspond to the functionality listed above.

The backend can be run using the `npm run server` command.

### Endpoints

Your API should expose the following endpoints:

- `GET /document/:id`. Should return the document's metadata.
- `GET /document/:id/resource`. Should return the raw PDF resource.
- `POST /document/:id`. Updates the document's metadata, and triggers a call to the `PROCESSING_API_ENDPOINT` endpoint.
- `POST /document/:id/complete`. Endpoint the processing API calls when the processing is complete.
- `DELETE /document/:id`. Deletes a document.

All endpoints should return a JSON-parseable response, with the exception of the resource endpoint, which returns an octet stream.

### SQL and data model

For this challenge you'll use [Drizzle](https://orm.drizzle.team/) as your ORM and data modeling tool, and you'll use SQLite as your database. You can model the data however you'd like.

You can run any migrations using the `npm run drizzle:migrate` command.

### Processing API

The processing API, accessible at the `PROCESSING_API_ENDPOINT` environment variable, takes a JSON object with the ID of the document being processed. Assume it's stateless and will arbitrarily take the same ID multiple times, and assume that the endpoint will be available and respond with a 200 status for all valid requests.

The processing API will err if you give it any other information besides the ID.

# Final notes

- You won't be scored on how the page looks. The default styles from `antd` are fine.
- You also won't be scored on any scalability or long term architectural decisions; it's okay to make a suboptimal decision that you wouldn't do in production. That said, if there are decisions that you would do differently in a production setting, please tell us and explain your reasoning.
- You can primarily consider the happy paths; don't worry about error or edge cases. That said, you should have an idea of what error and edge cases might come up.
- Your app shouldn't have any type errors or warnings. If there ends up being one, it's okay, but you'll be asked about it and how you might approach it given more time.
- You don't need to deal with authorization or login. You can assume the user in the app is authorized, and you can make an arbitrary profile (id, name, etc.) for the user. The API endpoints don't need authorization checks and the `PROCESSING_API_ENDPOINT` also works without auth.
- Please don't add any additional libraries; use the libraries that are given in `package.json` and nothing else. If you really need to add a library, you'll be asked to explain about it.
- Please ensure that the application can be run using `npm run dev` and `npm run server`.

Good luck, and enjoy!
