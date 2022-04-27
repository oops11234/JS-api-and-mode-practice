const jsonData = [];
let paginationData = [];

let currentCityData = '';
let currentTownData = '';
let curPage = 0;
let curMode = 0;
const showAmount = 10;

const elemLoadingPage = document.querySelector('#LoadingPage');
const elemCountySelector = document.querySelector('#CountySelector');
const elemTownSelector = document.querySelector('#TownSelector');
const elemModeSwitch = document.querySelector('#ModeSwitch');
const elemContent = document.querySelector('#Content');
const elemResTableContent = document.querySelector('#ResTableContent');
const elemPageNum = document.querySelector('#PageNum');
const elemPageListContent = document.querySelector('#PageListContent');

const dataUrl = 'https://data.coa.gov.tw/Service/OpenData/ODwsv/ODwsvTravelFood.aspx';
const limitWordLen = 101;
const limitTableLen = 20;
const limitCardLen = 50;

const optionTemp = (item) => `<option value="${item}">${item}</option>`;
const listTemp = (item) => `
        <section class="res">
          ${item.Url === '' ? '' : `<a class="res__link" target="_blank" href="${item.Url}">`}
            <figure class="res__fig res__fig--cover">
              <img class="res__img"
                src="${item.PicURL}"
                alt="${item.Name}" 
                width="400" 
                height="267">
            </figure>
            <div class="res__text">
              <h2 class="res__title">${item.Name}</h2>
              <div class="res__info">
                <p class="res__flag">${item.City}</p>
                <p class="res__desc res__desc--vertical">${item.Town}</p>
              </div>
              <p class="res__paragh">${textLimit(item.FoodFeature, limitWordLen, '...')}</p>
            </div>
            ${item.Url === '' ? '' : `</a>`}
        </section>`;
const tableHeadTemp = () => `
        <table class="resTable">
          <thead class="resTable__hd">
            <tr class="resTable__title">
              <th class="resTable__th">編號</th>
              <th class="resTable__th">行政區域</th>
              <th class="resTable__th">鄉鎮區</th>
              <th class="resTable__th">商家</th>
              <th class="resTable__th">地址</th>
            </tr>
          </thead>
          <tbody class="resTable__content" id="ResTableContent">
          </tbody>
        </table>`;

const tableTemp = (item, i) => `
        <tr class="resTable__row ${i % 2 === 1 ? '' : ' resTable__row--stripe'}">
                <td class="resTable__td resTable__td--textRight">
                  ${curPage * showAmount + i + 1}
                </td>
                <td class="resTable__td">
                  ${item.City}
                </td>
                <td class="resTable__td resTable__td--minWidth">
                  ${item.Town}
                </td>
                <td class="resTable__td resTable__td--noWrap">
                ${item.Name}
                </td>
                <td class="resTable__td resTable__td--text">
                  ${textLimit(item.Address, limitTableLen)}
                  <p class="resTable__hideText">${item.Address}</p>
                </td>
            </tr>`;

const cardTemp = (item) => `
        <section class="grid__item">
          <figure class="cardRes">
          <img class="res__img"
            src="${item.PicURL}"
            alt="${item.Name}" 
            width="400" 
            height="267">
            <figcaption class="cardRes__text">
              <div class="cardRes__info">
                <p class="cardRes__flag">${item.City}</p>
                <p class="cardRes__desc cardRes__desc--italic">${item.Town}</p>
              </div>
              <h2 class="cardRes__title">${item.Name}</h2>
              <p class="cardRes__paragh">${textLimit(item.FoodFeature, limitCardLen, '')}</p>
            </figcaption>
          </figure>
        </section>`;
const btnTemp = (item, i) => `<button class="${i === curPage ? 'js-pageList__btn' : ''} pageList__btn" data-page="${i}" type="button">${i + 1}</button>`;


