## What?

Keep track of what you're doing and the people in your life.

## State

Early alpha. Base structures are more or less done. See "Next" for next steps.

## Features

* Create people
* Add properties to them
* Add relations between people
* Add diary entries
* Tag people in diary entries
* Add tags to diary entries

## Next

* Yearly calendar: When did I use which tag in my diary entry? --> track things like workouts
* Yearly calendar: Date-based properties
* Per property: overview page (e.g. page of all phone numbers)
* Editable relationship graph
* Previous/next buttons when viewing a diary entry
* Full-text diary search
* Overview page: diary tags

## Develop and use

Download

```bash
git clone https://github.com/jens-ox/prm
cd prm
```

Install dependencies
```bash
cd prm/api
yarn
cd prm/ui
yarn
```

Run API
```bash
cd prm/api
yarn serve
```

Run UI
```bash
cd prm/ui
yarn serve
```