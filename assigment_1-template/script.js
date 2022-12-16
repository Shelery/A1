/*
 * Assignment 1: Paired Modelling
 * ------------------------------
 * Programming 2022, Interaction Design Bacherlor, Malmö University
 *
 * This assignment is written by:
 * Anastasiia Kniazkina
 * Eszter Kovács
 *
 *
 * The template contains some sample code exemplifying the template code structure.
 * You can build on top of it, or remove the example values etc.
 *
 * For instructions, see the Canvas assignment: https://mau.instructure.com/courses/11936/assignments/84965
 * For guidence on how to use the template, see the demo video:
 *
 */

/**
 * This is where we put the code that transforms and outputs our data.
 * loop() is run every frame, assuming that we keep calling it with `window.requestAnimationFrame`.
 */
function loop() {
  // Make the light "breathe"
  // slow the animation down
  setTimeout(() => {
    let lights = document.querySelectorAll(".light");
    for (let light of lights) {
      light.style.background = `radial-gradient(gold, transparent 50%)`;
      light.style.opacity = `${Math.random()}`;
    }
    window.requestAnimationFrame(loop);
  }, 80);
}

/**
 * Setup is run once, at the start of the program. It sets everything up for us!
 */
function setup() {
  // Create audio object and set default values
  let audio = new Audio("wind-chimes-sound.mp3");

  audio.volume = 0;
  audio.autoplay = true;

  // Create a div for flame+light when screen touched
  document.addEventListener("pointerdown", (e) => {
    createElement("flame", e, 2.5);

    createElement("light", e, 4);
    // Define audio behavior

    //    start playing it after refresh
    if (audio.paused) {
      audio.play();
    }
    // at any touch, increase the volume, unless it is max
    if (audio.volume < 1) {
      // Round down the volume to 1 decimal
      //    Why?  +0.2 works as expected until 3rd touch
      //          when expected output: 0.6 instead 0.6000000X that could lead to unexpected values later
      audio.volume = Math.floor((audio.volume + 0.2) * 10) / 10;
    }
  });

  // Make the flame+light follow the pointer when it moves
  document.addEventListener("pointermove", (e) => {
    followPointer("flame", e, 2.5);

    followPointer("light", e, 4);
  });

  // remove the flame+light when finger lifted
  document.addEventListener("pointerup", (e) => {
    removeElement("flame", e.pointerId);

    removeElement("light", e.pointerId);
    // Decrease volume when finger removed unless it is already muted
    if (audio.volume > 0.1) {
      audio.volume = Math.floor((audio.volume - 0.2) * 10) / 10;
    }
  });

  // Update size and position of element based on pointer event
  function updateSizeAndPos(event, flame, ratio) {
    // set width of flame light
    flame.style.width = `${event.width * ratio}px`;
    flame.style.height = `${event.height * ratio}px`;
    // set postion of flame
    flame.style.left = `${event.pageX}px`;
    flame.style.top = `${event.pageY}px`;
  }

  function createElement(type, event, ratio) {
    if (type === "flame" || type === "light") {
      const element = document.createElement("div");
      element.classList.add(`${type}`);
      element.id = `${type}${event.pointerId}`;
      updateSizeAndPos(event, element, ratio);
      document.body.append(element);
    }
  }

  function followPointer(type, event, ratio) {
    if (type === "flame" || type === "light") {
      // find the HTML element that is the "object" of the current event
      const element = document.getElementById(`${type}${event.pointerId}`);
      if (element == null) return;
      updateSizeAndPos(event, element, ratio);
    }
  }

  function removeElement(type, pointerId) {
    if (type === "flame" || type === "light") {
      // find the HTML element that is the "object" of the current event:
      const element = document.getElementById(`${type}${pointerId}`);
      if (element == null) return;
      element.remove();
    }
  }
  loop();
}

setup(); // Always remember to call setup()!

// Possible improvements : make ratio randomized
//                         before the first pointerup event it won't start playing the sound effect
//                              ->store audioState in localStorage and set it playing at refresh
//                        didn't have the device with precise touchscreen that could take in changing values about touched surface
