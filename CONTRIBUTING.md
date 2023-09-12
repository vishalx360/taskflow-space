# Contributing to Taskflow

Welcome to Taskflow! We appreciate your interest in contributing to our open-source project. By contributing, you can help us improve and grow Taskflow to benefit the community. Please take a moment to review the following guidelines.

## Code of Conduct

Before contributing, please read and adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). We expect all contributors to follow these guidelines to ensure a positive and respectful community environment.

## Getting Started

If you're new to contributing to Taskflow, here are some steps to get started:

1. **Fork the repository:** Click the "Fork" button on the top right-hand corner of this repository to create your own copy.

2. **Clone your fork:** Use `git clone` to clone your forked repository to your local machine.

3. **Set up the development environment:** Follow the instructions in the [README.md](README.md) file to set up your development environment.

4. **Create a new branch:** Before making changes, create a new branch for your work. Choose a descriptive branch name related to the issue or feature you're working on.

5. **Make changes:** Make your desired changes or additions to the codebase.

6. **Run tests:** If applicable, run any tests associated with your changes to ensure they work as expected.

7. **Commit your changes:** Use `git commit` to commit your changes. Please write clear, concise commit messages following our [commit message conventions](#commit-message-conventions).

8. **Push your changes:** Push your changes to your forked repository on GitHub.

9. **Submit a pull request (PR):** Create a new PR from your branch to the main Taskflow repository. Ensure that your PR includes a clear description of the changes you made and references any related issues.

## Commit Message Conventions

We follow a specific commit message convention to maintain a clean and organized commit history. We encourage the use of semantic commit messages, which help in understanding the purpose and impact of each commit at a glance. Please use the following format for your commit messages:

Here's an explanation of each part of a semantic commit message:

- `<type>`: Describes the category or type of change. Common types include `feat` (for new features), `fix` (for bug fixes), `docs` (for documentation changes), `chore` (for routine tasks or maintenance), `style` (for code style changes), and more.

- `<scope>` (optional): Represents the scope or context of the change. This can be a module, file, or component affected by the commit.

- `<description>`: Provides a concise and meaningful description of the changes made in the commit.

- `Close #<issue-number>` (optional): If the commit is related to a specific issue or feature request, reference it in the commit message to automatically close the issue when the commit is merged.

For example:

- `feat(auth): add user registration functionality`
- `fix(api): resolve issue with data retrieval`
- `docs(readme): update installation instructions`
- `chore(tests): refactor unit tests for improved coverage`

Using semantic commit messages helps improve the clarity and maintainability of the commit history. It also aids in generating meaningful changelogs and release notes automatically.

Please ensure that your commit messages follow this convention when contributing to Taskflow. Thank you!
