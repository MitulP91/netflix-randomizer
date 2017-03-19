/**
 * @TODO: Investigate relative paths in the `manifest.json` file. Having difficulty
 *        getting this working if the `index.js` and `background.js` files are in a src/
 *        directory.
 *
 * @TODO: Consider renaming this to NetflixToolkit and implementing chrome extension menu
 *        functionality to offer various Netflix user enhancements. Essentially Netflix UI
 *        automation scripts. These would NOT require user authenticated data at all.
 */

/**
 * Log prefix to be used whenever logging to the console. Helps identify the source
 * of logs to prevent confusion.
 */
var LOG_PREFIX = '[NetflixRandomizerChromeExtension]';

/**
 * This objet contains the metadata required for this extension to properly access`
 * various Netflix UI elements. Helper functions that incorporate this data are included
 * in the NetflixRandomizer.
 *
 * @var {Object}
 */
var NETFLIX_UI_META_DATA = {
    actionBar: {
        selector: 'player-controls-wrapper',
        queryType: 'getElementsByClassName',
        unique: true,
        show: 'player-controls-wrapper no-select',
        hide: 'player-controls-wrapper no-select opacity-transparent display-none',
    },

    episodeContainer: {
        selector: 'player-menu-episode-selector',
        queryType: 'getElementById',
        unique: true,
        show: 'player-menu player-active player-visible',
        hide: 'player-menu player-active',
    },

    episodes: {
        selector: 'play-icon',
        queryType: 'getElementsByClassName',
        randomizable: true,
    },

    seasons: {
        selector: 'season',
        queryType: 'getElementsByClassName',
        randomizable: true,
    },
};

/**
 * Common string constants used to access Netflix UI elements.
 */
var ACTION_BAR = 'actionBar';
var EPISODES = 'episodes';
var EPISODE_CONTAINER = 'episodeContainer';
var SEASONS = 'seasons';

/**
 * Helper function to return a random number between 0 and the passed max parameter.
 *
 * @param {Integer} max
 * @return {Integer} randomInteger
 */
function getRandomNumberLessThan(max) {
    return Math.floor(Math.random() * max);
}

/**
 * This is the class responsible for randomizing Netflix episodes. The public API that should
 * be used includes the following methods:
 *
 * - NetfixRandomizer.randomize()
 */
function NetflixRandomizer() {
    this.metaData = NETFLIX_UI_META_DATA;
}

NetflixRandomizer.prototype.getMetaData = function() {
    return this.metaData;
};

/**
 * Retrieves the meta data for a given UI element.
 *
 * @param {String} elementName
 * The name of the element we want the meta data for.
 */
NetflixRandomizer.prototype.getMetaDataForElement = function(elementName) {
    if (!this.getMetaData()[elementName]) {
        console.log(LOG_PREFIX + '[getMetaDataForElement] ' + elementName + ' is not a defined UI element.');
        return;
    }

    return this.getMetaData()[elementName];
};

/**
 * Actually randomizes the episode for the current TV show being viewed on netflix.
 * Logs to console if the randomization fails.
 */
NetflixRandomizer.prototype.randomize = function() {
    if (!this.showElement(ACTION_BAR)) {
        console.log(LOG_PREFIX + ' Failed to randomize.');
        return;
    }

    if (!this.showElement(EPISODE_CONTAINER)) {
        console.log(LOG_PREFIX + ' Failed to randomize.');
        return;
    }

    var randomSeason = this.getRandomUIElement(SEASONS);
    if (!randomSeason) {
        console.log(LOG_PREFIX + ' Failed to randomize.');
        return;
    }
    console.log('Clicking season');
    randomSeason.click();

    var randomEpisode = this.getRandomUIElement(EPISODES);
    if (!randomEpisode) {
        console.log(LOG_PREFIX + ' Failed to randomize.');
        return;
    }
    console.log('Clicking episode initial');
    randomEpisode.click();

    setTimeout(function() {
        console.log('Clicking episode effective');
        randomEpisode.click();
    }, 100);
};

