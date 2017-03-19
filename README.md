# NetflixRandomizer
After discovering the FXNOW Simpsons World full series randomization feature, my friends and I decided we _needed_ this for Netflix TV
shows. Watching Futurama on full series random was the dream. So here we are.

NetflixRandomizer is a Google Chrome extension that will randomize episodes across seasons and episodes for the TV show that you
are currently viewing. It is required that you be on the TV show with an episode playing already.

Randomizing consecutive episodes automatically is not yet handled so the chrome extension icon will need to be clicked every time
you wish to load a new random episode. This is high on the list of priorities for new features.

This works by emulating clicks in the Netflix UI and then randomly selecting a season
and episode to play. Pretty simple.

## Planned Features
I would love for anyone to take the time to implement any additional features. Go ahead and open a PR if you're willing!
Here are a list of features that I would consider to be the most important right now:

- Add ability to automatically select next random episode once the current episode ends.
- Chromecast Support
- Persist in memory the watched episodes so that we don't repeat the same episode until a certain amount of time has passed or the cache is cleared
- Randomize movies (by category, regex string?)
- Randomize TV Show episodes within targeted seasons (I mean, who really wants to watch Community Season 4?)

## Unsupported Modes
This extension was built for the simple case of playing Netflix on Chrome on my laptop. Other use
cases have not been tested yet. I will keep a list of modes that are not supported here. It will be
updated as these are reported to me.

- Chromecast

## Troubleshooting
Due to the fact that the code that powers this extension is based on the Netflix UI, it is
brittle and could break based on layout updates to the Netflix web application. If you find
a situation where the app isn't working for you, please [submit an issue](https://github.com/MitulP91/netflix-randomizer/issues/new).