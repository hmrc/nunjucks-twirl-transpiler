# !! Experiment, not fit for use in its current state !!

## Nunjucks-Twirl-Transpiler

### Problem

GDS (GOV.UK) provide components in Nunjucks but in HMRC we tend to use Twirl.

### Proposed solution

Convert GDS's Nunjucks components into Twirl components

## Spike (experiment)

We approached this as an experiment, not expecting to produce production-ready maintainable code but looking for a
quick answer to whether or not this was possible.  One shortcut we took was to start with a fork of Nunjucks so we have
access to all the inner workings - that means a lot of this project is not actually relevant to the work we've done.

### Outcome

It looks possible, it is likely to be particularly time consuming to build and maintain this transpiler.

### Usage

1. Clone the project
2. `npm install`
3. Try it out with some of the built-in examples:

`node transpiler.js components-to-transpile/backlink.njk`
`node transpiler.js components-to-transpile/hint.njk`
`node transpiler.js components-to-transpile/panel.njk`

4. Try it out with some other nunjucks templates:

Copy the contents of a file for example [GOV.UK's Panel](https://github.com/alphagov/govuk-frontend/blob/8537275a6f26a3564acfb0c40883150c8973226e/src/govuk/components/panel/template.njk)
Run `pbpaste | node transpiler.js` and see the output or `pbpaste | node transpiler.js > ../panel.scala.html` 