/**
 * Retrieves a given element from the Netflix UI as defined in the NETFLIX_UI_META_DATA
 * object.
 *
 * @param {String} elementName
 * The name of the element we want to retrieve.
 *
 * @return {element}
 * Returns either a specific DOM element or an array of DOM elements.
 */
NetflixRandomizer.prototype.getUIElement = function(elementName) {
    // Retrieve meta data for this particular element.
    var elementMetaData = this.getMetaData()[elementName];

    // Validate we have the required data.
    if (!elementMetaData) {
        console.log(LOG_PREFIX + '[getUIElement] ' + elementName + ' is not a defined UI element.');
        return;
    }

    if (!elementMetaData.queryType || !document[elementMetaData.queryType]) {
        console.log(LOG_PREFIX + '[getUIElement][' + elementName + '] Invalid query method.');
        return;
    }

    if (!elementMetaData.selector) {
        console.log(LOG_PREFIX + '[getUIElement][' + elementName + '] Failed to retrieve query selector');
        return;
    }

    // Use the defined properties to grab the correct elements from the DOM.
    var domQueryResult = document[elementMetaData.queryType](elementMetaData.selector);
    if (!domQueryResult) {
        console.log(LOG_PREFIX + '[getUIElement][' + elementName + '] No DOM elements found.');
        return;
    }

    // If the result was an array and we're looking for a unique result, return only the first returned element.
    if (elementMetaData.unique && domQueryResult.constructor === Array) {
        return domQueryResult[0];
    }

    // In the normal case, return all results returned.
    return domQueryResult;
};

/**
 * Often times we want to get a random element from a returned set such as a season
 * or an episode of a tv show that we want to select. This is a helper function to
 * retrieve a random element.
 *
 * The element must have the property `randomizable` set to true in the NETFLIX_UI_META_DATA
 * object.
 *
 * @param {String} elementName
 * The name of the element we want to retrieve.
 *
 * @return {element} randomElement
 */
NetflixRandomizer.prototype.getRandomUIElement = function(elementName) {
    var elementMetaData = NETFLIX_UI_META_DATA[elementName];

    if (!elementMetaData.randomizable) {
        console.log(LOG_PREFIX + '[getRandomUIElement] ' + elementName + ' is not a randomizable UI element.');
        return;
    }

    var domElements = this.getUIElement(elementName);
    var numElements = domElements.length;
    var randomElement = domElements[getRandomNumberLessThan(numElements)];

    return randomElement;
};

/**
 * Changes the classes on the passed element to their `show` state based on the
 * NETFLIX_UI_META_DATA object.
 *
 * @param {String} elementName
 * The name of the element we want to show.
 */
NetflixRandomizer.prototype.showElement = function(elementName) {
    var elementMetaData = this.getMetaDataForElement(elementName);

    // Confirm that we have a show state for this element.
    if (!elementMetaData.show) {
        console.log(LOG_PREFIX + '[showElement] ' + elementName + ' is not a showable UI element.');
        return;
    }

    var element = this.getUIElement(elementName);
    if (!element) {
        console.log(LOG_PREFIX + '[showElement][' + elementName + '] No DOM element found.');
        return;
    }

    element.classNames = elementMetaData.show;

    return true;
};

/**
 * Changes the classes on the passed element to their `hide` state based on the
 * NETFLIX_UI_META_DATA object.
 *
 * @param {String} elementName
 * The name of the element we want to hide.
 */
NetflixRandomizer.prototype.hideElement = function(elementName) {
    var elementMetaData = this.getMetaDataForElement(elementName);

    // Confirm that we have a hide state for this element.
    if (!elementMetaData.hide) {
        console.log(LOG_PREFIX + '[hideElement] ' + elementName + ' is not a hideable UI element.');
        return;
    }

    var element = this.getUIElement(elementName);
    if (!element) {
        console.log(LOG_PREFIX + '[hideElement][' + elementName + '] No DOM element found.');
        return;
    }

    element.classNames = elementMetaData.hide;

    return true;
};

function init() {
    var netflixRandomizer = new NetflixRandomizer();
    netflixRandomizer.randomize();
}

init();