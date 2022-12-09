/*
 * Assignment 1: Paired Modelling
 * ------------------------------
 * Programming 2022, Interaction Design Bacherlor, Malmö University
 * 
 * This assignment is written by:
 * Name Surname
 * Name Surname
 * 
 * 
 * The template contains some sample code exemplifying the template code structure.
 * You can build on top of it, or remove the example values etc.
 * 
 * For instructions, see the Canvas assignment: https://mau.instructure.com/courses/11936/assignments/84965
 * For guidence on how to use the template, see the demo video:
 *
 */

// The state should contain all the "moving" parts of your program, values that change.
let state = Object.freeze({
    pointerEvent: { x: 0, y: 0 },
});


// The settings should contain all of the "fixed" parts of your programs, like static HTMLElements and paramaters.
const settings = Object.freeze({
    sample: {
        height: 100,
        width: 100,
        element: document.querySelector("#sample-output"),
    },
});


/**
 * Update the state object with the properties included in `newState`.
 * @param {Object} newState An object with the properties to update in the state object.
 */
function updateState(newState) {
    state = Object.freeze({ ...state, ...newState });
}


/**
 * Return `num` normalized to 0..1 in range min..max.
 * @param {number} num
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
function scale(num, min, max) {
    if (num < min) return 0;
    if (num > max) return 1;
    return (num - min) / (max - min);
}

/**
 * Return `num` transformed from the normalised 0..1 form back to the min..max form.
 * @param {number} num
 * @param {number} min 
 * @param {number} max 
 * @returns number
 */
function toAbsolute(num, min, max) {
    if (num < 0) return min;
    if (num > 1) return max;
    return (num * (max - min)) + min;
}

/**
 * This is where we put the code that transforms and outputs our data.
 * loop() is run every frame, assuming that we keep calling it with `window.requestAnimationFrame`.
 */
function loop() {
    const { pointerEvent } = state;
    const { sample } = settings;

    const mirroredPoint = {
        x: 1 - scale(pointerEvent.x, 0, window.innerWidth),
        y: 1 - scale(pointerEvent.y, 0, window.innerHeight),
    }

    const absolutePoint = {
        x: toAbsolute(mirroredPoint.x, 0, window.innerWidth) - (sample.width / 2),
        y: toAbsolute(mirroredPoint.y, 0, window.innerHeight) - (sample.height / 2),
    }

    sample.element.style.transform = `translate(${absolutePoint.x}px, ${absolutePoint.y}px)`;

    window.requestAnimationFrame(loop);
}


/**
 * Setup is run once, at the start of the program. It sets everything up for us!
 */
function setup() {
    const { sample } = settings;
    sample.element.style.height = `${sample.height}px`;
    sample.element.style.width = `${sample.width}px`;

    document.addEventListener("pointermove", function (event) {
        updateState({ pointerEvent: event });
    });

    loop();
}


setup(); // Always remember to call setup()!