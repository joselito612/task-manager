# Project Specification

## Project Name
Task Manager

## Description

Task Manager is a full-stack web application that allows users to manage personal tasks.

The system supports authentication and role-based access control.  
Users manage their own tasks, while administrators can manage users and monitor system activity.

---

## User Roles

### User

A standard user can:

- register an account
- login
- create tasks
- update tasks
- delete tasks
- mark tasks as completed
- view only their own tasks

Users cannot access tasks belonging to other users.

### Admin

An administrator can:

- view all users
- create users
- delete users
- view all tasks in the system

---

## Core Features

Authentication system using JWT.

Task management:

- create tasks
- edit tasks
- delete tasks
- mark tasks as completed

Role-based authorization.

User isolation so each user only sees their own tasks.

---

## Data Model Overview

Entities:

User  
Task

Relationship:

One user can have multiple tasks.

Each task belongs to one user.

Users have a role field:

USER  
ADMIN

---

## Application Flow

1. user registers an account
2. user logs in
3. API verifies credentials
4. API generates a JWT token
5. frontend stores the token
6. authenticated user accesses protected routes
7. user manages tasks through the dashboard

Admin flow:

1. admin logs in
2. admin accesses admin endpoints
3. admin manages users and views system tasks
