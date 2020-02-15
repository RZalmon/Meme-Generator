'use strict';
const IMGS_IN_PAGE = 6;
const MEMES_KEY = 'memes';
var gNextId = 1;
var gImgs;
var gMeme;
var gMemes

var gCurrPage = 1;

function init() {
    gImgs = createImgs();
    gMemes = createMemes();
}

function getMeme() {
    return gMeme;
}

function changeFont(size) {
    if (gMeme.lines[gMeme.selectedLineIdx].size <= 0) return
    gMeme.lines[gMeme.selectedLineIdx].size += size;
}

function changeLocation(toY) {
    if (gMeme.lines[gMeme.selectedLineIdx].y <= 25 || gMeme.lines[gMeme.selectedLineIdx].y >= gCanvas.height) return;
    gMeme.lines[gMeme.selectedLineIdx].y += toY;
}


function switchLine() {
    if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
        gMeme.selectedLineIdx = 0;
        return
    }
    gMeme.selectedLineIdx++;
}

function alignLine(direction) {
    gMeme.lines[gMeme.selectedLineIdx].align = direction;
}

function clearLine() {
    gMeme.lines[gMeme.selectedLineIdx].txt = '';
}

function changeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}

function changeBorder(color) {
    gMeme.lines[gMeme.selectedLineIdx].border = color;
}

function changePage(diff) {
    gCurrPage += diff;
    var lastPage = Math.ceil(gImgs.length / IMGS_IN_PAGE);

    if (gCurrPage > lastPage) gCurrPage = 1;
    else if (gCurrPage < 1) gCurrPage = lastPage;

}

function getImgsForDisplay() {
    var from = (gCurrPage - 1) * IMGS_IN_PAGE;
    var to = from + IMGS_IN_PAGE;
    return gImgs.slice(from, to);
}

function getImg(imgId) {
    var selectedImg = gImgs.find(img => {
        return imgId === img.id;
    });
    return selectedImg;
}


function changeText(text) {
    gMeme.lines[gMeme.selectedLineIdx].txt = text;
    return gMeme;
}

function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font;
}

function saveMeme(memeData) {
    gMemes.unshift(memeData);
    saveToStorage(MEMES_KEY, gMemes);
}

function getMemesForDisplay(){
    return gMemes;
}

function addLine() {
    if (gMeme.lines.length === 3) return;
    var newLine = {
        txt: '',
        size: 30,
        font: 'Impact',
        align: 'center',
        color: '#ffffff',
        border: '#000000',
        x: gCanvas.width / 2,
        y: gCanvas.height / 2,
    }
    gMeme.lines.push(newLine)
    gMeme.selectedLineIdx = 2;
}

function createMemes() {
    var memes = loadFromStorage(MEMES_KEY);
    if (memes) return memes;
    else return [];
}

function createMeme(imgId) {
    var meme = {
        selectedImgId: imgId,
        selectedLineIdx: 0,
        lines: [
            {
                txt: '',
                size: 30,
                font: 'Impact',
                align: 'center',
                color: '#ffffff',
                border: '#000000',
                x: gCanvas.width / 2,
                y: 50,
            },
            {
                txt: '',
                size: 30,
                font: 'Impact',
                align: 'center',
                color: '#ffffff',
                border: '#000000',
                x: gCanvas.width / 2,
                y: gCanvas.height - 50,
            }],
    }
    gMeme = meme;
    return meme;
}


function createImgs() {


    var imgs = [['Trump'], ['Puppies'], ['Sleep'], ['cat'], ['Success'], ['Aliens'], ['Baby'], ['Sarcastic'], ['Evil'],
    ['Obama'], ['Pride'], ['Social Test'], ['Cheers'], ['Matrix'], ['LOTR'], ['Spock'], ['Putin'], ['Toy Story']].map(createImg);
    return imgs
}



function createImg(keywords) {
    var img = {
        id: gNextId,
        imgUrl: `img-square/${gNextId++}.jpg`,
        keywords: keywords
    }
    return img;
}

