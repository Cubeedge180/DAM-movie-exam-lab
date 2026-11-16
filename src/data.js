/* ===== EXERCISE DATA (graded by pattern rules on comment-stripped, whitespace-collapsed code) ===== */
function norm(code) {
  return code
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\/\/.*$/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const re = (rx) => (c) => rx.test(c);
const count = (rx) => (c) => (c.match(rx) || []).length;

const MOVIE_FIELDS = ["title", "release", "genre", "budget", "duration", "rating", "watched", "approval", "onWatchlist", "posterUrl"];

const SOL = {};

SOL.fields = `package com.example.group1098.model;

import java.io.Serializable;
import java.util.Date;

public class Movie implements Serializable {
    private String title;
    private Date release;
    private String genre;
    private double budget;
    private int duration;
    private float rating;
    private boolean watched;
    private String approval;
    private boolean onWatchlist;
    private String posterUrl;

    public Movie() {
    }
}`;

SOL.ctor = `public Movie(String title, Date release, String genre, double budget, int duration,
             float rating, boolean watched, String approval, boolean onWatchlist, String posterUrl) {
    this.title = title;
    this.release = release;
    this.genre = genre;
    this.budget = budget;
    this.duration = duration;
    this.rating = rating;
    this.watched = watched;
    this.approval = approval;
    this.onWatchlist = onWatchlist;
    this.posterUrl = posterUrl;
}`;

SOL.accessors = `public String getTitle() {
    return title;
}

public void setTitle(String title) {
    this.title = title;
}

public double getBudget() {
    return budget;
}

public void setRating(float rating) {
    this.rating = rating;
}

public boolean isWatched() {
    return watched;
}

public void setWatched(boolean watched) {
    this.watched = watched;
}

public boolean isOnWatchlist() {
    return onWatchlist;
}`;

SOL.val1 = `private boolean validateForm() {
    // 1. title
    String title = etTitle.getText().toString().trim();
    if (title.isEmpty()) {
        etTitle.setError("Title is required");
        etTitle.requestFocus();
        return false;
    }
    if (title.length() < 2) {
        etTitle.setError("Title must have at least 2 characters");
        etTitle.requestFocus();
        return false;
    }

    // 2. release date
    if (etRelease.getText().toString().trim().isEmpty()) {
        etRelease.setError("Pick a release date");
        etRelease.requestFocus();
        return false;
    }

    // 3. budget
    String budgetText = etBudget.getText().toString().trim();
    if (budgetText.isEmpty()) {
        etBudget.setError("Budget is required");
        etBudget.requestFocus();
        return false;
    }
    try {
        double budget = Double.parseDouble(budgetText);
        if (budget <= 0) {
            etBudget.setError("Budget must be greater than 0");
            etBudget.requestFocus();
            return false;
        }
    } catch (NumberFormatException e) {
        etBudget.setError("Budget is not a valid number");
        etBudget.requestFocus();
        return false;
    }

    return true;
}`;

SOL.val2 = `    // 4. duration (SeekBar has no setError -> Toast)
    if (sbDuration.getProgress() == 0) {
        Toast.makeText(this, "Duration must be greater than 0 min", Toast.LENGTH_SHORT).show();
        return false;
    }

    // 5. rating
    if (rbRating.getRating() == 0f) {
        Toast.makeText(this, "Give the movie a rating", Toast.LENGTH_SHORT).show();
        return false;
    }

    // 6. approval (-1 = nothing checked)
    if (rgApproval.getCheckedRadioButtonId() == -1) {
        Toast.makeText(this, "Choose a guidance rating", Toast.LENGTH_SHORT).show();
        return false;
    }

    // 7. poster: optional, but if filled it must be a URL
    String poster = etPoster.getText().toString().trim();
    if (!poster.isEmpty() && !Patterns.WEB_URL.matcher(poster).matches()) {
        etPoster.setError("Enter a valid URL");
        etPoster.requestFocus();
        return false;
    }

    return true;
}`;

SOL.hook = `private void saveMovie() {
    if (!validateForm()) {
        return;
    }
    Movie movie = new Movie();
    // ... rest unchanged ...
}

// inside fillForm(Movie existing):
releaseCal.setTime(existing.getRelease());`;

SOL.xml = `<ImageButton
    android:id="@+id/btnDeleteMovie"
    android:layout_width="48dp"
    android:layout_height="48dp"
    android:background="?attr/selectableItemBackgroundBorderless"
    android:contentDescription="Delete movie"
    android:src="@android:drawable/ic_menu_delete" />`;

SOL.iface = `package com.example.group1098.adapter;

import com.example.group1098.model.Movie;

public interface IMovieListener {
    void onMovieClick(Movie movie, int position);

    void onMovieDelete(Movie movie, int position);
}`;

SOL.holder = `class MovieViewHolder extends RecyclerView.ViewHolder {
    final ImageView poster;
    final TextView title;
    final ImageButton btnDelete;

    public MovieViewHolder(@NonNull View itemView) {
        super(itemView);
        poster = itemView.findViewById(R.id.moviePoster);
        title = itemView.findViewById(R.id.movieTitle);
        btnDelete = itemView.findViewById(R.id.btnDeleteMovie);

        btnDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                int pos = getAbsoluteAdapterPosition();
                if (pos != RecyclerView.NO_POSITION) {
                    listener.onMovieDelete(movies.get(pos), pos);
                }
            }
        });
    }
}`;

SOL.dialog = `@Override
public void onMovieDelete(Movie movie, int position) {
    new AlertDialog.Builder(this)
            .setTitle("Delete movie")
            .setMessage("Do you want to delete " + movie.getTitle() + "?")
            .setPositiveButton("Delete", (dialog, which) -> deleteWithUndo(position))
            .setNegativeButton("Cancel", null)
            .show();
}`;

SOL.undo = `private void deleteWithUndo(int position) {
    final Movie removed = movies.remove(position);
    movieAdapter.notifyDataSetChanged();

    Snackbar.make(rvMovies, "Movie deleted", Snackbar.LENGTH_LONG)
            .setAnchorView(fabInsert)
            .setAction("UNDO", v -> {
                int index = Math.min(position, movies.size());
                movies.add(index, removed);
                movieAdapter.notifyDataSetChanged();
                rvMovies.scrollToPosition(index);
            })
            .show();
}`;

SOL.optB = `// ItemActivity.java
public static final int RESULT_DELETE = RESULT_FIRST_USER;

// ItemActivity: inside the dialog's positive button
Intent intent = new Intent();
intent.putExtra(MainActivity.POSITION_EXTRA, position);
setResult(RESULT_DELETE, intent);
finish();

// MainActivity: inside onActivityResult(ActivityResult o)
if (o.getResultCode() == RESULT_OK) {
    // ... existing add / edit code ...
} else if (o.getResultCode() == ItemActivity.RESULT_DELETE) {
    int position = o.getData().getIntExtra(POSITION_EXTRA, -1);
    if (position != -1) {
        deleteWithUndo(position);
    }
}`;

const EXERCISES = [
  /* ---------------- A. MOVIE ---------------- */
  {
    id: "fields", group: "A. Movie class", title: "Declare the Movie class and its fields",
    file: "model/Movie.java",
    prompt: "Write the whole file. The class must travel inside an Intent, so pick the right interface. It has 10 private fields (title, release, genre, budget, duration, rating, watched, approval, onWatchlist, posterUrl) and an empty constructor. Choose the right type for each field.",
    starter: `package com.example.group1098.model;

// TODO: imports

// TODO: class declaration

    // TODO: 10 private fields

    // TODO: empty constructor

}`,
    hint: "Types: String, Date, String, double, int, float, boolean, String, boolean, String. The empty constructor is used by saveMovie() in ItemActivity.",
    checks: [
      { label: "Class is public and implements Serializable", test: re(/public\s+class\s+Movie\s+implements\s+(java\.io\.)?Serializable/) },
      { label: "Imports Serializable and Date", test: (c) => (/import\s+java\.io\.Serializable\s*;/.test(c) || /implements\s+java\.io\.Serializable/.test(c)) && (/import\s+java\.util\.Date\s*;/.test(c) || /private\s+java\.util\.Date\s+release/.test(c)) },
      { label: "String fields: title, genre, approval, posterUrl (private)", test: (c) => ["title", "genre", "approval", "posterUrl"].every((f) => new RegExp("private\\s+String\\s+" + f + "\\s*;").test(c)) },
      { label: "private Date release", test: re(/private\s+(java\.util\.)?Date\s+release\s*;/) },
      { label: "budget is double, duration is int, rating is float", test: (c) => /private\s+double\s+budget\s*;/.test(c) && /private\s+int\s+duration\s*;/.test(c) && /private\s+float\s+rating\s*;/.test(c) },
      { label: "watched and onWatchlist are boolean", test: (c) => /private\s+boolean\s+watched\s*;/.test(c) && /private\s+boolean\s+onWatchlist\s*;/.test(c) },
      { label: "Empty public constructor Movie()", test: re(/public\s+Movie\s*\(\s*\)\s*\{\s*\}/) },
    ],
    solution: SOL.fields,
  },
  {
    id: "ctor", group: "A. Movie class", title: "Write the 10-argument constructor",
    file: "model/Movie.java",
    prompt: "Add the full constructor used by addSampleMovies(). The parameter order must match the field order shown in the starter. Assign every parameter to its field with this.",
    starter: `public class Movie implements Serializable {
    private String title;
    private Date release;
    private String genre;
    private double budget;
    private int duration;
    private float rating;
    private boolean watched;
    private String approval;
    private boolean onWatchlist;
    private String posterUrl;

    // TODO: constructor with all 10 parameters, in this order

}`,
    hint: "this.title = title; ... ten times. In Android Studio: Cmd+N > Constructor > select all fields.",
    checks: [
      { label: "Signature: (String, Date, String, double, int, float, boolean, String, boolean, String) with the right names", test: re(/public\s+Movie\s*\(\s*String\s+title\s*,\s*Date\s+release\s*,\s*String\s+genre\s*,\s*double\s+budget\s*,\s*int\s+duration\s*,\s*float\s+rating\s*,\s*boolean\s+watched\s*,\s*String\s+approval\s*,\s*boolean\s+onWatchlist\s*,\s*String\s+posterUrl\s*\)/) },
      { label: "All 10 assignments this.x = x;", test: (c) => MOVIE_FIELDS.every((f) => new RegExp("this\\." + f + "\\s*=\\s*" + f + "\\s*;").test(c)) },
    ],
    solution: SOL.ctor,
  },
  {
    id: "accessors", group: "A. Movie class", title: "Getters and setters (watch the boolean ones)",
    file: "model/Movie.java",
    prompt: "Write these 7 methods: getTitle, setTitle, getBudget, setRating, isWatched, setWatched, isOnWatchlist. Booleans do not use the get prefix.",
    starter: `// fields: title (String), budget (double), rating (float),
//         watched (boolean), onWatchlist (boolean)

// TODO: getTitle, setTitle
// TODO: getBudget
// TODO: setRating
// TODO: isWatched, setWatched
// TODO: isOnWatchlist
`,
    hint: "isWatched() returns boolean. Setters are void and use this.field = field.",
    checks: [
      { label: "public String getTitle() { return title; }", test: re(/public\s+String\s+getTitle\s*\(\s*\)\s*\{\s*return\s+(this\.)?title\s*;\s*\}/) },
      { label: "public void setTitle(String title) with this.title = title", test: re(/public\s+void\s+setTitle\s*\(\s*String\s+title\s*\)\s*\{\s*this\.title\s*=\s*title\s*;\s*\}/) },
      { label: "public double getBudget()", test: re(/public\s+double\s+getBudget\s*\(\s*\)\s*\{\s*return\s+(this\.)?budget\s*;\s*\}/) },
      { label: "public void setRating(float rating)", test: re(/public\s+void\s+setRating\s*\(\s*float\s+rating\s*\)\s*\{\s*this\.rating\s*=\s*rating\s*;\s*\}/) },
      { label: "public boolean isWatched()", test: re(/public\s+boolean\s+isWatched\s*\(\s*\)\s*\{\s*return\s+(this\.)?watched\s*;\s*\}/) },
      { label: "public void setWatched(boolean watched)", test: re(/public\s+void\s+setWatched\s*\(\s*boolean\s+watched\s*\)\s*\{\s*this\.watched\s*=\s*watched\s*;\s*\}/) },
      { label: "public boolean isOnWatchlist()", test: re(/public\s+boolean\s+isOnWatchlist\s*\(\s*\)\s*\{\s*return\s+(this\.)?onWatchlist\s*;\s*\}/) },
    ],
    solution: SOL.accessors,
  },

  /* ---------------- B. VALIDATION ---------------- */
  {
    id: "val1", group: "B. Validation", title: "validateForm(): title, release date, budget",
    file: "activities/ItemActivity.java",
    prompt: "Write validateForm() so it returns false when: the title is empty after trim() or shorter than 2 characters; the release date field is empty; the budget is empty, not a number (use try/catch), or not greater than 0. Show the message with setError on the right field and call requestFocus(). End with return true. Fields available: etTitle, etRelease, etBudget.",
    starter: `private boolean validateForm() {
    // 1. title: required (trim), at least 2 characters
    // 2. release date: etRelease must not be empty
    // 3. budget: required, valid number, > 0

    return true;
}`,
    hint: "Double.parseDouble throws NumberFormatException on bad text, so wrap it in try/catch. Check the empty case before parsing.",
    checks: [
      { label: "private boolean validateForm()", test: re(/boolean\s+validateForm\s*\(\s*\)/) },
      { label: "Title read with getText().toString().trim()", test: re(/etTitle\.getText\(\)\.toString\(\)\.trim\(\)/) },
      { label: "Title empty check and setError on etTitle", test: (c) => /\.isEmpty\(\)/.test(c) && /etTitle\.setError\s*\(/.test(c) },
      { label: "Title minimum length (length() < 2)", test: re(/length\(\)\s*<\s*2/) },
      { label: "Release date empty check with setError on etRelease", test: (c) => /etRelease\.getText\(\)\.toString\(\)(\.trim\(\))?\.isEmpty\(\)/.test(c) && /etRelease\.setError\s*\(/.test(c) },
      { label: "Budget parsed with Double.parseDouble inside try", test: re(/try\s*\{[^}]*Double\.parseDouble\s*\(/) },
      { label: "catch (NumberFormatException ...)", test: re(/catch\s*\(\s*NumberFormatException/) },
      { label: "Budget must be > 0 (<= 0 rejected) and setError on etBudget", test: (c) => /<=\s*0/.test(c) && /etBudget\.setError\s*\(/.test(c) },
      { label: "requestFocus() used", test: re(/requestFocus\s*\(\s*\)/) },
      { label: "At least 5 failing branches return false, and the method ends with return true", test: (c) => (c.match(/return\s+false\s*;/g) || []).length >= 5 && /return\s+true\s*;\s*\}\s*$/.test(c) },
    ],
    solution: SOL.val1,
  },
  {
    id: "val2", group: "B. Validation", title: "validateForm(): duration, rating, approval, poster",
    file: "activities/ItemActivity.java",
    prompt: "Finish the second half of validateForm(). SeekBar and RatingBar have no setError, so use a Toast. Reject duration 0 and rating 0. Reject a RadioGroup with nothing checked. The poster is optional, but if it is not empty it must match Patterns.WEB_URL (setError). End with return true and close the method.",
    starter: `    // ... title, release and budget checks are above ...

    // 4. duration > 0 (sbDuration)
    // 5. rating > 0 (rbRating)
    // 6. one approval option checked (rgApproval)
    // 7. poster optional, but must be a URL if filled (etPoster)

    return true;
}`,
    hint: "rgApproval.getCheckedRadioButtonId() returns -1 when nothing is checked. Patterns.WEB_URL.matcher(text).matches().",
    checks: [
      { label: "Duration: sbDuration.getProgress() compared with 0", test: re(/sbDuration\.getProgress\(\)\s*(==|<=|<)\s*[01]/) },
      { label: "Rating: rbRating.getRating() compared with 0", test: re(/rbRating\.getRating\(\)\s*(==|<=|<)\s*[0-9.]+f?/) },
      { label: "Toast.makeText(...).show() used for SeekBar/RatingBar/RadioGroup messages", test: (c) => (c.match(/Toast\.makeText\s*\(/g) || []).length >= 3 && /\.show\s*\(\s*\)/.test(c) },
      { label: "Approval: rgApproval.getCheckedRadioButtonId() == -1", test: re(/rgApproval\.getCheckedRadioButtonId\s*\(\s*\)\s*==\s*-1/) },
      { label: "Poster validated with Patterns.WEB_URL.matcher(...).matches()", test: re(/Patterns\.WEB_URL\.matcher\s*\([^)]*\)\s*\.matches\s*\(\s*\)/) },
      { label: "Poster is optional (checks !isEmpty()) and uses etPoster.setError", test: (c) => /!\s*\w+\.isEmpty\s*\(\s*\)/.test(c) && /etPoster\.setError\s*\(/.test(c) },
      { label: "4 failing branches return false; ends with return true }", test: (c) => (c.match(/return\s+false\s*;/g) || []).length >= 4 && /return\s+true\s*;\s*\}\s*$/.test(c) },
    ],
    solution: SOL.val2,
  },
  {
    id: "hook", group: "B. Validation", title: "Call it from saveMovie() and fix the edit-date bug",
    file: "activities/ItemActivity.java",
    prompt: "1) Make saveMovie() stop immediately when the form is invalid (before it builds the Movie). 2) In fillForm(), copy the existing movie's release date into releaseCal so editing without touching the date keeps the original date.",
    starter: `private void saveMovie() {
    // TODO: stop here if the form is invalid

    Movie movie = new Movie();
    movie.setTitle(etTitle.getText().toString());
    // ... rest unchanged ...
}

// inside fillForm(Movie existing):
// TODO: keep the real release date in releaseCal
`,
    hint: "if (!validateForm()) { return; }  and  releaseCal.setTime(existing.getRelease());",
    checks: [
      { label: "if (!validateForm()) return;", test: re(/if\s*\(\s*!\s*validateForm\s*\(\s*\)\s*\)\s*\{?\s*return\s*;/) },
      { label: "The validation comes before new Movie()", test: (c) => { const a = c.search(/validateForm\s*\(/); const b = c.search(/new\s+Movie\s*\(/); return a !== -1 && b !== -1 && a < b; } },
      { label: "releaseCal.setTime(existing.getRelease());", test: re(/releaseCal\.setTime\s*\(\s*existing\.getRelease\s*\(\s*\)\s*\)\s*;/) },
    ],
    solution: SOL.hook,
  },

  /* ---------------- C. DELETE + UNDO ---------------- */
  {
    id: "xml", group: "C. Delete + Undo", title: "Delete button in the row layout",
    file: "res/layout/movie_item.xml",
    prompt: "Write the ImageButton you add as the last child of the outer horizontal LinearLayout. Give it the id btnDeleteMovie, a 48dp size, the built-in delete icon and a content description.",
    starter: `<!-- TODO: ImageButton -->`,
    hint: "The framework icon is @android:drawable/ic_menu_delete. Use android:id=\"@+id/...\" to create the id.",
    checks: [
      { label: "An <ImageButton ... /> element", test: re(/<ImageButton[\s\S]*\/>|<ImageButton[\s\S]*<\/ImageButton>/) },
      { label: "android:id=\"@+id/btnDeleteMovie\"", test: re(/android:id\s*=\s*"@\+id\/btnDeleteMovie"/) },
      { label: "android:src=\"@android:drawable/ic_menu_delete\"", test: re(/android:src\s*=\s*"@android:drawable\/ic_menu_delete"/) },
      { label: "android:contentDescription is set", test: re(/android:contentDescription\s*=\s*"[^"]+"/) },
      { label: "layout_width and layout_height are set", test: (c) => /android:layout_width\s*=\s*"[^"]+"/.test(c) && /android:layout_height\s*=\s*"[^"]+"/.test(c) },
    ],
    solution: SOL.xml,
  },
  {
    id: "iface", group: "C. Delete + Undo", title: "Extend the listener interface",
    file: "adapter/IMovieListener.java",
    prompt: "Rewrite the interface so the row can report a delete request. Keep the existing click method.",
    starter: `package com.example.group1098.adapter;

import com.example.group1098.model.Movie;

public interface IMovieListener {
    void onMovieClick(Movie movie, int position);

    // TODO: delete callback
}`,
    hint: "Same shape as onMovieClick: a Movie and an int position. Interface methods have no body.",
    checks: [
      { label: "Still declares onMovieClick(Movie, int)", test: re(/void\s+onMovieClick\s*\(\s*Movie\s+\w+\s*,\s*int\s+\w+\s*\)\s*;/) },
      { label: "Declares void onMovieDelete(Movie movie, int position);", test: re(/void\s+onMovieDelete\s*\(\s*Movie\s+\w+\s*,\s*int\s+\w+\s*\)\s*;/) },
      { label: "It is still an interface", test: re(/public\s+interface\s+IMovieListener/) },
    ],
    solution: SOL.iface,
  },
  {
    id: "holder", group: "C. Delete + Undo", title: "Wire the button in the ViewHolder",
    file: "adapter/MovieAdapter.java",
    prompt: "Add a delete button field, find it with findViewById in the constructor, and on click tell the listener which movie to delete. Use the live adapter position and guard against NO_POSITION, exactly like the existing row click.",
    starter: `class MovieViewHolder extends RecyclerView.ViewHolder {
    final ImageView poster;
    final TextView title;
    // TODO: delete button field

    public MovieViewHolder(@NonNull View itemView) {
        super(itemView);
        poster = itemView.findViewById(R.id.moviePoster);
        title = itemView.findViewById(R.id.movieTitle);
        // TODO: find the button and set its click listener
    }
}`,
    hint: "int pos = getAbsoluteAdapterPosition(); if (pos != RecyclerView.NO_POSITION) { listener.onMovieDelete(movies.get(pos), pos); }",
    checks: [
      { label: "Field: ImageButton btnDelete", test: re(/ImageButton\s+btnDelete\s*;/) },
      { label: "btnDelete = itemView.findViewById(R.id.btnDeleteMovie)", test: re(/btnDelete\s*=\s*itemView\.findViewById\s*\(\s*R\.id\.btnDeleteMovie\s*\)/) },
      { label: "btnDelete.setOnClickListener(...)", test: re(/btnDelete\.setOnClickListener\s*\(/) },
      { label: "Uses getAbsoluteAdapterPosition() (not a stored position)", test: re(/get(Absolute|Binding)?AdapterPosition\s*\(\s*\)/) },
      { label: "Guards with RecyclerView.NO_POSITION", test: re(/NO_POSITION/) },
      { label: "Calls listener.onMovieDelete(movies.get(pos), pos)", test: re(/listener\.onMovieDelete\s*\(\s*movies\.get\s*\(\s*\w+\s*\)\s*,\s*\w+\s*\)/) },
    ],
    solution: SOL.holder,
  },
  {
    id: "dialog", group: "C. Delete + Undo", title: "Confirmation dialog in MainActivity",
    file: "activities/MainActivity.java",
    prompt: "Implement onMovieDelete. Show an AlertDialog with a title, a message that contains the movie title, a Delete button that calls deleteWithUndo(position), and a Cancel button that does nothing. Do NOT remove the movie here: removal happens only after confirmation, inside deleteWithUndo.",
    starter: `// imports needed: androidx.appcompat.app.AlertDialog

@Override
public void onMovieDelete(Movie movie, int position) {
    // TODO: build and show the dialog
}`,
    hint: "new AlertDialog.Builder(this).setTitle(...).setMessage(...).setPositiveButton(\"Delete\", (dialog, which) -> ...).setNegativeButton(\"Cancel\", null).show();",
    checks: [
      { label: "@Override public void onMovieDelete(Movie movie, int position)", test: re(/public\s+void\s+onMovieDelete\s*\(\s*(final\s+)?Movie\s+\w+\s*,\s*(final\s+)?int\s+\w+\s*\)/) },
      { label: "new AlertDialog.Builder(this or MainActivity.this)", test: re(/new\s+AlertDialog\.Builder\s*\(\s*(this|MainActivity\.this)\s*\)/) },
      { label: "setTitle(...) and setMessage(...)", test: (c) => /\.setTitle\s*\(/.test(c) && /\.setMessage\s*\(/.test(c) },
      { label: "Message includes movie.getTitle()", test: re(/setMessage\s*\([^;]*getTitle\s*\(\s*\)/) },
      { label: "setPositiveButton(...) calls deleteWithUndo(position)", test: re(/setPositiveButton\s*\([\s\S]*deleteWithUndo\s*\(\s*\w+\s*\)/) },
      { label: "setNegativeButton(...) exists (Cancel)", test: re(/setNegativeButton\s*\(/) },
      { label: ".show() is called", test: re(/\.show\s*\(\s*\)\s*;\s*\}\s*$/) },
      { label: "The movie is NOT removed before the user confirms", test: (c) => !/movies\.remove\s*\(/.test(c) },
    ],
    solution: SOL.dialog,
  },
  {
    id: "undo", group: "C. Delete + Undo", title: "deleteWithUndo(): remove, Snackbar, UNDO",
    file: "activities/MainActivity.java",
    prompt: "Write deleteWithUndo(int position). Remove the movie and keep the removed object, refresh the adapter, then show a Snackbar on rvMovies with an UNDO action. UNDO puts the same movie back at the same index (never past the end of the list) and refreshes again.",
    starter: `// imports needed: com.google.android.material.snackbar.Snackbar
// fields available: movies (ArrayList<Movie>), movieAdapter, rvMovies, fabInsert

private void deleteWithUndo(int position) {
    // TODO 1: remove the movie and keep it
    // TODO 2: refresh the list
    // TODO 3: Snackbar with an UNDO action that restores it
}`,
    hint: "ArrayList.remove(int) returns the removed element. The lambda can capture it if it is final or effectively final. Restore with movies.add(index, removed).",
    checks: [
      { label: "Movie removed = movies.remove(position);", test: re(/Movie\s+\w+\s*=\s*movies\.remove\s*\(\s*\w+\s*\)\s*;/) },
      { label: "Adapter refreshed after removing", test: re(/notify(DataSetChanged|ItemRemoved)\s*\(/) },
      { label: "Snackbar.make(view, text, LENGTH_...)", test: re(/Snackbar\.make\s*\(\s*\w+\s*,[^;]*Snackbar\.LENGTH_(LONG|SHORT|INDEFINITE)/) },
      { label: ".setAction(\"UNDO\", ...)", test: re(/\.setAction\s*\(\s*"UNDO"/i) },
      { label: "UNDO re-inserts with movies.add(index, removed) (two arguments)", test: re(/movies\.add\s*\(\s*[^;,]+,\s*\w+\s*\)\s*;/) },
      { label: "Adapter refreshed after re-inserting", test: re(/movies\.add\s*\([^;]*;\s*(\w+\.)?notify(DataSetChanged|ItemInserted)\s*\(/) },
      { label: ".show() on the Snackbar", test: re(/\.show\s*\(\s*\)\s*;\s*\}\s*$/) },
      { label: "Bonus: clamps the index with Math.min(position, movies.size())", optional: true, test: re(/Math\.min\s*\(/) },
      { label: "Bonus: anchors the Snackbar above the FAB with setAnchorView(fabInsert)", optional: true, test: re(/setAnchorView\s*\(\s*fabInsert\s*\)/) },
    ],
    solution: SOL.undo,
  },
  {
    id: "optB", group: "C. Delete + Undo", title: "Option B: delete from the edit form",
    file: "ItemActivity + MainActivity",
    prompt: "Only if the exam puts the delete button on the edit screen. Declare a custom result code in ItemActivity, return it with the position when the user confirms, and handle it in the launcher callback in MainActivity by calling deleteWithUndo.",
    starter: `// ItemActivity.java
// TODO: custom result code constant (use RESULT_FIRST_USER)

// ItemActivity: inside the dialog's positive button
// TODO: put the position in an Intent, setResult with the custom code, finish

// MainActivity: inside onActivityResult(ActivityResult o)
if (o.getResultCode() == RESULT_OK) {
    // ... existing add / edit code ...
}
// TODO: handle the delete result
`,
    hint: "public static final int RESULT_DELETE = RESULT_FIRST_USER;  then  else if (o.getResultCode() == ItemActivity.RESULT_DELETE) { ... }",
    checks: [
      { label: "public static final int RESULT_DELETE = RESULT_FIRST_USER;", test: re(/public\s+static\s+final\s+int\s+RESULT_DELETE\s*=\s*RESULT_FIRST_USER\s*;/) },
      { label: "Intent carries MainActivity.POSITION_EXTRA with position", test: re(/putExtra\s*\(\s*MainActivity\.POSITION_EXTRA\s*,\s*position\s*\)/) },
      { label: "setResult(RESULT_DELETE, intent) then finish()", test: re(/setResult\s*\(\s*RESULT_DELETE\s*,\s*\w+\s*\)\s*;\s*finish\s*\(\s*\)/) },
      { label: "MainActivity checks getResultCode() == ItemActivity.RESULT_DELETE", test: re(/getResultCode\s*\(\s*\)\s*==\s*ItemActivity\.RESULT_DELETE/) },
      { label: "Reads the position: getIntExtra(POSITION_EXTRA, -1)", test: re(/getIntExtra\s*\(\s*POSITION_EXTRA\s*,\s*-1\s*\)/) },
      { label: "Calls deleteWithUndo(position)", test: re(/deleteWithUndo\s*\(\s*\w+\s*\)/) },
    ],
    solution: SOL.optB,
  },
];

const QUICKFIRE = [
  { q: "Why does Movie implement Serializable?", opts: ["So it can be stored in a Room database", "So it can be passed in an Intent with putExtra / getSerializableExtra", "So RecyclerView can display it", "So its fields become immutable"], a: 1, why: "Intent extras only accept Parcelable, Serializable or primitive types. Without Serializable, putExtra(MOVIE_EXTRA, movie) does not compile." },
  { q: "What is the correct getter name for the boolean field watched?", opts: ["getWatched()", "isWatched()", "hasWatched()", "watched()"], a: 1, why: "Boolean getters use the is prefix: isWatched(), isOnWatchlist()." },
  { q: "Which call returns the row position inside a ViewHolder click listener?", opts: ["The position parameter of onBindViewHolder, saved in a field", "getAbsoluteAdapterPosition()", "getItemCount()", "rvMovies.getChildCount()"], a: 1, why: "A saved bind-time position can go stale. getAbsoluteAdapterPosition() is live; always compare it with RecyclerView.NO_POSITION." },
  { q: "Double.parseDouble(\"\") on an empty EditText does what?", opts: ["Returns 0.0", "Returns null", "Throws NumberFormatException", "Throws NullPointerException"], a: 2, why: "That is the crash in the current saveMovie(). Check isEmpty() first and wrap parsing in try/catch." },
  { q: "A SeekBar has no setError(). How do you report a bad duration?", opts: ["Toast (or Snackbar)", "seekBar.setError()", "Throw an exception", "Change the title text"], a: 0, why: "Only EditText (and TextInputLayout) support setError. For SeekBar, RatingBar and RadioGroup use a Toast." },
  { q: "RadioGroup.getCheckedRadioButtonId() returns what when nothing is selected?", opts: ["0", "null", "-1", "The first button's id"], a: 2, why: "It returns -1. In this layout G is checked by default, but the check is still the correct pattern." },
  { q: "Where must the Snackbar with UNDO be shown if the delete button is on the ItemActivity form?", opts: ["In ItemActivity before finish()", "In MainActivity, after the result comes back", "In the adapter", "In the Manifest"], a: 1, why: "ItemActivity closes with finish(), so a Snackbar shown there disappears. Return a custom result code and show it from MainActivity." },
  { q: "In setNegativeButton(\"Cancel\", null), what does null mean?", opts: ["The button is disabled", "No extra action: the dialog just closes", "The app crashes", "It behaves like the positive button"], a: 1, why: "A null listener means 'do nothing special'; the dialog still dismisses." },
  { q: "What does movies.remove(position) return when position is an int?", opts: ["boolean", "void", "The removed Movie", "The new size"], a: 2, why: "remove(int) returns the removed element. remove(Object) returns boolean. Keeping the returned Movie is the whole undo mechanism." },
  { q: "Why does UNDO call movies.add(index, removed) instead of movies.add(removed)?", opts: ["It is faster", "To put the movie back in the same place instead of at the end", "add(removed) does not exist", "To avoid refreshing the adapter"], a: 1, why: "The index restores the original order. Math.min(position, movies.size()) protects against an IndexOutOfBoundsException if the list shrank meanwhile." },
  { q: "Edit a movie but never touch the date. What is saved today, before the fix?", opts: ["The original date", "Today's date", "null", "The app crashes"], a: 1, why: "releaseCal starts as Calendar.getInstance() and fillForm only writes the text, not the calendar. Fix: releaseCal.setTime(existing.getRelease())." },
  { q: "Toy Story has genre \"Animation\" but the spinner array does not. What happens when you edit it?", opts: ["Crash", "The spinner stays on Drama and saving changes the genre", "The genre is kept", "The form refuses to open"], a: 1, why: "fillForm finds no match and leaves the first item selected. Add <item>Animation</item> to movie_genre in strings.xml." },
];

const CHEAT = [
  {
    title: "Exam plan (order matters)",
    kind: "list",
    items: [
      "1. Read Movie + ItemActivity. Say the widget-to-field mapping out loud.",
      "2. Validation first (10 min): validateForm() + the if (!validateForm()) return; line.",
      "3. Delete in this order, compile after each step: row XML button > IMovieListener > ViewHolder > MainActivity dialog + deleteWithUndo.",
      "4. Run the test checklist: add / edit / cancel / delete / undo / delete first, middle, last.",
      "5. Do not refactor anything the exam did not ask for.",
    ],
  },
  {
    title: "Widget to value (saveMovie)",
    kind: "table",
    head: ["Field", "Widget", "Read value", "Report a problem"],
    rows: [
      ["title", "etTitle", "etTitle.getText().toString().trim()", "etTitle.setError(\"...\")"],
      ["release", "etRelease", "releaseCal.getTime()  (text must not be empty)", "etRelease.setError(\"...\")"],
      ["genre", "spGenre", "spGenre.getSelectedItem().toString()", "n/a"],
      ["budget", "etBudget", "Double.parseDouble(text)  (try/catch)", "etBudget.setError(\"...\")"],
      ["duration", "sbDuration", "sbDuration.getProgress()", "Toast"],
      ["rating", "rbRating", "rbRating.getRating()", "Toast"],
      ["watched", "swWatched", "swWatched.isChecked()", "n/a"],
      ["onWatchlist", "cbonWatchList", "cbonWatchList.isChecked()", "n/a"],
      ["approval", "rgApproval", "loop children, RadioButton.isChecked(), getText()", "getCheckedRadioButtonId() == -1 > Toast"],
      ["posterUrl", "etPoster", "etPoster.getText().toString().trim()", "Patterns.WEB_URL > setError"],
    ],
  },
  { title: "Imports you will need", kind: "code", code: `// ItemActivity.java
import android.widget.Toast;
import android.util.Patterns;
import androidx.appcompat.app.AlertDialog;   // only for Option B

// MainActivity.java
import androidx.appcompat.app.AlertDialog;
import com.google.android.material.snackbar.Snackbar;

// MovieAdapter.java
import android.widget.ImageButton;

// Movie.java
import java.io.Serializable;
import java.util.Date;` },
  { title: "Movie.java: fields, constructors", kind: "code", code: SOL.fields + "\n\n" + SOL.ctor },
  { title: "Movie.java: getters and setters (pattern)", kind: "code", code: SOL.accessors + "\n\n// every field follows the same pattern; booleans use is...()" },
  { title: "Validation: part 1 (title, date, budget)", kind: "code", code: SOL.val1 },
  { title: "Validation: part 2 (continue inside the same method)", kind: "code", code: SOL.val2 },
  { title: "Hook + edit-date fix + genre fix", kind: "code", code: SOL.hook + "\n\n<!-- res/values/strings.xml, inside movie_genre -->\n<item>Animation</item>" },
  { title: "Delete step 1: row layout button (movie_item.xml)", kind: "code", code: SOL.xml },
  { title: "Delete step 2: interface", kind: "code", code: "// IMovieListener.java\nvoid onMovieDelete(Movie movie, int position);" },
  { title: "Delete step 3: ViewHolder wiring", kind: "code", code: SOL.holder },
  { title: "Delete step 4: dialog + deleteWithUndo (MainActivity)", kind: "code", code: SOL.dialog + "\n\n" + SOL.undo },
  { title: "Option B: button on the edit form", kind: "code", code: `<!-- activity_item.xml, after the Save button -->
<com.google.android.material.button.MaterialButton
    android:id="@+id/btnDeleteMovie"
    style="@style/Widget.Material3.Button.OutlinedButton"
    android:layout_width="match_parent"
    android:layout_height="60dp"
    android:layout_marginTop="12dp"
    android:text="Delete Movie"
    android:visibility="gone"
    app:cornerRadius="30dp" />

// ItemActivity.java
public static final int RESULT_DELETE = RESULT_FIRST_USER;
private Button btDelete;
// initControls():   btDelete = findViewById(R.id.btnDeleteMovie);
// onCreate(), inside if (existing != null):   btDelete.setVisibility(View.VISIBLE);
// initListeners():  dialog (same as above) whose positive button does:
//     Intent intent = new Intent();
//     intent.putExtra(MainActivity.POSITION_EXTRA, position);
//     setResult(RESULT_DELETE, intent);
//     finish();

// MainActivity.java: in onActivityResult
} else if (o.getResultCode() == ItemActivity.RESULT_DELETE) {
    int position = o.getData().getIntExtra(POSITION_EXTRA, -1);
    if (position != -1) {
        deleteWithUndo(position);
    }
}` },
  {
    title: "Common compile and runtime errors",
    kind: "table",
    head: ["Mistake", "What happens"],
    rows: [
      ["Added onMovieDelete to IMovieListener, forgot it in MainActivity", "MainActivity does not compile"],
      ["Removed the movie before the dialog was confirmed", "Cancel does not cancel"],
      ["Forgot .show() on AlertDialog or Snackbar", "Nothing appears"],
      ["movies.add(removed) on UNDO", "Movie returns at the end of the list"],
      ["Saved a bind-time position in the holder", "The wrong row is deleted"],
      ["Double.parseDouble without an empty check or try/catch", "NumberFormatException crash"],
      ["Missing import (Toast in ItemActivity, Snackbar, AlertDialog)", "Red symbol, does not compile"],
      ["Boolean getter named getWatched()", "Adapter and form code that call isWatched() break"],
      ["Added a field to Movie, forgot addSampleMovies()", "10-argument constructor calls no longer compile"],
    ],
  },
];
