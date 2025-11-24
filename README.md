# Spribe Game

This project is test task for Spribe company for Senior Angular Developer position.

## Description
It is a small game where user should get falling objects to increase score. This game also includes a form for changing parameters of the game. Some parameters should applied immediately, some parameters should be applied immediately, but if a user changes gameTime the game should restart. 
The game can be started with empty or invalid params in form.  

Mock communication with server by endpoint and websocket connection was implemented.  

All implementation bases only on RxJs (not setTimeout and Signals). There was used change detection strategy OnPush for minimization of re-rendering.

## Development information

This project was by Angular (version 17.3.17). Recommended version of Node.js is ^18.13.0 (v22.14.0 was used by development).

There were implemented Eslint, Prettier and Husky as basic tools setup for every my project

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.
