'use strict';

class Canvas {
  constructor() {
    // will be drawing on the 2d context of the canvas (can specify 3d if wanted)
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');
    this.state = {
      isDrawing: false, // flag, when mouse down is true and when mouse up is false
      lastX: 0,
      lastY: 0, // to draw a line between 2 points you need a starting x and y and an ending x and y
      hue: 0,
      direction: true,
      mode: 'btn--draw'
    };
  }

  setUpCanvas = () => {
    let { canvas, context, selectMode, addCanvasEvents, addBtnEvents } = this;

    // make the width and height of the canvas fill the entire window
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // set context stroke style, line join and lined cap
    context.strokeStyle = '#000';
    context.lineJoin = 'round';
    context.lineCap = 'round';
    context.lineWidth = 11;
    // context.globalCompositeOperation = 'multiply';

    selectMode();
    addCanvasEvents();
    addBtnEvents();
  };

  selectMode = event => {
    let { state, context } = this;
    let allBtns = document.querySelectorAll('button');
    allBtns.forEach(btn => {
      btn.classList.remove('selected');
    });
    if (event) {
      state.mode = event.target.id;
      if (event.target.id === 'btn--draw') {
        context.lineWidth = 11;
      }
    }

    let selectedBtn = document.querySelector(`#${state.mode}`);
    selectedBtn.classList.add('selected');
  };

  addCanvasEvents = () => {
    let { canvas, state, drawOnCanvas } = this;
    canvas.addEventListener('mousemove', drawOnCanvas);
    canvas.addEventListener('mousedown', event => {
      state.isDrawing = true;
      [state.lastX, state.lastY] = [event.offsetX, event.offsetY]; // could use offsetX and offsetY instead of clientX and clientY
    });
    canvas.addEventListener('mouseup', () => (state.isDrawing = false));
    canvas.addEventListener('mouseout', () => (state.isDrawing = false));
  };

  addBtnEvents = () => {
    let { selectMode, setUpCanvas, save } = this;
    let drawBtn = document.querySelector('#btn--draw');

    let clearBtn = document.querySelector('#btn--clear');

    let zenBtn = document.querySelector('#btn--zen');

    let saveBtn = document.querySelector('#btn--save');

    drawBtn.addEventListener('click', selectMode);
    zenBtn.addEventListener('click', selectMode);
    clearBtn.addEventListener('click', setUpCanvas);
    saveBtn.addEventListener('click', save);
  };

  save = () => {
    var c = document.querySelector('canvas');
    var d = c.toDataURL('image/png');
    var w = window.open('about:blank', 'image from canvas');
    w.document.write("<img src='" + d + "' alt='from canvas'/>");
    w.document.style.background = 'black';
    window.open(c.toDataURL('image/png'));
  };

  drawOnCanvas = event => {
    let { context, state } = this;
    if (!state.isDrawing) return;
    context.strokeStyle = `hsl(${state.hue}, 100%, 50%)`;
    // context.lineWidth = state.hue;
    context.beginPath(); // begin drawing the path
    context.moveTo(state.lastX, state.lastY); // starting
    context.lineTo(event.offsetX, event.offsetY); // ending
    context.stroke();
    [state.lastX, state.lastY] = [event.offsetX, event.offsetY]; // destructure the array
    state.hue++;
    if (state.hue === 360) {
      state.hue = 0;
    }
    if (state.mode === 'btn--zen') {
      if (context.lineWidth >= 200 || context.lineWidth <= 10) {
        state.direction = !state.direction;
      }
      if (state.direction) {
        context.lineWidth++;
      } else {
        context.lineWidth--;
      }
    }
  };
}

window.onload = () => {
  let canvas = new Canvas();
  canvas.setUpCanvas();
};
