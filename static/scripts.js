import * as PIXI from "https://cdn.skypack.dev/pixi.js@5.x";
import {
KawaseBlurFilter } from
"https://cdn.skypack.dev/@pixi/filter-kawase-blur@3.2.0";
import SimplexNoise from "https://cdn.skypack.dev/simplex-noise@3.0.0";
import hsl from "https://cdn.skypack.dev/hsl-to-hex";
import debounce from "https://cdn.skypack.dev/debounce";


function random(min, max) {
  return Math.random() * (max - min) + min;
}


function map(n, start1, end1, start2, end2) {
  return (n - start1) / (end1 - start1) * (end2 - start2) + start2;
}


const simplex = new SimplexNoise();


class ColorPalette {
  constructor() {
    this.setColors();
    this.setCustomProperties();
  }

  setColors() {

    this.hue = ~~random(220, 360);
    this.complimentaryHue1 = this.hue + 30;
    this.complimentaryHue2 = this.hue + 60;

    this.saturation = 95;
    this.lightness = 50;


    this.baseColor = hsl(this.hue, this.saturation, this.lightness);
    this.complimentaryColor1 = hsl(
    this.complimentaryHue1,
    this.saturation,
    this.lightness);


    this.complimentaryColor2 = hsl(
    this.complimentaryHue2,
    this.saturation,
    this.lightness);



    this.colorChoices = [
    this.baseColor,
    this.complimentaryColor1,
    this.complimentaryColor2];

  }

  randomColor() {

    return this.colorChoices[~~random(0, this.colorChoices.length)].replace(
    "#",
    "0x");

  }

  setCustomProperties() {

    document.documentElement.style.setProperty("--hue", this.hue);
    document.documentElement.style.setProperty(
    "--hue-complimentary1",
    this.complimentaryHue1);

    document.documentElement.style.setProperty(
    "--hue-complimentary2",
    this.complimentaryHue2);

  }}



class Orb {

  constructor(fill = 0x000000) {

    this.bounds = this.setBounds();

    this.x = random(this.bounds["x"].min, this.bounds["x"].max);
    this.y = random(this.bounds["y"].min, this.bounds["y"].max);


    this.scale = 1;


    this.fill = fill;


    this.radius = random(window.innerHeight / 6, window.innerHeight / 3);


    this.xOff = random(0, 1000);
    this.yOff = random(0, 1000);

    this.inc = 0.002;


    this.graphics = new PIXI.Graphics();
    this.graphics.alpha = 0.825;


    window.addEventListener(
    "resize",
    debounce(() => {
      this.bounds = this.setBounds();
    }, 250));

  }

  setBounds() {

    const maxDist =
    window.innerWidth < 1000 ? window.innerWidth / 3 : window.innerWidth / 5;

    const originX = window.innerWidth / 1.25;
    const originY =
    window.innerWidth < 1000 ?
    window.innerHeight :
    window.innerHeight / 1.375;


    return {
      x: {
        min: originX - maxDist,
        max: originX + maxDist },

      y: {
        min: originY - maxDist,
        max: originY + maxDist } };


  }

  update() {

    const xNoise = simplex.noise2D(this.xOff, this.xOff);
    const yNoise = simplex.noise2D(this.yOff, this.yOff);
    const scaleNoise = simplex.noise2D(this.xOff, this.yOff);


    this.x = map(xNoise, -1, 1, this.bounds["x"].min, this.bounds["x"].max);
    this.y = map(yNoise, -1, 1, this.bounds["y"].min, this.bounds["y"].max);

    this.scale = map(scaleNoise, -1, 1, 0.5, 1);


    this.xOff += this.inc;
    this.yOff += this.inc;
  }

  render() {

    this.graphics.x = this.x;
    this.graphics.y = this.y;
    this.graphics.scale.set(this.scale);


    this.graphics.clear();


    this.graphics.beginFill(this.fill);

    this.graphics.drawCircle(0, 0, this.radius);

    this.graphics.endFill();
  }}



const app = new PIXI.Application({

  view: document.querySelector(".orb-canvas"),

  resizeTo: window,

  transparent: true });


app.stage.filters = [new KawaseBlurFilter(30, 10, true)];


