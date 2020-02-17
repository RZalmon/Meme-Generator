'use strict';
var gCanvas;
var gCtx;
var gIsMemeReady;


function onInit() {
    init();
    gCanvas = document.getElementById('my-canvas');
    gCtx = gCanvas.getContext('2d');
    renderImgs();
    gIsMemeReady = false;
}

function onImgClicked(imgId) {
    var elGalleryContainer = document.querySelector('.gallery-container');
    elGalleryContainer.style.display = 'none';
    var elMemeGenerator = document.querySelector('.generator-container');
    elMemeGenerator.style.display = 'flex';
    document.querySelector('.meme-text-input').value = '';
    resizeCanvas();
    var meme = createMeme(imgId);
    drawImg(meme.selectedImgId);
    document.querySelector('.change-fill').value = meme.lines[meme.selectedLineIdx].color;
    document.querySelector('.change-stroke').value = meme.lines[meme.selectedLineIdx].border;
}




function onChangeText(text) {
    changeText(text)
    renderMeme()
}

function onChangeFontSize(size) {
    changeFont(size);
    renderMeme();
}

function onChangeLocation(toY) {
    changeLocation(toY)
    renderMeme();
}

function onSwitchLine() {
    switchLine();
    renderMeme();
    var meme = getMeme();
    document.querySelector('.meme-text-input').value = meme.lines[meme.selectedLineIdx].txt;
    document.querySelector('.change-fill').value = meme.lines[meme.selectedLineIdx].color;
    document.querySelector('.change-stroke').value = meme.lines[meme.selectedLineIdx].border;
    document.querySelector('.font-picker').value = meme.lines[meme.selectedLineIdx].font;
}


function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL();
    elLink.href = data;
    elLink.download = 'Meme';
}


function onClearLine() {
    clearLine();
    renderMeme();
    var meme = getMeme();
    document.querySelector('.meme-text-input').value = meme.lines[meme.selectedLineIdx].txt;
}

function onAlignLine(direction) {
    alignLine(direction);
    renderMeme();
}

function onChangeColor(color) {
    changeColor(color);
    renderMeme();
    var meme = getMeme();
    document.querySelector('.change-fill').value = meme.lines[meme.selectedLineIdx].color;
}

function onChangeBorder(color) {
    changeBorder(color);
    renderMeme();
    var meme = getMeme();
    document.querySelector('.change-stroke').value = meme.lines[meme.selectedLineIdx].border;
}

function onDone() {
    var elGalleryContainer = document.querySelector('.gallery-container');
    elGalleryContainer.style.display = 'block';
    var elMemeGenerator = document.querySelector('.generator-container');
    elMemeGenerator.style.display = 'none';
}

function onAddLine() {
    addLine();
    renderMeme();
    var meme = getMeme();
    document.querySelector('.meme-text-input').value = meme.lines[meme.selectedLineIdx].txt;
}

function onSetFont(font) {
    setFont(font);
    renderMeme();
}

function onOpenShareModal() {
    gIsMemeReady = true;
    renderMeme();
    document.body.classList.toggle('modal-open');
    var elShareModal = document.querySelector('.share-modal');
    elShareModal.classList.add('open-modal');
    document.querySelector('.pre-share-btn').style.display = 'block';
}

function onCloseModal() {
    gIsMemeReady = false;
    renderMeme();
    document.body.classList.toggle('modal-open');
    var elShareModal = document.querySelector('.share-modal');
    elShareModal.classList.remove('open-modal');
    document.querySelector('.share-container').innerHTML = '';
}


function onSaveMeme() {
    var memeData = gCanvas.toDataURL('image/jpeg');
    saveMeme(memeData);
    onCloseModal();
}

function renderMemes() {
    var memes = getMemesForDisplay();
    var htmlStrs = '';
    memes.forEach(meme => {
        var htmlStr = `<img src="${meme}" onclick="onMemeClicked()" />`
        htmlStrs += htmlStr;
    });
    document.querySelector('.memes-container').innerHTML = htmlStrs;
}


function renderMeme() {
    var meme = getMeme();
    var img = new Image()
    img.src = `./img-square/${meme.selectedImgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
        meme.lines.forEach(line => {
            var textToDisplay = line.txt;
            gCtx.font = `${line.size}px ${line.font}`;
            gCtx.lineWidth = '2';
            gCtx.strokeStyle = line.border;
            gCtx.fillStyle = line.color;
            gCtx.textAlign = line.align;
            gCtx.fillText(textToDisplay, line.x, line.y);
            gCtx.strokeText(textToDisplay, line.x, line.y)
        });
        if (!gIsMemeReady) focusLine(meme.lines[meme.selectedLineIdx].x, meme.lines[meme.selectedLineIdx].y);
    }
}

function drawImg(imgId) {
    var img = new Image()
    img.src = `./img-square/${imgId}.jpg`;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height)
    }
}

function focusLine(x, y) {
    var meme = getMeme();
    var line = meme.lines[meme.selectedLineIdx];
    var fontsize = line.size;
    var fontface = line.font;
    var lineHeight = fontsize * 1.286;
    var text = line.txt;
    gCtx.font = fontsize + 'px ' + fontface;
    var textWidth = gCtx.measureText(text).width;
    switch (line.align) {
        case 'right':
            gCtx.strokeRect(x - textWidth - 8, y - lineHeight + 10, textWidth + 17, lineHeight);
            break;
        case 'left':
            gCtx.strokeRect(x - 8, y - lineHeight + 10, textWidth + 17, lineHeight);
            break;
        default:
            gCtx.strokeRect(x - textWidth / 2 - 10, y - lineHeight + 10, textWidth + 17, lineHeight);
    }
}

function resizeCanvas() {
    var elContainer = document.querySelector('.canvas-container');
    gCanvas.width = elContainer.offsetWidth
    gCanvas.height = elContainer.offsetHeight
}


function renderImgs() {
    var imgs = getImgsForDisplay();
    var htmlStrs = '';
    imgs.forEach(img => {
        var htmlStr = `<img src="img-square/${img.id}.jpg" onclick="onImgClicked(${img.id})" />`
        htmlStrs += htmlStr;
    });
    document.querySelector('.gallery-items').innerHTML = htmlStrs;
}

function changeSection(sectionName, elLink) {
    //marks active page
    var nodeList = document.querySelectorAll('.main-menu a');
    var elLinks = Array.from(nodeList);
    elLinks.forEach(link => {
        link.classList.remove('active');
    });
    elLink.classList.add('active');
    var elGalleryContainer = document.querySelector('.gallery-container');
    var elAboutSection = document.querySelector('.about');
    var elMemesGalley = document.querySelector('.memes-gallery')
    var elMemeGenerator = document.querySelector('.generator-container');
    elMemeGenerator.style.display = 'none';
    if (sectionName === 'about') {
        elGalleryContainer.style.display = 'none';
        elAboutSection.style.display = 'flex';
        elMemesGalley.style.display = 'none';
        return
    }
    if (sectionName === 'gallery') {
        elGalleryContainer.style.display = 'block';
        elAboutSection.style.display = 'none';
        elMemesGalley.style.display = 'none';
        return
    }
    if (sectionName === 'memes') {
        elGalleryContainer.style.display = 'none';
        elAboutSection.style.display = 'none';
        elMemesGalley.style.display = 'block';
        renderMemes();
        return
    }
}

function onChangePage(diff) {
    changePage(diff)
    renderImgs();
}

function toggleMenu() {
    document.body.classList.toggle('menu-open');
}

