# DAM Movie Exam Lab

An interactive practice lab for the Android (DMA) test on the **Movie app**. You write the real Java and XML yourself, press **Check**, and see which requirements your code meets.

It covers the three things the test asks for:

1. **The `Movie` class**: fields, `Serializable`, constructors, getters and setters.
2. **Validation of the variables used by `saveMovie()`**.
3. **Deleting a movie**: a button, a confirmation dialog, then a Snackbar with **UNDO** that restores the movie.

The exercises are based on the `G1098-14.11.2026(week7-full)` project (`MainActivity`, `ItemActivity`, `MovieAdapter`, `IMovieListener`, `Movie`), so class, field and ID names match the code you work with in class.

## Run it

- **Online:** open the GitHub Pages link of this repository (Settings > Pages > Deploy from a branch > `main` / root, if it is not enabled yet).
- **Offline:** download `index.html` and open it in any browser. It is a single static file with no build step and no dependencies. Without internet it only falls back to your system fonts.

## What the lab contains

The page has three tabs.

### 1. Code lab (12 exercises)

You get an editor with a starter, write the code, and press **Check my code**.

| # | Group | Exercise | File |
|---|---|---|---|
| 1 | A. Movie class | Declare the class and its 10 fields (`Serializable`, empty constructor) | `Movie.java` |
| 2 | A. Movie class | The 10-argument constructor | `Movie.java` |
| 3 | A. Movie class | Getters and setters, including the `is...()` booleans | `Movie.java` |
| 4 | B. Validation | `validateForm()` part 1: title, release date, budget | `ItemActivity.java` |
| 5 | B. Validation | `validateForm()` part 2: duration, rating, approval, poster | `ItemActivity.java` |
| 6 | B. Validation | Call it from `saveMovie()` and fix the edit-date bug | `ItemActivity.java` |
| 7 | C. Delete + Undo | Delete `ImageButton` in the row layout | `movie_item.xml` |
| 8 | C. Delete + Undo | Add `onMovieDelete` to the listener interface | `IMovieListener.java` |
| 9 | C. Delete + Undo | Wire the button in the `ViewHolder` | `MovieAdapter.java` |
| 10 | C. Delete + Undo | Confirmation `AlertDialog` | `MainActivity.java` |
| 11 | C. Delete + Undo | `deleteWithUndo()`: remove, Snackbar, UNDO | `MainActivity.java` |
| 12 | C. Delete + Undo | Option B: delete button on the edit form (custom result code) | `ItemActivity` + `MainActivity` |

Features of the code lab:

- **Real editor:** monospace textarea, Tab inserts 4 spaces, Enter keeps the indentation and indents after `{`.
- **Check my code:** lists every requirement of the exercise with a green tick or a red cross, plus a summary such as "5 of 7 requirements met".
- **Bonus checks:** some exercises have optional extras (for example `Math.min` on the UNDO index) that show up but do not block "solved".
- **Hint:** a one-line nudge without the full answer.
- **Show solution:** reveals the reference solution with a Copy button. It does not overwrite your code.
- **Reset exercise:** brings back the starter.
- **Progress:** a bar and status dots (not tried, partial, solved) for each exercise. Your code and progress are saved in your own browser (`localStorage`), so you can close the page and continue later.
- **Previous / Next** buttons and a left rail grouped by topic.

### 2. Quick fire (12 questions)

Multiple-choice concept questions the examiner may ask you to explain, for example why `Movie` is `Serializable`, why `getAbsoluteAdapterPosition()` is used, what `getCheckedRadioButtonId()` returns when nothing is checked, and why UNDO restores the movie at its original index. Every answer shows a short explanation. You can retake the set.

### 3. Cheat sheet

Everything in one place, each code block with a **Copy** button:

- an exam plan (what to do first, how to order the work)
- a table mapping each form widget to the value you read and how to report a problem
- the imports you need
- the full `Movie` class, validation code, delete + undo code and the Option B variant
- the known bugs worth fixing (empty budget crash, edit-date reset, missing `Animation` genre)
- a table of common compile and runtime mistakes

## Getting a real review

The checker is **not a compiler**. It removes comments and extra whitespace, then matches each requirement against patterns (for example "uses `getAbsoluteAdapterPosition()`" or "`catch (NumberFormatException ...)`"). It accepts both lambdas and anonymous classes, and different valid styles for refreshing the adapter, but an unusual valid solution can still be marked wrong, and code that passes every pattern is not guaranteed to compile.

Use **Copy all my answers** at the bottom of the page. It copies all 12 answers with the checker score of each, ready to paste into a chat with Claude for a line-by-line review.

## Repository structure

```
index.html          the whole lab, built from src/ (this is the file you open or host)
src/data.js         exercises, checks, solutions, quick-fire questions, cheat sheet
src/template.html   page layout, styles and behaviour
build.py            builds index.html from src/
.nojekyll           tells GitHub Pages to serve the files as they are
```

### Editing the lab

1. Change exercises, checks, questions or the cheat sheet in `src/data.js`. Each exercise has `title`, `file`, `prompt`, `starter`, `hint`, `checks` and `solution`. A check is `{ label, test }`, where `test` receives the normalized code (comments removed, whitespace collapsed) and returns true or false. Add `optional: true` for a bonus check.
2. Change layout or behaviour in `src/template.html`.
3. Run `python3 build.py` to regenerate `index.html`.

## Source of the exercises

Exercises follow the Movie app from the group repository `dma2026-adnotat`, folder `G1098-14.11.2026(week7-full)`.