(async () => {
  setJsonData(await fetchData());
  elemCountySelector.innerHTML += strMaker(optionTemp, setCateData(jsonData, 'City'));
  const dataArr = setDataArray();
  dataPagination(dataArr);
  renderPageNum();
  elemPageListContent.innerHTML += strMaker(btnTemp, paginationData);
  modeRender();
  setListener();
  elemLoadingPage.remove();
})();

function setListener() {
  elemCountySelector.addEventListener('change', selectCountyEvent);
  elemTownSelector.addEventListener('change', selectTownEvent);
  elemModeSwitch.addEventListener('click', switchMode)
  elemPageListContent.addEventListener('click', switchPage);
};

async function fetchData() {
  try {
    const res = await fetch(dataUrl);
    return result = res.json();
  } catch (e) {
    console.log(e.message);
  };
};

function setJsonData(result) {
  result.forEach(item => {
    jsonData.push(item);
  });
};

function modeRender() {
  switch (curMode) {
    case 0:
      elemContent.classList.remove('grid');
      elemContent.innerHTML = strMaker(listTemp, paginationData[curPage]);
      break;
    case 1:
      elemResTableContent.innerHTML += strMaker(tableTemp, paginationData[curPage]);
      break;
    case 2:
      elemContent.classList.add('grid');
      elemContent.innerHTML = strMaker(cardTemp, paginationData[curPage]);
      break;
    default:
      break;
  }
}

function renderPageNum() {
  elemPageNum.textContent = `${curPage + 1} / ${paginationData.length}`;
};

function dataPagination(data, arr = []) {
  paginationData = [];
  data.forEach((item, i) => {
    arr.push(item);
    if ((i + 1) % showAmount === 0) {
      paginationData.push(arr.splice(0));
    } else if ((i + 1) === data.length) {
      paginationData.push(arr);
    };
  });
};

function setCateData(data, cate, arr = []) {
  arr = data.map(item => item[cate]);
  return [...new Set(arr)];
};

function strMaker(temp, data, str = '') {
  data.map((item, i) => {
    str += temp(item, i);
  });
  return str;
};

function setDataArray(arr = []) {
  if (currentCityData !== '' && currentTownData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData && item.Town === currentTownData);
  } else if (currentCityData !== '') {
    arr = jsonData.filter(item =>
      item.City === currentCityData);
  } else {
    arr = jsonData;
  };
  return arr;
};

function textLimit(str, length, symbol, limitStr = '') {
  if (str.length > length) {
    limitStr = str.substring(0, length - 1) + symbol;
    return limitStr;
  };
  return str;
};

function setInitPageData(dataArr = []) {
  curPage = 0;
  dataArr = setDataArray();
  dataPagination(dataArr);
  renderPageNum();
  elemPageListContent.innerHTML = strMaker(btnTemp, paginationData);
};

function selectCountyEvent(e) {
  const self = e.target;
  currentCityData = self.value;
  currentTownData = '';
  setInitPageData();
  elemTownSelector.innerHTML = `<option value="" disabled selected>請選擇鄉鎮區...</option>;`;
  elemTownSelector.innerHTML += strMaker(optionTemp, setCateData(paginationData[curPage], 'Town'));
  modeRender()
};

function selectTownEvent(e) {
  const self = e.target;
  currentTownData = self.value;
  setInitPageData();
  modeRender()
};

function switchMode(e) {
  const self = e.target.parentNode;
  const modeIndex = parseInt(self.dataset.mode, 10)
  if (self.nodeName === 'BUTTON' && modeIndex !== curMode) {
    elemModeSwitch.children[curMode].classList.remove('js-nav__switchBtn');
    curMode = modeIndex;
    modeRender();
    self.classList.add('js-nav__switchBtn');
  };
};

function switchPage(e) {
  const self = e.target;
  const pageIndex = parseInt(self.dataset.page, 10)
  if (self.nodeName === 'BUTTON' && pageIndex !== curPage) {
    elemPageListContent.children[curPage].classList.remove('js-pageList__btn');
    curPage = pageIndex;
    modeRender()
    self.classList.add('js-pageList__btn');
    renderPageNum();
  };
};