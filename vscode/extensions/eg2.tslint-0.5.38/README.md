# vscode-tslint
Integrates the [tslint](https://github.com/palantir/tslint) linter for the TypeScript language into VS Code.

Please refer to the tslint [documentation](https://github.com/palantir/tslint) for how to configure the linting rules.

# Prerequisites
The extension requires that tslint is installed either locally or globally.

>Tip: if you get the error that "failed to load tslint", but you have tslint installed locally,
then try to install tslint and its typescript dependency globally using `npm install -g tslint typescript`.

# Configuration options

- `tslint.enable` - enable/disable tslint.
- `tslint.run` - run the linter `onSave` or `onType`, default is `onType`.
- `tslint.rulesDirectory` - an additional rules directory, for user-created rules.
- `tslint.configFile` - the configuration file that tslint should use instead of the default `tslint.json`.
- `tslint.ignoreDefinitionFiles` - control if TypeScript definition files should be ignored.
- `tslint.exclude` - configure glob patterns of file paths to exclude from linting.
- `tslint.validateWithDefaultConfig` - validate a file for which there was no custom tslint confguration found. The default is `false`.

# Quick fixes

The extension supports some quick fixing of warnings. For warnings which support a quick fix a light bulp is shown when the cursor is positioned inside the warning's range. You can apply the quick fix by either:
* clicking the light bulp appearing or by executing the `Quick Fix`, when the mouse is over the errornous code
* or using the command `Fix all auto-fixable problems`.

The following quick fixes are currently supported:
- missing whitespace
- missing semicolon
- missing trailing comma
- ' should be "
- " should be '
- trailing whitespace
- file should end with a newline
- forbidden 'var' keyword
- == should be ===
- Comment must start with a space

# Using the extension with tasks running tslint

The extension lints an individual file only. If you want to lint your entire workspace or project and want to see
the warnings in the `Problems` panel, then you can:
- use a task runner like gulp or grunt that runs tslint across the entire project
- define a VS Code [task](https://code.visualstudio.com/docs/editor/tasks) with a [problem matcher](https://code.visualstudio.com/docs/editor/tasks#_processing-task-output-with-problem-matchers)
that extracts VS Code warnings from the tslint output.

Here is an example. Create a gulp task using `gulp-tslint` that generates a report in a particular format that you can then match
with a problem matcher. In your `gulpfile.js` define a task like the one below, with a custom problem reporter:

```js
function reportFailures(failures) {
	failures.forEach(failure => {
		const name = failure.name || failure.fileName;
		const position = failure.startPosition;
		const line = position.lineAndCharacter ? position.lineAndCharacter.line : position.line;
		const character = position.lineAndCharacter ? position.lineAndCharacter.character : position.character;

		console.error(`${ name }:${ line + 1}:${ character + 1 }:${ failure.failure }`);
	});
}

gulp.task('tslint', () => {
	const options = { summarizeFailureOutput: true };

	return gulp.src(all, { base: '.' })
		.pipe(filter(tslintFilter))
		.pipe(gulptslint.report(reportFailures, options));
});
```

Next define a Task which runs the gulp task with a problem matcher that extracts the tslint errors into warnings.

```json
{
	"taskName": "tslint",
	"args": [],
	"problemMatcher": {
		"owner": "tslint",
		"fileLocation": [
			"relative",
			"${workspaceRoot}"
		],
		"severity": "warning",
		"pattern": {
			"regexp": "(.*):(\\d+):(\\d+):(.*)$",
			"file": 1,
			"line": 2,
			"column": 3,
			"message": 4
		}
	}
}
```
What is important is that you set the `owner` attribute to `tslint`. Then the warnings extracted by the
problem matcher go into the same collection as the warnings produced by this extension. In this way you will not see
duplicates.

Finally, when you then run the `tslint` tasks you will see the warning
produced by the gulp task in the `Problems` panel.

# Release Notes

## 0.5.38
- Warnings are now created into a diagnostic collection `tslint` this improves the integration
with tslint warnings generated by a [problem matcher](https://code.visualstudio.com/docs/editor/tasks#_processing-task-output-with-problem-matchers).

## 0.5.35
- Added a command `Fix all auto-fixable problems`.

## 0.5.34
- Add a setting to lint on save only.

## 0.5.33
- Only prompt for installing tslint, when the workspace root includes a `tslint.json` file.

## 0.5.32
- Clear errors when document is closed.

## 0.5.30
- More quick fixes.

## 0.5.25
- Add support for quick fixing some warnings.

## 0.5.23
- Updated to version 2.0 of the vscode language protocol.

## 0.5.21
- Added the setting `tslint.validateWithDefaultConfig`.

## 0.5.17
- Added setting `tslint.validateWithDefaultConfig`.
- Added setting `tslint.ignoreDefinitionFiles`.

## 0.5.15
- Watch for changes in the tslint.json when the file is located outside of the workspace.

## 0.5.13
- Handle the case where a user edits a `tslint.json` configuration file and it is in an intermediate inconsistent state gracefully.

## 0.5.8
- protect against exceptions thrown by tslint.

## 0.5.5
- `tslint.json` is now validated using a JSON schema.
- Diagnostic messages produced by tslint are now tagged with `tslint`.

## 0.5.4
- Added the `tslint.configFile` option.