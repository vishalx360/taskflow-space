# Taskflow

![Taskflow.Space Software Poster](public/ShortAnimation.gif?raw=true "Taskflow.space")

## Introduction

[Taskflow](https://taskflow.space) is a powerful application designed to help individuals and teams stay organized, efficient, and productive.

## Table of Contents

- [Taskflow](#taskflow)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
  - [System Architecture](#system-architecture)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Deployment and Hosting](#deployment-and-hosting)
  - [Database Schema](#database-schema)
    - [Authentication Schema](#authentication-schema)
      - [User](#user)
      - [Account](#account)
      - [Session](#session)
      - [VerificationToken and ResetPasswordToken](#verificationtoken-and-resetpasswordtoken)
      - [Passkey](#passkey)
    - [Application Schema](#application-schema)
      - [Workspace](#workspace)
      - [WorkspaceMember](#workspacemember)
      - [WorkspaceMemberInvitation](#workspacememberinvitation)
      - [Board](#board)
      - [List](#list)
      - [Task](#task)
      - [TaskMember](#taskmember)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [License](#license)

## Features

Our platform offers a range of unique features and benefits, including:

- **Workspaces** : Taskflow allows you to create multiple workspaces, each with its own set of tasks and team members. This feature allows you to keep different projects separate and organized.

- **Drag and Drop** : With Taskflow, you can easily drag and drop tasks between lists and boards, making it easy to prioritize and reorganize your tasks.

- **Team Members** : You can easily invite team members to join your workspace, allowing them to collaborate with you on tasks and projects.

- **Member Roles**: Taskflow offers a range of member roles, from admin to viewer, allowing you to control who has access to what information.

- **Custom Board Background**: You can customize your workspace by adding a custom board background, making your workspace more personalized and enjoyable to work in.

## Getting Started

To run the application locally or deploy it, follow these general steps mentioned in [Setup Instructions](Setup-Instruction.md)

## System Architecture

![Taskflow.Space System Architecture](/arch-diagram.png?raw=true "Taskflow.space")

The system architecture of taskflow leverages a combination of cutting-edge technologies to ensure reliability, scalability, and efficiency.

### Frontend

- **Next.js v12**: Taskflow's frontend is built using Next.js, a React framework for web applications. Next.js provides server-side rendering, which enhances performance and SEO.

- **Tailwind CSS**: The utility-first CSS framework, Tailwind CSS, is used for designing and styling the user interface. It offers flexibility and customization for a polished design.

- **shadnUi**: Taskflow incorporates complex UI components from shadnUi, enhancing the user interface with sophisticated and user-friendly elements.

### Backend

- **tRPC**: Taskflow employs tRPC, a fast TypeScript RPC framework, to build APIs. This ensures efficient communication between the frontend and backend, enabling dynamic interactions.

- **Prisma**: Prisma serves as the type-safe ORM (Object-Relational Mapping) for TypeScript and Node.js, allowing efficient data management and retrieval.

- **Nextauth**: Nextauth is an open-source authentication solution for Next.js applications, ensuring secure user authentication and authorization.

### Database

- **Neon**: Neon is a serverless Postgres database used for storing and retrieving data. It provides a scalable and reliable data storage solution.

### Deployment and Hosting

- **Vercel**: Taskflow leverages Vercel, a cloud platform for deploying and managing web applications. Vercel offers scalability and a straightforward deployment process, ensuring a smooth user experience.

This technology stack, combined with a well-designed architecture, enables Taskflow to deliver a performant and user-friendly task management platform.

## Database Schema

![Taskflow.Space System Architecture](/database-schema.png "Taskflow.space")

In Taskflow, the database schema is designed to support various features of the application, including user management, workspaces, tasks, boards, and more. Below is an overview of the key database models and their relationships.

### Authentication Schema

#### User

- Represents a user in the system.
- Contains fields such as `id`, `name`, `email`, `image`, and `password`.
- Has associations with tasks, workspaces, and workspace invitations.
- Supports extra fields like `tasks` and `workspaces`.

#### Account

- Represents external authentication accounts linked to a user.
- Contains fields like `id`, `userId`, `type`, and `provider`.
- Allows associations with the user.

#### Session

- Represents user sessions for authentication.
- Contains fields such as `id`, `sessionToken`, `userId`, and `expires`.
- Associated with the user for session management.

#### VerificationToken and ResetPasswordToken

- Used for email verification and password reset.
- Store information like `token`, `expires`, and `identifier`.

#### Passkey

- Represents passkeys used for authentication.
- Contains fields like `id`, `name`, `userId`, `counter`, and `transports`.

### Application Schema

#### Workspace

- Represents a workspace within Taskflow.
- Contains fields like `id`, `createdAt`, `name`, and `personal`.
- Associated with boards and members.

#### WorkspaceMember

- Represents members within a workspace.
- Contains fields like `id`, `userId`, `role`, and `memberSince`.
- Associated with a user and workspace.

#### WorkspaceMemberInvitation

- Represents invitations to join a workspace.
- Contains fields like `id`, `recepient`, `recepientEmail`, `sender`, and `role`.
- Associated with a workspace.

#### Board

- Represents a board within a workspace.
- Contains fields like `id`, `createdAt`, `updatedAt`, `name`, and `description`.
- Associated with lists and a workspace.

#### List

- Represents a list within a board.
- Contains fields like `id`, `createdAt`, `name`, and `boardId`.
- Associated with tasks and a board.

#### Task

- Represents tasks within a list.
- Contains fields like `id`, `createdAt`, `title`, `description`, `listId`, and `rank`.
- Associated with members and a list.

#### TaskMember

- Represents members assigned to a task.
- Contains fields like `id`, `createdAt`, `taskId`, and `userId`.
- Associated with a task and a user.

The database schema is designed to support the collaborative and organizational features of Taskflow, allowing users to manage tasks, workspaces, and more effectively.

## Contributing

Contributions to this project are welcome. Please follow the [Contribution Guidelines](CONTRIBUTING.md) when making changes.

## Code of Conduct

Please review our [Code of Conduct](CODE_OF_CONDUCT.md) to understand the behavior we expect from all contributors and users of this project.

## License

This project is licensed under the [GNU General Public License v3.0](LICENSE) - see the [LICENSE](LICENSE) file for details.