const colorPalette = new ColorPalette();


const orbs = [];

for (let i = 0; i < 10; i++) {if (window.CP.shouldStopExecution(0)) break;
  const orb = new Orb(colorPalette.randomColor());

  app.stage.addChild(orb.graphics);

  orbs.push(orb);
}window.CP.exitedLoop(0);


if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  app.ticker.add(() => {
    orbs.forEach(orb => {
      orb.update();
      orb.render();
    });
  });
} else {
  orbs.forEach(orb => {
    orb.update();
    orb.render();
  });
}

document.
querySelector(".overlay__btn--colors").
addEventListener("click", () => {
  colorPalette.setColors();
  colorPalette.setCustomProperties();

  orbs.forEach(orb => {
    orb.fill = colorPalette.randomColor();
  });
});






function fetchVideoDetails(apiKey, videoId) {
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`;

  fetch(apiUrl).
  then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Request failed. Status:', response.status);
    }
  }).
  then(data => {
    if (data.items.length > 0) {
      const videoDetails = data.items[0];
      const title = videoDetails.snippet.title;
      const views = videoDetails.statistics ? videoDetails.statistics.viewCount : 'N/A';
      const categoryId = videoDetails.snippet.categoryId;
      const thumbnailUrl = videoDetails.snippet.thumbnails.maxres.url;
      const genre = determineGenre(categoryId);
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
          <p style="text-align:center; margin-bottom: 2vh;" ><b>Title:</b><br> ${title}</p>
          <p style="text-align:center; margin-bottom: 2vh;"><b>Views:</b><br> ${views}</p>
          <p style="text-align:center;  margin-bottom: 5vh;"><b>Category:</b><br> ${genre}</p>
          
          <div>
          <img src="${thumbnailUrl}" alt="Video Thumbnail" style="display: block; max-width:320px; border-radius:10px; max-height:320px; margin-left: auto; margin-right: auto;">
          </div>
          
        `;
    } else {
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = `
          <p style="margin-right: 9vw; font-size: 22px; margin-bottom:2vw;"><b>Invalid Video</b></p>
        `;
    }
  }).
  catch(error => {
    console.log('An error occurred while fetching video details:', error);
  });
}

function handleSubmit(event) {
  event.preventDefault();
  const videoUrl = document.getElementById('videoUrl').value;
  const apiKey = 'AIzaSyB_bBcJBvuoYaGVDRR76KqxdcMw-yyvO98';
  const videoId = videoUrl.split('v=')[1];
  console.log(videoId);

  fetchVideoDetails(apiKey, videoId);
}

function determineGenre(categoryId) {

  switch (categoryId) {
    case '1':
      return 'Film & Animation';
    case '2':
      return 'Autos & Vehicles';
    case '10':
      return 'Music';
    case '15':
      return 'Pets & Animals';
    case '17':
      return 'Sports';
    case '18':
      return 'Short Movies';
    case '19':
      return 'Travel & Events';
    case '20':
      return 'Gaming';
    case '21':
      return 'Video Blogging';
    case '22':
      return 'People & Blogs';
    case '23':
      return 'Comedy';
    case '24':
      return 'Entertainment';
    case '25':
      return 'News & Politics';
    case '26':
      return 'Howto & Style';
    case '27':
      return 'Education';
    case '28':
      return 'Science & Technology';
    case '29':
      return 'Nonprofits & Activism';
    case '30':
      return 'Movies';
    case '31':
      return 'Anime/Animation';
    case '32':
      return 'Action/Adventure';
    case '33':
      return 'Classics';
    case '34':
      return 'Comedy';
    case '35':
      return 'Documentary';
    case '36':
      return 'Drama';
    case '37':
      return 'Family';
    case '38':
      return 'Foreign';
    case '39':
      return 'Horror';
    case '40':
      return 'Sci-Fi/Fantasy';
    case '41':
      return 'Thriller';
    case '42':
      return 'Shorts';
    case '43':
      return 'Shows';
    case '44':
      return 'Trailers';
    default:
      return 'Unknown Genre';}

}

const videoFetch = document.getElementById('videoFetch');
videoFetch.addEventListener('click', handleSubmit);